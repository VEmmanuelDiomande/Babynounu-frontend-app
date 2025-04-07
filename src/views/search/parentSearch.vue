<template>
  <SearchContent
    :isLoading="LoadingSearch"
    :isError="ISErrorSearch"
    :filteredData="filteredData"
    emptyIcon="RiUser6Line"
    emptyHeading="Aucune parent disponible"
    emptySubHeading="Aucun parent disponible. Veuillez affiner votre recherche afin d'obtenir de meilleurs résultats."
    toCard="Parent"
    :isLoading_search="useParentStore().isLoading"
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


// Fetch data for parents
const {
  data: DataSearch,
  isLoading: LoadingSearch,
  isError: ISErrorSearch,
} = useQuery({
  queryKey: ["ListParents"],
  queryFn: async () => {
    const userId = await StorageUtils().getStore("nUser_Id");
    return await SettingServices().listSetting(
      URL_API_ROUTE.PARENT_FIND + "/?userId=" + userId.value
    );
  },
});

onMounted(() => {
  useParentStore().searchParent(useNounuStore().searchValueData);
});


// Filtered data for parents
const filteredData = computed(() => useParentStore().DataParents);

// Watch search value
const timeout:any = ref(null);

watch(
  () => useNounuStore().searchValueData,
  (newSearchValue) => {
    if (timeout.value) {
      clearTimeout(timeout.value);
    }
    timeout.value = setTimeout(() => {
      useParentStore().searchParent(newSearchValue);
    }, 500);
  }
);
</script>
