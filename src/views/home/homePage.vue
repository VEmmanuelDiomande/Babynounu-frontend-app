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

      <PageLoader classCustom="h-[100vh] fixed inset-0" size="large" v-if="LoadingNounus" />
      <EmptyError
        v-else-if="!LoadingNounus && dataNounus?.length == 0"
        nameIcons="RiServiceLine"
        heading="Aucune nounou disponible"
        subHeading="Aucune nounou disponible. Si vous être une nounou, soyez la première à vous inscrire !"
      />

   
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
import { StorageUtils } from "@/utils/store.utils";
import EmptyError from "@/components/errors/empty.error.vue";

// State variables
const isRefreshing = ref(false);

// Function to fetch the list of nounus
const fetchNounus = async () => {
  try {
    const userId = await StorageUtils().getStore("nUser_Id");
    return await SettingServices().listSetting(URL_API_ROUTE.NOUNU_ALL+'/?userId='+ userId.value);
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
