<template>
  <ion-page>
    <!-- Header -->
    <HomeHeader title="Baby Nounu" />

    <!-- Content -->
    <IonContent class="w-full ion-padding">
      <!-- Refresher -->
      <ion-refresher slot="fixed" @ionRefresh="_handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <PageLoader
        classCustom="h-[100vh] fixed inset-0"
        size="large"
        v-if="LoadingNounus && !isLoadingMore"
      />
      <EmptyError
        v-else-if="!LoadingNounus && accumulatedData.length === 0"
        nameIcons="RiServiceLine"
        heading="Aucune nounou disponible"
        subHeading="Aucune nounou disponible. Si vous être une nounou, soyez la première à vous inscrire !"
      />

      <div
        v-if="(!LoadingNounus && !isRefreshing) || isLoadingMore"
        class="grid grid-cols-2 gap-1 w-full"
      >
        <div v-for="(nounu, index) in accumulatedData" :key="nounu.id || index">
          <div class="">
            <CardAccessHome :data="nounu" :index="index + 1" />
          </div>
        </div>

        <!-- Indicateur de chargement pour "charger plus" -->
        <div v-if="isLoadingMore" class="col-span-2 flex justify-center my-4">
          <SpinnerLoader size="medium" />
        </div>

        <!-- Pagination avec un seul bouton -->
        <div class="flex flex-col items-center font-love my-4 gap-2">
          <div
            v-if="dataNounus?.pagination?.hasNextPage"
            fill="outline"
            size="default"
            class="max-w-xs ring-2 ring-primary text-primary p-2 rounded-xl"
            :disabled="isLoadingMore"
            @click="loadMoreData()"
          >
            <span v-if="!isLoadingMore">Voir plus</span>
            <SpinnerLoader v-else size="small" color="white" />
          </div>
        </div>

        <!-- Bloc de pagination -->
        <div
          v-if="
            dataNounus?.pagination &&
            dataNounus.pagination.page < dataNounus.pagination.totalPages
          "
          class="flex justify-center items-center my-8 col-span-2 font-love"
        >
          <button
            @click="loadMoreData()"
            class="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors duration-300 flex items-center gap-2"
            :disabled="isLoadingMore"
          >
            <template v-if="isLoadingMore">
              <SpinnerLoader size="small" color="white" />
              Chargement...
            </template>
            <template v-else>
              Voir plus
              <IcIcons name="RiArrowRightLine" :size="20" color="white" />
            </template>
          </button>
        </div>
      </div>
      <template v-else-if="isErrorNounus">
        <E404Error />
      </template>
    </IonContent>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonButton,
} from "@ionic/vue";
import { ref, computed, onMounted, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";

import HomeHeader from "@/components/headers/HomeHeader.vue";
import CardAccessHome from "./partials/cardAccessHome.vue";
import PageLoader from "@/components/loaders/pageLoader.vue";

import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";
import { useRefetchHook } from "@/hooks/refetchHooks/refetch.hook";
import { StorageUtils } from "@/utils/store.utils";
import EmptyError from "@/components/errors/empty.error.vue";
import E404Error from "@/components/errors/e404.error.vue";
import IcIcons from "@/components/icons/IcIcons.vue";

// State variables
const isRefreshing = ref(false);
const isLoadingMore = ref(false);
const currentPage = ref(1);
const pageSize = ref(20); // Augmenter le nombre d'éléments par page
const accumulatedData = ref<any[]>([]);

// Function to fetch the list of nounus
const fetchNounus = async () => {
  try {
    const userId = await StorageUtils().getStore("nUser_Id");
    return await SettingServices().listSetting(
      `${URL_API_ROUTE.NOUNU_ALL}/?userId=${userId.value}&page=${currentPage.value}&limit=${pageSize.value}`
    );
  } catch (error) {
    console.error("Error fetching nounus:", error);
    throw error; // Ensure the error is propagated to `useQuery`
  }
};

// Vue Query for data fetching and state management
const {
  data: dataNounus,
  isError: isErrorNounus,
  isLoading: LoadingNounus,
  error: errorNounus,
  refetch,
} = useQuery({
  queryKey: ["ListNounus", currentPage, pageSize],
  queryFn: fetchNounus,
});

// Observer les changements de données et mettre à jour accumulatedData
watch(dataNounus, (newData) => {
  if (newData && newData.data) {
    if (currentPage.value === 1) {
      // Si c'est la première page, remplacer les données
      accumulatedData.value = [...newData.data];
    } else {
      // Sinon, ajouter les nouvelles données
      // Utiliser un Set pour éviter les doublons (basé sur l'ID)
      const uniqueIds = new Set(accumulatedData.value.map((item) => item.id));
      const newItems = newData.data.filter(
        (item: { id: string | number }) => !uniqueIds.has(item.id)
      );
      accumulatedData.value = [...accumulatedData.value, ...newItems];
    }
    isLoadingMore.value = false;
  }
});

// Initialiser les données au montage du composant
onMounted(async () => {
  const result: any = await refetch();
  if (result.data && result.data?.data) {
    accumulatedData.value = [...result.data?.data];
  }
});

const { handleRefresh } = useRefetchHook();

// Gérer le rafraîchissement complet (réinitialiser la pagination)
const _handleRefresh = async (event: any) => {
  isRefreshing.value = true;
  currentPage.value = 1; // Réinitialiser à la première page
  await refetch();
  isRefreshing.value = false;
  event.target.complete();
};

// Fonction pour charger plus de données
const loadMoreData = async () => {
  if (isLoadingMore.value) return;

  isLoadingMore.value = true;
  currentPage.value += 1;
  await refetch();
};

// Fonction pour générer les numéros de page à afficher
const getPageNumbers = () => {
  if (!dataNounus?.pagination) return [];

  const { currentPage: current, totalPages } = dataNounus.pagination;
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    // Afficher toutes les pages si le nombre total est inférieur à maxPagesToShow
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Calculer les pages à afficher
  let startPage = Math.max(current - Math.floor(maxPagesToShow / 2), 1);
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
};
</script>
