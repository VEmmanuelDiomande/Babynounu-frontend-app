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
      <template v-if="LoadingJobs && currentPage === 1">
        <PageLoader classCustom="h-[100vh] fixed inset-0" />
      </template>
      <template v-else-if="ISErrorJobs">
        <E404Error />
      </template>
      <EmptyError
        v-else-if="accumulatedJobs.length === 0"
        nameIcons="RiBriefcaseLine"
        heading="Aucune offre d'emploi"
        subHeading="Aucune offre d'emploi disponible. si vous être un parent, poser une offre d'emploi !"
      />
      <template v-else>
        <!-- Liste des propositions -->
        <section class="flex w-full mx-auto flex-col mt-4 mb-8 gap-4 font-love">
          <CardJob :JobData="accumulatedJobs" />
        </section>

        <!-- Pagination avec un seul bouton -->
        <div class="flex flex-col items-center font-love my-4 gap-2">
          <span class="text-sm text-gray-600">
            {{ accumulatedJobs.length }} sur
            {{ DataJobs?.pagination?.total || 0 }} offres affichées
          </span>

          <div
            v-if="DataJobs?.pagination?.hasNextPage"
            fill="outline"
            size="default"
            class="max-w-xs ring-2 ring-primary text-primary p-2 rounded-xl cursor-pointer"
            :class="{ 'opacity-50': isLoadingMore }"
            :disabled="LoadingJobs || isLoadingMore"
            @click="loadMore"
          >
            <span v-if="!isLoadingMore" class="font-love">Voir plus</span>
            <span v-else class="font-love">Chargement...</span>
          </div>
        </div>
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

// Interface pour les données d'emploi
interface Job {
  id: number;
  titre: string;
  description: string;
  [key: string]: any;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface JobResponse {
  data: Job[];
  pagination: Pagination;
}

// Configuration automatique des limites
const ITEMS_PER_PAGE = 20;

// Page courante et liste cumulative des emplois
const currentPage = ref(1);
const accumulatedJobs = ref<Job[]>([]);
const isLoadingMore = ref(false);

// Fonction pour récupérer la liste des emplois
const ListJobs = async (): Promise<JobResponse> => {
  const userId = await StorageUtils().getStore("userId");
  const searchValue = useJobStore().state.searchValueData || "";
  return await SettingServices().listSetting(
    URL_API_ROUTE.JOB_ALL +
      `/?userId=${userId.value}&page=${currentPage.value}&limit=${ITEMS_PER_PAGE}&search=${searchValue}`
  );
};

const {
  data: DataJobs,
  error: ErrorJobs,
  isLoading: LoadingJobs,
  isError: ISErrorJobs,
  refetch,
} = useQuery({
  queryKey: ["ListJobs", currentPage],
  queryFn: ListJobs,
});

// Observer les changements de données et mettre à jour accumulatedJobs
watch([DataJobs, currentPage], ([newData, newPage]) => {
  if (newData && newData.data) {
    if (newPage === 1) {
      accumulatedJobs.value = [...newData.data];
    } else {
      const uniqueIds = new Set(accumulatedJobs.value.map((item) => item.id));
      const newItems = newData.data.filter((item: { id: number }) => !uniqueIds.has(item.id));
      accumulatedJobs.value = [...accumulatedJobs.value, ...newItems];
    }
    isLoadingMore.value = false;
  }
});

// Fonction pour charger plus de données
const loadMore = () => {
  if (
    DataJobs.value?.pagination?.hasNextPage &&
    !LoadingJobs.value &&
    !isLoadingMore.value
  ) {
    isLoadingMore.value = true;
    currentPage.value++;
  }
};

// Délai avant actualisation des résultats de recherche
let searchTimeout: NodeJS.Timeout;

watch(
  () => useJobStore().state.searchValueData,
  (newSearchValue) => {
    if (searchTimeout) clearTimeout(searchTimeout); // Annuler l'ancien délai
    searchTimeout = setTimeout(() => {
      currentPage.value = 1; // Réinitialiser la page lors d'une nouvelle recherche
      accumulatedJobs.value = []; // Vider les résultats accumulés
      refetch(); // Relancer la recherche

      const uniqueIds = new Set(accumulatedJobs.value.map((item) => item.id));
      const newItems = DataJobs.value.data.filter((item: { id: number }) => !uniqueIds.has(item.id));
      accumulatedJobs.value = [...accumulatedJobs.value, ...newItems];
    }, 500); // Délai de 500ms avant de lancer la recherche
  }
);

// Recherche de job (fonction conservée pour compatibilité avec HeaderMenuLayout)
const searchJob = (searchValue: string) => {
  useJobStore().state.searchValueData = searchValue;
};

// Observer les changements de page pour charger plus de données
watch(currentPage, () => {
  refetch();
});

onMounted(() => {
  // Initialiser les données au montage
  if (DataJobs.value) {
    accumulatedJobs.value = DataJobs.value.data || [];
  }
});
</script>

<style scoped>
.font-love {
  font-family: var(--font-love, sans-serif);
}
</style>
