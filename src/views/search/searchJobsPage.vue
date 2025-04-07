<template>
  <IonPage>
    <HeaderMenuLayout
      :searchFunc="searchJob"
      Title="Rechercher"
      :searchDate="true"
      :countScroll="isCountScroll"
      :hasFilter="false"
    >
    <template v-slot:ContentSearchUp>
      <input
          type="text"
          :placeholder="'Rechercher...'"
          class="h-11 outline-none font-love text-base w-full bg-transparent border-5 active:outline-none"
          v-model="useJobStore().state.searchValueData"
          @keyup.enter="searchJob(useJobStore().state.searchValueData)"
        />
    </template>
    </HeaderMenuLayout>

    <IonContent :scroll-events="true" @ionScroll="onScrollJobs($event)">
      <template v-if="LoadingJobs">
        <PageLoader classCustom="h-[100vh] fixed inset-0"  />
      </template>
      <template v-else-if="ISErrorJobs">
        <E404Error />
      </template>
      <EmptyError
        v-else-if="filteredJobs && filteredJobs?.length == 0"
        nameIcons="RiBriefcaseLine"
        heading="Aucune offre d'emploi"
        subHeading="Aucune offre d'emploi disponible. si vous être un parent, poser une offre d'emploi !"
      />
      <template v-else>
        <!-- <div v-for="(job, index) in filteredJobs" :key="index"> -->
        <CardJob :JobData="filteredJobs" />
        <!-- </div> -->
      </template>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
import { useSearchHook } from "@/hooks/searchHooks/search.hook";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
import { IonContent, IonPage, IonSpinner } from "@ionic/vue";
import CardAccessHome from "../home/partials/cardAccessHome.vue";
import { useJobHook } from "@/hooks/jobHooks/job.hooks";
import { computed, onMounted, ref, watch } from "vue";
import { ScrollUtils } from "@/utils/scroll.utils";
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useQuery } from "@tanstack/vue-query";
import { useJobStore } from "@/stores/jobStore";
import PageLoader from "@/components/loaders/pageLoader.vue";
import { StorageUtils } from "@/utils/store.utils";
import CardJob from "../job/_partiels/cardJob.vue";
import EmptyError from "@/components/errors/empty.error.vue";
import E404Error from "@/components/errors/e404.error.vue";
import { useScrollStore } from "@/stores/scrollStore";

const { state } = useSearchHook();
const { state: stateJob } = useJobHook();


const { onScrollJobs } = useScrollStore();

const isCountScroll = computed(() => useScrollStore().countScrollJob);

defineProps(["Type"]);

const ListJobs = async () => {
  const userId = await StorageUtils().getStore("userId");
  return await SettingServices().listSetting(
    URL_API_ROUTE.JOB_ALL + "/?userId=" + userId.value
  );
};

const {
  data: DataJobs,
  error: ErrorJobs,
  isLoading: LoadingJobs,
  isError: ISErrorJobs,
} = useQuery({
  queryKey: ["ListJobs"],
  queryFn: ListJobs,
});

// Délai avant actualisation des résultats de recherche
let searchTimeout: NodeJS.Timeout;

watch(
  () => useJobStore().state.searchValueData,
  (newSearchValue) => {
    if (searchTimeout) clearTimeout(searchTimeout); // Annuler l'ancien délai
    searchTimeout = setTimeout(() => {
      searchJob(newSearchValue);
    }, 500); // Délai de 500ms avant de lancer la recherche
  }
);

// Recherche de job
const searchJob = (searchValue: string) => {
  useJobStore().DataJobs = [];
  const filteredData = useJobStore().state?.DataHiddenJobs?.filter((job: any) => {
    const name = job.titre.toLowerCase();
    return name.includes(searchValue.toLowerCase());
  });
  useJobStore().DataJobs = filteredData;
};

// Utilisation de computed pour filtrer les jobs selon la recherche
const filteredJobs = computed(() => {
  const searchValue = useJobStore().state.searchValueData?.toLowerCase() || "";
  return useJobStore().state.DataHiddenJobs?.filter((job: any) =>
    job.titre?.toLowerCase().includes(searchValue) || job.description?.toLowerCase().includes(searchValue)
  );
});

onMounted(() => {
  useJobStore().state.DataHiddenJobs = DataJobs;
});
</script>

<style scoped>
/* Vous pouvez personnaliser ici le style du loader ou d'autres éléments */
</style>
