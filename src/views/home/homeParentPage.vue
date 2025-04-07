<template>
  <ion-page :id="$route.name">
    <!-- Header -->
    <HomeHeader title="Baby Nounu" />

    <ion-content class="font-love">
      <!-- Refresher -->
      <ion-refresher slot="fixed" @ionRefresh="_handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <PageLoader
        class-custom="h-[100vh] fixed inset-0"
        size="large"
        v-if="LoadingJobs"
      />
      <div v-else-if="DataJobs && DataJobs?.length != 0">
        <PropositionJobParentProfil :DataJobs="DataJobs" />
      </div>
      <EmptyError
        v-else-if="DataJobs && DataJobs?.length == 0"
        nameIcons="RiBriefcaseLine"
        heading="Aucune offre d'emploi"
        subHeading="Aucune offre d'emploi disponible. si vous être un parent, poser une offre d'emploi !"
      />
      <E404Error v-else="isErrorJobs" />
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import HomeHeader from "@/components/headers/HomeHeader.vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import PropositionJobParentProfil from "../profil/_partials/propositionJobParentProfil.vue";
import { useQuery } from "@tanstack/vue-query";
import { SettingServices } from "@/services/setting.services";
import { useRefetchHook } from "@/hooks/refetchHooks/refetch.hook";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import PageLoader from "@/components/loaders/pageLoader.vue";
import EmptyError from "@/components/errors/empty.error.vue";
import E404Error from "@/components/errors/e404.error.vue";

const ListJobs = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.JOB_ALL);
const {
  data: DataJobs,
  error: ErrorJobs,
  isLoading: LoadingJobs,
  isError: ISErrorJobs,
  refetch,
} = useQuery({
  queryKey: ["ListJobs"],
  queryFn: ListJobs,
});

const { handleRefresh } = useRefetchHook();
const _handleRefresh = (event: any) => handleRefresh(event, refetch);
</script>
