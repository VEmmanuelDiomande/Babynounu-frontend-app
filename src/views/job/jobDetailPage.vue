<template>
  <IonPage>
    <!-- Header -->
    <DetailHeader title="Details de l'offre" />

    <!-- Content -->
    <IonContent class="bg-gray-50 font-love" v-if="DataJobs?.id">
      <!-- Refresher -->
      <ion-refresher slot="fixed" @ionRefresh="_handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <PageLoader
        classCustom="h-[100vh] fixed inset-0"
        size="large"
        v-if="LoadingJobs"
      />

      <!-- Section Principale -->
      <div class="px-4 py-6" v-if="!LoadingJobs">
        <!-- Titre et Infos -->
        <div class="bg-white px-4 pb-6 animate-fade-in">
          <span class="text-2xl font-bold text-gray-900 mb-2">
            {{ DataJobs.titre }}
          </span>
          <div class="flex items-center gap-2 text-gray-600 mt-8 mb-4">
            <IcIcons name="RiBriefcaseFill" class="text-primary" />
            <span>{{
              DataJobs.preferences?.frequence_des_services[0]?.name
            }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600 mb-4">
            <IcIcons name="RiMapPinLine" class="text-primary" />
            <span>{{ DataJobs.preferences?.adress[0]?.name }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600 mb-4">
            <IcIcons name="RiMoneyEuroCircleLine" class="text-primary" />
            <span>{{ DataJobs.tarifPropose }} Fcfa</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <IcIcons name="RiTimeLine" class="text-primary" />
            <span>{{ DataJobs.preferences?.horaire_souhaites[0]?.name }}</span>
          </div>
        </div>

        <!-- Description -->
        <div
          class="mt-6 bg-white rounded-xl border-[1px] p-6 animate-fade-in-up"
        >
          <Heading2Text title="Description" />
          <p class="text-gray-700 leading-relaxed text-sm">
            {{ DataJobs.description }}
          </p>
        </div>

        <section class="divide-y divide-gray-200">
          <div v-for="pref in DataPreferences()">
            <div
              class="mt-2 bg-white rounded-xl p-6 flex flex-col gap-2 animate-fade-in-up"
              v-if="pref.isActive"
            >
              <Heading2Text :title="pref.title" :icon="pref.icon" />
              <ul
                class="list-disc list-inside text-gray-700 flex flex-col gap-1"
              >
                <li
                  v-for="(avantage, index) in pref.list"
                  :key="index"
                  class="text-sm"
                >
                  {{ avantage.name }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Description -->
        <div
          class="mt-6 bg-white rounded-xl border-[1px] p-6 animate-fade-in-up"
          v-if="DataJobs.descriptionComplementaire.length > 0"
        >
          <Heading2Text title="Description complementaire" />
          <p class="text-gray-700 text-sm leading-relaxed">
            {{ DataJobs.descriptionComplementaire }}
          </p>
        </div>

        <!-- Bouton Postuler -->
        <div
          class="mt-6 grid grid-cols-2 gap-1 animate-fade-in-up"
          v-if="useUserStore().userId == DataJobs?.user?.id"
        >
          <AuthButton
            :loading="isPendingDelete"
            :title="'Editer'"
            icon="RiPencilLine"
            setcolor="bg-white border-[1px] border-primary"
            :textcolor="'text-primary'"
            @click="OpenEditJob()"
          />
          <AuthButton
            @click="mutateDelete"
            :loading="isPendingDelete"
            icon="RiDeleteBinLine"
            :title="'Supprimer'"
            :setcolor="'bg-red-500'"
          />
        </div>
        <div class="mt-6 animate-fade-in-up" v-else>
          <AuthButton
            @click="mutate()"
            :disabled="useUserStore().typeProfil != 'nounu'"
            :loading="isPending"
            :title="
              DataJobs?.jobApplications?.length > 0 &&
              DataJobs?.jobApplications[0]?.is_apply
                ? 'Rétirer ma condidature'
                : 'Postuler maintenant'
            "
            :setcolor="[
              DataJobs?.jobApplications?.length > 0 &&
              DataJobs?.jobApplications[0]?.is_apply
                ? 'bg-gray-400 border-[1px] border-gray-400'
                : 'bg-primary',
              useUserStore().typeProfil != 'nounu' ? 'bg-gray-400/50' : '',
            ]"
          />
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonBackButton,
  IonButtons,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useQueryClient, useMutation, useQuery } from "@tanstack/vue-query";
import { useRoute } from "vue-router";
import DetailHeader from "@/components/headers/DetailHeader.vue";
import AuthButton from "@/components/buttons/authButton.vue";
import { StorageUtils } from "@/utils/store.utils";
import { useUserHook } from "@/hooks/userHooks/userHook";
import { useUserStore } from "@/stores/user.store";
import { useRouter } from "vue-router";
import { useRefetchHook } from "@/hooks/refetchHooks/refetch.hook";
import PageLoader from "@/components/loaders/pageLoader.vue";
import Heading2Text from "@/components/texts/heading2Text.vue";
import { useJobStore } from "@/stores/jobStore";
import { SocketService } from "@/services/socket.services";

const route = useRoute();
const queryClient = useQueryClient(); // Accès au cache global
const Pref = ref();
const router = useRouter();

const DetailJobs = async () =>
  await SettingServices().listSetting(
    URL_API_ROUTE.JOB_ONLY + `/${route.params.id}`
  );
const {
  data: DataJobs,
  error: ErrorJobs,
  isLoading: LoadingJobs,
  isError: ISErrorJobs,
  refetch,
} = useQuery({
  queryKey: ["DetailJobs", route.params.id],
  queryFn: DetailJobs,

  complete: (data: any) => {},
});
const { handleRefresh } = useRefetchHook();
const _handleRefresh = (event: any) => handleRefresh(event, refetch);

// Requête pour récupérer le détail d'un job
// Utilisation de TanStack Query pour gérer les requêtes
// et les erreurs
const CreateJobApplications = async () => {
  const settingServices = SettingServices();
  if (settingServices && settingServices.createSetting) {
    await settingServices
      .createSetting(URL_API_ROUTE.JOB_APPLICATION_CREATE, {
        is_apply: true,
        userId: DataJobs.value?.user?.id,
        jobId: route.params.id,
      })
      .then(async (res:any) => {
        if (res) {
          new SocketService().emit("getAllCountNotificationsByReceiverId", {
            receiverId: DataJobs.value?.user?.id,
          });
        }
      });
  }
};
const { mutate, isPending, isError, error, isSuccess } = useMutation({
  mutationKey: ["create-job-applications"],
  mutationFn: CreateJobApplications,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["DetailJobs", route.params.id],
    });
  },
});

const DeleteJobApplications = async () => {
  const settingServices = SettingServices();
  if (settingServices && settingServices.createSetting) {
    await settingServices.createSetting(
      `${URL_API_ROUTE.JOB_DELETE}/${route.params.id}`,
      {
        userId: (await StorageUtils().getStore("nUser_Id")).value,
        jobId: route.params.id,
      }
    );
  }
};
const {
  mutate: mutateDelete,
  isPending: isPendingDelete,
  isError: isErrorDelete,
  error: errorDelete,
  isSuccess: isSuccessDelete,
} = useMutation({
  mutationKey: ["delete-job-applications"],
  mutationFn: DeleteJobApplications,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["DetailJobs", route.params.id],
    });
    router.push({ name: "HOME_JOBS" });
  },
});

const DataPreferences = () => {
  Pref.value = DataJobs.value?.preferences;
  console.log(DataJobs.value?.preferences);
  return [
    {
      title: "Besoin spécifique",
      list: Pref.value?.besions_specifiques,
      isActive: Pref.value?.besions_specifiques?.length > 0,
      icon: "RiUserHeartLine",
    },
    {
      title: "Certifications",
      list: Pref.value?.certifications_criteres,
      isActive: Pref.value?.certifications_criteres?.length > 0,
      icon: "RiMedalFill",
    },
    {
      title: "Compétences spécifiques",
      list: Pref.value?.competance_specifique,
      isActive: Pref.value?.competance_specifique?.length > 0,
      icon: "RiLightbulbFlashLine",
    },
    {
      title: "Critères de sélection",
      list: Pref.value?.criteres_selections,
      isActive: Pref.value?.criteres_selections?.length > 0,
      icon: "RiCheckLine",
    },
    {
      title: "Equipement ménager",
      list: Pref.value?.equipement_menager,
      isActive: Pref.value?.equipement_menager?.length > 0,
      icon: "RiHomeLine",
    },
    {
      title: "Fréquence des services",
      list: Pref.value?.frequence_des_services,
      isActive: Pref.value?.frequence_des_services?.length > 0,
      icon: "RiCalendarLine",
    },
    {
      title: "Garde des enfants",
      list: Pref.value?.garde_enfants,
      isActive: Pref.value?.garde_enfants?.length > 0,
      icon: "RiParentLine",
    },
    {
      title: "Horaire souhaités",
      list: Pref.value?.horaire_souhaites,
      isActive: Pref.value?.horaire_souhaites?.length > 0,
      icon: "RiTimeLine",
    },
    {
      title: "Langue parlée",
      list: Pref.value?.langue_parler,
      isActive: Pref.value?.langue_parler?.length > 0,
      icon: "RiSpeakLine",
    },
    {
      title: "Type de services",
      list: Pref.value?.type_services,
      isActive: Pref.value?.type_services?.length > 0,
      icon: "RiBriefcaseLine",
    },
    {
      title: "Zone de travail",
      list: Pref.value?.zone_de_travail,
      isActive: Pref.value?.zone_de_travail?.length > 0,
      icon: "RiMapPinLine",
    },
  ];
};

const OpenEditJob = () => {
  useJobStore().isUpdateJob = true;
  useJobStore().state.stepJob = 1;
  router.replace({ name: "JOB_CREATE", query: { id: route.params.id } });
};
</script>

<style scoped>
/* Animations */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
