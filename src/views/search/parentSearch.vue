<template>
  <SearchContent
    :isLoading="LoadingSearch && !isLoadingMore"
    :isError="ISErrorSearch"
    :filteredData="accumulatedData"
    :pagination="filteredData?.pagination"
    emptyIcon="RiUser6Line"
    emptyHeading="Aucune parent disponible"
    emptySubHeading="Aucun parent disponible. Veuillez affiner votre recherche afin d'obtenir de meilleurs résultats."
    toCard="Parent"
    :isLoading_search="useParentStore().isLoading"
    :isLoadingMore="isLoadingMore"
    @page-change="handlePageChange"
    @load-more="loadMoreData"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { useParentStore } from "@/stores/parent.store";
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import axios from "axios";
import { useNounuStore } from "@/stores/nounu.store";
import SearchContent from "./searchContent.vue";
import { ScrollUtils } from "@/utils/scroll.utils";
import { useScrollStore } from "@/stores/scrollStore";


const { onScroll } = useScrollStore();
const currentPage = ref(1);
const pageSize = ref(20); // Nombre d'éléments par page
const isLoadingMore = ref(false);
const accumulatedData = ref<any[]>([]);

// Fetch data for parents
const {
  data: DataSearch,
  isLoading: LoadingSearch,
  isError: ISErrorSearch,
  refetch
} = useQuery({
  queryKey: ["ListParents", currentPage, pageSize],
  queryFn: async () => {
    const userId = await StorageUtils().getStore("nUser_Id");
    return await SettingServices().listSetting(
      `${URL_API_ROUTE.PARENT_FIND}/?userId=${userId.value}&page=${currentPage.value}&limit=${pageSize.value}`
    );
  },
});

onMounted(async () => {
  await useParentStore().searchParent(useNounuStore().searchValueData, currentPage.value, pageSize.value);
  if (useParentStore().DataParents?.data) {
    accumulatedData.value = [...useParentStore().DataParents.data];
  }
});

// Observer les changements dans le store
watch(() => useParentStore().DataParents, (newData) => {
  if (newData && newData.data) {
    if (currentPage.value === 1) {
      // Si c'est la première page, remplacer les données
      accumulatedData.value = [...newData.data];
    } else {
      // Sinon, ajouter les nouvelles données
      // Utiliser un Set pour éviter les doublons (basé sur l'ID)
      const uniqueIds = new Set(accumulatedData.value.map(item => item.id));
      const newItems = newData.data.filter((item: { id: string | number }) => !uniqueIds.has(item.id));
      accumulatedData.value = [...accumulatedData.value, ...newItems];
    }
    isLoadingMore.value = false;
  }
});

// Filtered data for parents
const filteredData = computed(() => useParentStore().DataParents);

// Gestion du changement de page
const handlePageChange = (page: number) => {
  currentPage.value = page;
  useParentStore().searchParent(useNounuStore().searchValueData, page, pageSize.value);
  // Remonter en haut de la page lors du changement de page
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Fonction pour charger plus de données
const loadMoreData = async () => {
  if (isLoadingMore.value) return;
  
  isLoadingMore.value = true;
  currentPage.value += 1;
  await useParentStore().searchParent(useNounuStore().searchValueData, currentPage.value, pageSize.value);
};

// Watch search value
const timeout:any = ref(null);

watch(
  () => useNounuStore().searchValueData,
  (newSearchValue) => {
    if (timeout.value) {
      clearTimeout(timeout.value);
    }
    // Réinitialiser la page à 1 et vider les données accumulées lors d'une nouvelle recherche
    currentPage.value = 1;
    accumulatedData.value = [];
    
    timeout.value = setTimeout(() => {
      useParentStore().searchParent(newSearchValue, currentPage.value, pageSize.value);
    }, 500);
  }
);
</script>
