<template>
  <IonPage>
    <!-- Header -->
    <HomeHeader title="Baby Nounu" />

    <!-- Content -->
    <IonContent class="w-full ion-padding">
      <!-- Refresher -->
      <IonRefresher slot="fixed" @ionRefresh="_handleRefresh">
        <IonRefresherContent />
      </IonRefresher>

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

        <!-- Pagination principale -->
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
  </IonPage>
</template>

<script lang="ts" setup>
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/vue";
import { ref, onMounted, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";

import HomeHeader from "@/components/headers/HomeHeader.vue";
import CardAccessHome from "./partials/cardAccessHome.vue";
import PageLoader from "@/components/loaders/pageLoader.vue";

import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";
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

// Gérer le rafraîchissement complet (réinitialiser la pagination)
const _handleRefresh = async (event: any) => {
  isRefreshing.value = true;
  currentPage.value = 1; // Réinitialiser à la première page
  try {
    await refetch();
  } finally {
    isRefreshing.value = false;
    event.detail.complete();
  }
};

// Fonction pour charger plus de données
const loadMoreData = async () => {
  if (isLoadingMore.value) return;

  isLoadingMore.value = true;
  currentPage.value += 1;
  try {
    await refetch();
  } finally {
    isLoadingMore.value = false;
  }
};
</script>
