<template>
  <IonPage :id="$route.name">
    <!-- Header -->
    <HomeHeader title="Baby Nounu" />

    <IonContent class="font-love">
      <!-- Refresher -->
      <IonRefresher slot="fixed" @ionRefresh="handleRefreshLocal">
        <IonRefresherContent />
      </IonRefresher>

      <!-- États de chargement et d'affichage -->
      <template v-if="(isLoading || isFetching) && currentPage === 1">
        <PageLoader class-custom="h-[100vh] fixed inset-0" size="large" />
      </template>

      <template v-else-if="isError">
        <E404Error />
      </template>

      <template v-else-if="allJobs.length > 0">
        <!-- Proposition -->
        <section class="flex w-full mx-auto flex-col mt-4 mb-8 gap-4 font-love">
          <!-- Liste des propositions -->
          <CardJob :JobData="allJobs" />
        </section>

        <!-- Pagination avec un seul bouton -->
        <div class="flex flex-col items-center font-love my-4 gap-2">
          <span class="text-sm text-gray-600 hidden">
            {{ allJobs.length }} sur {{ data?.pagination?.total || 0 }} offres affichées
          </span>
          
          <div
            v-if="data?.pagination?.hasNextPage"
            fill="outline"
            size="default"
            class="max-w-xs ring-2 ring-primary text-primary p-2 rounded-xl"
            :class="{ 'opacity-50 pointer-events-none': isFetching }"
            @click="loadMore"
          >
            <span v-if="!(isLoadingMore && isFetching)" class="font-love" >Voir plus</span>
            <SpinnerLoader v-else size="small" color="white" />
          </div>
        </div>
      </template>

      <template v-else>
        <EmptyError
          nameIcons="RiBriefcaseLine"
          heading="Aucune offre d'emploi"
          subHeading="Aucune offre d'emploi disponible. Si vous êtes un parent, proposez une offre d'emploi !"
        />
      </template>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { onActivated, ref, watch } from "vue";
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  onIonViewWillEnter,
} from "@ionic/vue";
import type { RefresherCustomEvent } from "@ionic/vue";
import HomeHeader from "@/components/headers/HomeHeader.vue";
import PageLoader from "@/components/loaders/pageLoader.vue";
import EmptyError from "@/components/errors/empty.error.vue";
import E404Error from "@/components/errors/e404.error.vue";
import { useQuery } from "@tanstack/vue-query";
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import CardJob from "../job/_partiels/cardJob.vue";
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";

// Interface pour les données d'emploi
interface Job {
  id: number;
  title: string;
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
  data: any[];
  pagination: Pagination;
}

// Configuration automatique des limites
const ITEMS_PER_PAGE = 20;

// Page courante et liste cumulative des emplois
const currentPage = ref(1);
const allJobs = ref<Job[]>([]);

// Fonction pour récupérer la liste des emplois
const fetchJobs = async (): Promise<JobResponse> => {
  const response = await SettingServices().listSetting(
    URL_API_ROUTE.JOB_ALL + `?page=${currentPage.value}&limit=${ITEMS_PER_PAGE}`
  );
  return response;
};

// Configuration de la requête avec TanStack Query
const { refetch, isError, isLoading, isFetching, data } = useQuery<JobResponse, Error>({
  queryKey: () => ["ListJobs", currentPage.value],
  queryFn: fetchJobs,
  keepPreviousData: true,
  refetchOnWindowFocus: false,
  staleTime: 120000,
});

// Variable pour indiquer si un chargement supplémentaire est en cours
const isLoadingMore = ref(false);

// Observer les changements de données et mettre à jour allJobs
watch(
  data,
  (newData) => {
    if (newData && newData.data) {
      if (currentPage.value === 1) {
        // Si c'est la première page, remplacer les données
        allJobs.value = [...newData.data];
      } else {
        // Sinon, ajouter les nouvelles données
        // Utiliser un Set pour éviter les doublons (basé sur l'ID)
        const uniqueIds = new Set(allJobs.value.map((item) => item.id));
        const newItems = newData.data.filter((item: { id: number }) => !uniqueIds.has(item.id));
        allJobs.value = [...allJobs.value, ...newItems];
      }
      isLoadingMore.value = false;
    } else if (currentPage.value === 1) {
      // Si pas de données et on est sur la première page, réinitialiser
      allJobs.value = [];
    }
  },
  { deep: true }
);

// Fonction pour charger plus de données
const loadMore = () => {
  if (isFetching.value) return;
  if (data.value?.pagination?.hasNextPage && !isLoading.value) {
    isLoadingMore.value = true;
    currentPage.value++;
  }
};

// Gestionnaire de rafraîchissement
const handleRefreshLocal = async (event: RefresherCustomEvent) => {
  currentPage.value = 1;
  allJobs.value = [];
  try {
    const result = await refetch();
    // Forcer la mise à jour des données après le rafraîchissement
    const refreshedList = result?.data?.data ?? data.value?.data ?? [];
    if (Array.isArray(refreshedList)) {
      allJobs.value = [...refreshedList];
    } else {
      allJobs.value = [];
    }
  } catch (error) {
    console.error("Erreur lors du rafraîchissement:", error);
  } finally {
    event.detail.complete();
  }
};

// Recharger les données à chaque entrée de la vue (navigation retour incluse)
onIonViewWillEnter(async () => {
  if (allJobs.value.length > 0) {
    // Données déjà présentes, ne pas recharger
    return;
  }
  try {
    const result = await refetch();
    const refreshedList = result?.data?.data ?? data.value?.data ?? [];
    if (Array.isArray(refreshedList)) {
      allJobs.value = [...refreshedList];
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données (willEnter):", error);
  }
});

// Recharger les données lors de l'activation du composant (fallback keep-alive)
onActivated(async () => {
  if (allJobs.value.length === 0) {
    try {
      const result = await refetch();
      const refreshedList = result?.data?.data ?? [];
      if (Array.isArray(refreshedList)) {
        allJobs.value = [...refreshedList];
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données à l'activation:", error);
    }
  }
});

// Observer les changements de page pour charger plus de données
watch(currentPage, async (newPage) => {
  try {
    await refetch();
    // Pas besoin de mettre à jour allJobs ici car le watch sur data s'en chargera
  } catch (error) {
    console.error(`Erreur lors du chargement de la page ${newPage}:`, error);
  }
});
</script>

<style scoped>

</style>
