<template>
  <IonPage>
    <!-- Header -->
    <DetailHeader title="Details de l'offre" :isBack="() => $router.go(-1)" />

    <!-- Content -->
    <IonContent class="bg-gray-50 font-love" v-if="DataJobs?.id">
      <!-- Refresher -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Loader -->
      <PageLoader
        classCustom="h-[100vh] fixed inset-0"
        size="large"
        v-if="LoadingJobs"
      />

      <!-- Section Principale -->
      <div class="px-4 py-6" v-else>
        <!-- Titre et Infos -->
        <JobHeader :job="DataJobs" />

        <!-- Description -->
        <JobDescription :description="DataJobs.description" />

        <!-- Préférences -->
        <JobPreferences :preferences="DataJobs.preferences" />

        <!-- Description complémentaire -->
        <JobComplementaryDescription 
          v-if="hasComplementaryDescription" 
          :description="DataJobs.descriptionComplementaire" 
        />

        <!-- Boutons d'action -->
        <JobActions 
          :job="DataJobs" 
          :is-owner="isJobOwner" 
          :is-nounu="isNounuProfile"
          :is-pending="isPending"
          :is-pending-delete="isPendingDelete"
          @apply="mutate"
          @delete="mutateDelete"
          @edit="OpenEditJob"
        />
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { computed, ref, defineAsyncComponent, onMounted } from "vue";
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent
} from "@ionic/vue";

// Services et utilitaires
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import { SocketService } from "@/services/socket.services";

// Hooks et stores
import { useUserStore } from "@/stores/user.store";
import { useJobStore } from "@/stores/jobStore";
import { useRefetchHook } from "@/hooks/refetchHooks/refetch.hook";
import { useQueryClient, useMutation, useQuery } from "@tanstack/vue-query";
import { useRoute, useRouter } from "vue-router";

// Composants
import DetailHeader from "@/components/headers/DetailHeader.vue";
import PageLoader from "@/components/loaders/pageLoader.vue";

// Composants asynchrones
const JobHeader = defineAsyncComponent(() => import('./_partials/JobHeader.vue'));
const JobDescription = defineAsyncComponent(() => import('./_partials/JobDescription.vue'));
const JobPreferences = defineAsyncComponent(() => import('./_partials/JobPreferences.vue'));
const JobComplementaryDescription = defineAsyncComponent(() => import('./_partials/JobComplementaryDescription.vue'));
const JobActions = defineAsyncComponent(() => import('./_partials/JobActions.vue'));

// Initialisation
const route = useRoute();
const router = useRouter();
const queryClient = useQueryClient();
const userStore = useUserStore();
const jobStore = useJobStore();
const { handleRefresh: refreshHandler } = useRefetchHook();
const socketService = new SocketService();

// État local
const Pref = ref();

// Computed properties
const isJobOwner = computed(() => userStore.userId === DataJobs.value?.user?.id);
const isNounuProfile = computed(() => userStore.typeProfil === 'nounu');
const hasComplementaryDescription = computed(() => 
  DataJobs.value?.descriptionComplementaire?.length > 0
);

// Fonction pour récupérer les détails du job
const fetchJobDetails = async () => {
  try {
    return await SettingServices().listSetting(
      URL_API_ROUTE.JOB_ONLY + `/${route.params.id}`
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du job:", error);
    return null;
  }
};

// Requête pour récupérer le détail d'un job
const {
  data: DataJobs,
  isLoading: LoadingJobs,
  refetch
} = useQuery({
  queryKey: ["DetailJobs", route.params.id],
  queryFn: fetchJobDetails,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: 2
});

// Fonction pour gérer le rafraîchissement
const handleRefresh = (event: CustomEvent) => {
  refreshHandler(event, refetch);
};

// Fonction pour postuler à un job
const applyForJob = async () => {
  const settingServices = SettingServices();
  if (!settingServices || !settingServices.createSetting) return;

  const response = await settingServices.createSetting(
    URL_API_ROUTE.JOB_APPLICATION_CREATE, 
    {
      is_apply: true,
      userId: DataJobs.value?.user?.id,
      jobId: route.params.id,
    }
  );

  if (response) {
    socketService.emit("getNotifications", {
      userId: DataJobs.value?.user?.id,
    });
  }

  return response;
};

// Mutation pour postuler
const {
  mutate,
  isPending
} = useMutation({
  mutationKey: ["create-job-applications"],
  mutationFn: applyForJob,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["DetailJobs", route.params.id],
    });
  }
});

// Fonction pour supprimer un job
const deleteJob = async () => {
  const settingServices = SettingServices();
  if (!settingServices || !settingServices.createSetting) return;

  const userId = (await StorageUtils().getStore("nUser_Id")).value;
  
  return await settingServices.createSetting(
    `${URL_API_ROUTE.JOB_DELETE}/${route.params.id}`,
    {
      userId,
      jobId: route.params.id,
    }
  );
};

// Mutation pour supprimer
const {
  mutate: mutateDelete,
  isPending: isPendingDelete
} = useMutation({
  mutationKey: ["delete-job-applications"],
  mutationFn: deleteJob,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["DetailJobs", route.params.id],
    });
    router.push({ name: "HOME_JOBS" });
  }
});

// Fonction pour éditer un job
const OpenEditJob = () => {
  jobStore.isUpdateJob = true;
  jobStore.state.stepJob = 1;
  router.replace({ name: "JOB_CREATE", query: { id: route.params.id } });
};

// Initialisation au montage du composant
onMounted(() => {
  // Précharger les composants asynchrones
  JobHeader;
  JobDescription;
  JobPreferences;
  JobComplementaryDescription;
  JobActions;
});
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
  from { opacity: 0; }
  to { opacity: 1; }
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

/* Optimisation pour les appareils mobiles */
@media (max-width: 768px) {
  .px-4 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>
