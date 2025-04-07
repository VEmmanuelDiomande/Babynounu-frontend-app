<template>
  <IonPage >
    <DetailHeader title="Publier une offre" :isBack="() =>  $route.query.id ? $router.push('/job/' + $route.query.id): $router.go(-1)" />

    <InformationsGeneralesJob v-show="useJobStore().state.stepJob == 1" />
    <TypeServiceJob v-show="useJobStore().state.stepJob == 2" />
    <DetailsMissionJob v-show="useJobStore().state.stepJob == 3" />
    <NounouJob v-show="useJobStore().state.stepJob == 4" />
    <FemmeDeMenageJob v-show="useJobStore().state.stepJob == 5" />
    <CriteresJob v-show="useJobStore().state.stepJob == 6" />
    <RemunerationJob v-show="useJobStore().state.stepJob == 7" />
    <DateDebutJob v-show="useJobStore().state.stepJob == 8" />
    <AutresInfosJob v-show="useJobStore().state.stepJob == 9" />

    <ion-footer class="ion-no-border flex items-center py-4 px-4 gap-2">
      <div
        class="rounded-md w-16 h-full flex items-center justify-center"
        :class="
          useJobStore().state.stepJob == 1
            ? ' bg-gray-200 opacity-45'
            : 'bg-primary'
        "
        @click="useJobStore().previousStep()"
      >
        <button>
          <IcIcons
            name="RiArrowLeftLine"
            :class="
              useJobStore().state.stepJob > 1 ? 'text-white' : 'opacity-100'
            "
            :size="30"
          />
        </button>
      </div>
      <AuthButton
        :title="useJobStore().state.stepJob == 9 ? 'Enregistré' : 'Continuer'"
        setcolor="bg-primary"
        :loading="useJobStore().loading"
        @click="
          useJobStore().state.stepJob == 1
            ? useJobStore().InfoGeneralJob()
            : useJobStore().state.stepJob == 2
            ? useJobStore().TypeServiceJob()
            : useJobStore().state.stepJob == 3
            ? useJobStore().DetailsMissionJob()
            : useJobStore().state.stepJob == 4
            ? useJobStore().NounouJob()
            : useJobStore().state.stepJob == 5
            ? useJobStore().FemmeDeMenageJob()
            : useJobStore().state.stepJob == 6
            ? useJobStore().CriteresJob()
            : useJobStore().state.stepJob == 7
            ? useJobStore().RemunerationJob()
            : useJobStore().state.stepJob == 8
            ? useJobStore().DateDebutJob()
            : useJobStore().state.stepJob == 9
            ? useJobStore().AutresInfosJob()
            : createJob()
        "
      />
    </ion-footer>
    
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonFooter,
  IonPage,
} from "@ionic/vue";

import { computed, onMounted, ref } from "vue";
import AuthButton from "@/components/buttons/authButton.vue";
import { useJobStore } from "@/stores/jobStore";
import { useJobHook } from "@/hooks/jobHooks/job.hooks";
import { useNounuStore } from "@/stores/nounu.store";
import InfoGeneralJob from "./_partiels/InfoGeneralJob.vue";
import InformationsGeneralesJob from "./_compoments/informationsGeneralesJob.vue";
import TypeServiceJob from "./_compoments/typeServiceJob.vue";
import DetailsMissionJob from "./_compoments/detailsMissionJob.vue";
import NounouJob from "./_compoments/nounouJob.vue";
import FemmeDeMenageJob from "./_compoments/femmeDeMenageJob.vue";
import DetailHeader from "@/components/headers/DetailHeader.vue";
import CriteresJob from "./_compoments/criteresJob.vue";
import RemunerationJob from "./_compoments/remunerationJob.vue";
import DateDebutJob from "./_compoments/dateDebutJob.vue";
import AutresInfosJob from "./_compoments/autresInfosJob.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { an } from "vitest/dist/reporters-5f784f42";

const { createJob, state } = useJobHook();
const route = useRoute();

onMounted(() => {
})

const DetailJobs = async () =>
  await SettingServices().listSetting(
    URL_API_ROUTE.JOB_ONLY + `/${route.query.id}`
  ).then((res) => {
    if (res) {
      console.log(res, dataDetailJobs.value);
    useJobStore().ChangeInputToEdit(res);
    }
  });
  const {
  data: dataDetailJobs,
  error: errorDetailJobs,
  isLoading: isLoadingDetailJobs,
  isError: isErrorDetailJobs,
} = useQuery({
  queryKey: ["DetailJobs", route.query.id],
  enabled: route.query.id !== undefined, // Activer uniquement si l'ID existe
  queryFn: async() => await DetailJobs(), // Passer l'ID à la fonction DetailJobs
 
});;

</script>
