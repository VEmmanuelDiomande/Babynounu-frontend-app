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

      <PageLoader size="large" v-if="LoadingNounus" />

      <ion-list lines="none">
        <!-- Loader -->
        <!-- <PageLoader v-if="" /> -->

        <!-- Grid of Cards -->
        <div
          v-if="!LoadingNounus && !isRefreshing"
          class="grid grid-cols-2 gap-1 w-full"
        >
          <div v-for="(nounu, index) in dataNounus" :key="index">
            <div class="">
              <CardAccessHome :data="nounu" :index="index + 1" />
            </div>
          </div>
        </div>
      </ion-list>
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
} from "@ionic/vue";
import { ref } from "vue";
import { useQuery } from "@tanstack/vue-query";

import HomeHeader from "@/components/headers/HomeHeader.vue";
import CardAccessHome from "./partials/cardAccessHome.vue";
import PageLoader from "@/components/loaders/pageLoader.vue";

import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";
import { useRefetchHook } from "@/hooks/refetchHooks/refetch.hook";

// State variables
const isRefreshing = ref(false);

// Function to fetch the list of nounus
const fetchNounus = async () => {
  try {
    return await SettingServices().listSetting(URL_API_ROUTE.NOUNU_ALL);
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
  queryKey: ["ListNounus"],
  queryFn: fetchNounus,
});


const { handleRefresh } = useRefetchHook()
const _handleRefresh = (event:any) => handleRefresh(event, refetch)
</script>
