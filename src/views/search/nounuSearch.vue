<template>
  <SearchContent
    :isLoading="LoadingNounuSearch"
    :isError="ISErrorNounuSearch"
    :filteredData="filteredData"
    emptyIcon="RiServiceLine"
    emptyHeading="Aucune nounou disponible"
    emptySubHeading="Aucune nounou disponible. Veuillez affiner votre recherche afin d'obtenir de meilleurs résultats."
     toCard="Parent"
     :isLoading_search="useNounuStore().isLoading"
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


const { onScroll } = useScrollStore();

const isCountScroll = computed(() => useScrollStore().countScroll);

// Fetch data for nounus
const {
  data: DataNounuSearch,
  isLoading: LoadingNounuSearch,
  isError: ISErrorNounuSearch,
} = useQuery({
  queryKey: ["ListNounus"],
  queryFn: async () => {
    const userId = await StorageUtils().getStore("nUser_Id");
    return await SettingServices().listSetting(
      URL_API_ROUTE.NOUNU_ALL + "/?userId=" + userId.value
    );
  },
});

onMounted(() => {
  useNounuStore().searchNounu(useNounuStore().searchValueData);
});

// Filtered data for nounus
const filteredData = computed(() => useNounuStore().DataNounus);

// Watch search value

const timeout:any = ref(null);

watch(
  () => useNounuStore().searchValueData,
  (newSearchValue) => {
    if (timeout.value) {
      clearTimeout(timeout.value);
    }
    timeout.value = setTimeout(() => {
      useNounuStore().searchNounu(newSearchValue);
    }, 500);
  }
);
</script>
