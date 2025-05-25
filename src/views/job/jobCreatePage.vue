<template>
  <IonPage>
    <DetailHeader 
      :title="`Publier une offre (${currentStep}/${Object.keys(stepComponents).length} Etapes)`" 
      :isBack="handleBackNavigation" 
    />

    <!-- Étapes du formulaire avec composants conditionnels -->
    <component 
      :is="currentStepComponent" 
      v-bind="stepProps"
    />


    <!-- Barre de navigation inférieure -->
    <ion-footer class="ion-no-border flex items-center py-4 px-4 gap-2">
      <!-- Bouton précédent -->
      <div
        class="rounded-md w-16 h-full flex items-center justify-center transition-all duration-200"
        :class="[
          isFirstStep ? 'bg-gray-200 opacity-45 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark cursor-pointer'
        ]"
        @click="handlePreviousStep"
      >
        <button :disabled="isFirstStep">
          <IcIcons
            name="RiArrowLeftLine"
            :class="isFirstStep ? 'opacity-100' : 'text-white'"
            :size="30"
          />
        </button>
      </div>

      <!-- Bouton continuer/enregistrer -->
      <AuthButton
        :title="isLastStep ? 'Enregistrer' : 'Continuer'"
        setcolor="bg-primary"
        :loading="jobStore.loading"
        :actions="handleStepAction"
      />
    </ion-footer>
  </IonPage>
</template>

<script setup lang="ts">
import { IonFooter, IonPage } from "@ionic/vue";
import { computed, onMounted, ref, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";

// Composants
import AuthButton from "@/components/buttons/authButton.vue";
import DetailHeader from "@/components/headers/DetailHeader.vue";
import IcIcons from "@/components/icons/IcIcons.vue";

// Composants d'étapes avec chargement asynchrone
const InformationsGeneralesJob = defineAsyncComponent(() => import("./_compoments/informationsGeneralesJob.vue"));
const TypeServiceJob = defineAsyncComponent(() => import("./_compoments/typeServiceJob.vue"));
const DetailsMissionJob = defineAsyncComponent(() => import("./_compoments/detailsMissionJob.vue"));
const NounouJob = defineAsyncComponent(() => import("./_compoments/nounouJob.vue"));
const FemmeDeMenageJob = defineAsyncComponent(() => import("./_compoments/femmeDeMenageJob.vue"));
const CriteresJob = defineAsyncComponent(() => import("./_compoments/criteresJob.vue"));
const RemunerationJob = defineAsyncComponent(() => import("./_compoments/remunerationJob.vue"));
const DateDebutJob = defineAsyncComponent(() => import("./_compoments/dateDebutJob.vue"));
const AutresInfosJob = defineAsyncComponent(() => import("./_compoments/autresInfosJob.vue"));

// Stores et hooks
import { useJobStore } from "@/stores/jobStore";
import { useJobHook } from "@/hooks/jobHooks/job.hooks";
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";

// Initialisation des hooks et stores
const { createJob, state } = useJobHook();
const jobStore = useJobStore();
const route = useRoute();
const router = useRouter();

// Mapping des composants d'étape
const stepComponents = {
  1: InformationsGeneralesJob,
  2: TypeServiceJob,
  3: DetailsMissionJob,
  4: NounouJob,
  5: FemmeDeMenageJob,
  6: CriteresJob,
  7: RemunerationJob,
  8: DateDebutJob,
  9: AutresInfosJob
};

// Computed properties
const currentStep = computed(() => jobStore.state.stepJob);
const isFirstStep = computed(() => currentStep.value === 1);
const isLastStep = computed(() => currentStep.value === 9);

const currentStepComponent = computed(() => {
  return stepComponents[currentStep.value as keyof typeof stepComponents];
});

const stepProps = computed(() => {
  // Vous pouvez ajouter ici des props spécifiques à chaque étape si nécessaire
  return {};
});

// Gestionnaires d'événements
const handleBackNavigation = () => {
  if (route.query.id) {

    router.go(-1);
  }
};

const handlePreviousStep = () => {
  if (!isFirstStep.value) {
    jobStore.previousStep();
  }
};

const handleStepAction = () => {
  const stepActions = {
    1: jobStore.InfoGeneralJob,
    2: jobStore.TypeServiceJob,
    3: jobStore.DetailsMissionJob,
    4: jobStore.NounouJob,
    5: jobStore.FemmeDeMenageJob,
    6: jobStore.CriteresJob,
    7: jobStore.RemunerationJob,
    8: jobStore.DateDebutJob,
    9: jobStore.AutresInfosJob
  };

  const currentStepAction = stepActions[currentStep.value as keyof typeof stepActions];
  
  if (currentStepAction) {
    currentStepAction();
  } else if (isLastStep.value) {
    createJob();
  }
};

// Fonction pour charger les détails d'un job existant
const fetchJobDetails = async () => {
  if (!route.query.id) return null;
  
  try {
    const response = await SettingServices().listSetting(
      URL_API_ROUTE.JOB_ONLY + `/${route.query.id}`
    );
    
    if (response) {
      jobStore.ChangeInputToEdit(response);
      return response;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors du chargement des détails du job:", error);
    return null;
  }
};

// Requête pour charger les détails du job si un ID est présent
const {
  data: jobDetails,
  isLoading: isLoadingJobDetails,
  isError: isErrorJobDetails
} = useQuery({
  queryKey: ["DetailJobs", route.query.id],
  queryFn: fetchJobDetails,
  enabled: !!route.query.id,
});

// Initialisation au montage du composant
onMounted(() => {
  // Vous pouvez ajouter ici des actions d'initialisation si nécessaire
});
</script>

<style scoped>
/* Transitions pour les boutons */
.transition-all {
  transition-property: all;
}

.duration-200 {
  transition-duration: 200ms;
}

/* Styles pour le bouton précédent */
.hover\:bg-primary-dark:hover {
  background-color: var(--ion-color-primary-shade);
}

/* Animation pour les changements d'étape */
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}

.component-enter-active {
  animation: fadeIn 0.3s ease-out;
}
</style>
