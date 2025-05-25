<template>
  <SearchContent
    :isLoading="useNounuStore().isLoading && !isLoadingMore"
    :isError="useNounuStore().isError"
    :filteredData="accumulatedData"
    :pagination="filteredData?.pagination"
    emptyIcon="RiServiceLine"
    emptyHeading="Aucune nounou disponible"
    emptySubHeading="Aucune nounou disponible. Veuillez affiner votre recherche afin d'obtenir de meilleurs résultats."
    toCard="Parent"
    :isLoading_search="useNounuStore().isLoading"
    :isLoadingMore="isLoadingMore"
    @page-change="handlePageChange"
    @load-more="loadMoreData"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { useNounuStore } from "@/stores/nounu.store";
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import axios from "axios";
import SearchContent from "./searchContent.vue";
import { ScrollUtils } from "@/utils/scroll.utils";
import { useScrollStore } from "@/stores/scrollStore";

const currentPage = ref(1);
const pageSize = ref(20); // Augmenter le nombre d'éléments par page
const isLoadingMore = ref(false);
const accumulatedData = ref<any[]>([]);

onMounted(async () => {
  await useNounuStore().searchNounu(useNounuStore().searchValueData, currentPage.value, pageSize.value);
  if (useNounuStore().DataNounus?.data) {
    accumulatedData.value = [...useNounuStore().DataNounus.data];
  }
});

// Filtered data for nounus
const filteredData = computed(() => useNounuStore().DataNounus);

// Observer les changements dans le store
watch(() => useNounuStore().DataNounus, (newData) => {
  if (newData && newData.data) {
    if (currentPage.value === 1) {
      // Si c'est la première page, remplacer les données
      accumulatedData.value = [...newData.data];
    } else {
      // Sinon, ajouter les nouvelles données
      // Utiliser un Set pour éviter les doublons (basé sur l'ID)
      const uniqueIds = new Set(accumulatedData.value.map(item => item.id));
      const newItems = newData.data.filter((item: { id: number | string }) => !uniqueIds.has(item.id));
      accumulatedData.value = [...accumulatedData.value, ...newItems];
    }
    isLoadingMore.value = false;
  }
});

// Gestion du changement de page
const handlePageChange = (page: number) => {
  currentPage.value = page;
  useNounuStore().searchNounu(useNounuStore().searchValueData, page, pageSize.value);
  // Remonter en haut de la page lors du changement de page
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Fonction pour charger plus de données
const loadMoreData = async () => {
  if (isLoadingMore.value) return;
  
  isLoadingMore.value = true;
  currentPage.value += 1;
  await useNounuStore().searchNounu(useNounuStore().searchValueData, currentPage.value, pageSize.value);
};

// Watch search value
const timeout: any = ref(null);

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
      useNounuStore().searchNounu(newSearchValue, currentPage.value, pageSize.value);
    }, 500);
  }
);
</script>
