<template>
  <div class="grid grid-cols-1 gap-2 divide-y-[1px] font-love" v-if="JobData && JobData.length > 0">
    <div
      v-for="(item, index) in JobData"
      :key="item.id || index"
      class="w-11/12 m-auto text-black flex flex-col gap-4 py-4"
    >
      <!-- En-tête : Photo et informations -->
      <RouterLink
        v-if="!isOwner && hasParentInfo(item)"
        :to="{
          name: 'PROFIL_DETAIL_PARENT',
          params: { id: item?.user?.parent[0]?.id },
        }"
        class="flex items-center w-full"
      >
        <div class="size-12 rounded-full overflow-hidden border border-gray-100">
          <img
            v-lazy="getImageUrl(item)"
            :alt="`Photo de ${getParentName(item)}`"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>

        <div class="flex justify-between gap-4 w-[calc(100%-55px)] text-zinc-700 ml-2">
          <div class="flex flex-col gap-1 w-full">
            <div class="text-ng font-extrabold truncate w-auto font-love">
              {{ getParentName(item) }}
            </div>
            <div class="text-xs opacity-70 truncate w-auto font-semibold font-love">
              {{ getAddress(item) }} |
              {{ getChildrenCount(item) }} enfants
            </div>
          </div>

          <UrgentBadge v-if="item.missionUrgente" />
        </div>
      </RouterLink>

      <!-- Description et détails -->
      <div class="flex flex-col gap-1 cursor-pointer font-love" @click="redirectToJob(item)">
        <div>
          <span class="text-base opacity-80 font-bold line-clamp-3 mb-1">
            {{ item?.titre || 'Titre non disponible' }}
          </span>
          <p class="text-sm opacity-70 font-medium line-clamp-3">
            {{ item?.descriptionComplementaire || 'Description non disponible' }}
          </p>
        </div>

        <!-- Informations complémentaires -->
        <div>
          <CardJobInfo :seedDataInfo="getJobInfoData(item)" />
        </div>
      </div>

      <!-- Bouton de candidature -->
      <ApplyButton 
        v-if="isToApply && !isOwner" 
        :is-applied="!!item?.job_application?.[0]?.is_apply"
        :is-pending="isPending"
        @apply="applyForJob"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useAbonnementStore } from "@/stores/abonnementStore";
import { useRoute, useRouter } from "vue-router";
import { StorageUtils } from "@/utils/store.utils";
import { SettingServices } from "@/services/setting.services";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import CardJobInfo from "./cardJobInfo.vue";
import UrgentBadge from "@/components/buttons/UrgentBadge.vue";
import ApplyButton from "@/components/buttons/ApplyButton.vue";
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";

// Définition des types
interface JobItem {
  id: number;
  titre: string;
  descriptionComplementaire: string;
  tarifPropose: number;
  missionUrgente: boolean;
  image?: {
    originalUrl: string;
  };
  user: {
    id: string;
    parent: Array<{
      id: number;
      fullname: string;
      number_of_children: number;
    }>;
  };
  preferences?: {
    adress: Array<{ name: string }>;
    frequence_des_services: Array<{ name: string }>;
    zone_de_travail: Array<{ name: string }>;
    horaire_souhaites: Array<{ name: string }>;
  };
  job_application?: Array<{
    is_apply: boolean;
  }>;
}



// Props
const props = defineProps({
  JobData: {
    type: Array<any>,
    required: true,
    default: () => []
  },
  isOwner: {
    type: Boolean,
    default: false
  },
  isToApply: {
    type: Boolean,
    default: false
  }
});

// Gestion des erreurs d'image
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = '/assets/default-avatar.png';
};

// Fonctions utilitaires pour accéder aux données de manière sécurisée
const hasParentInfo = (item: JobItem): boolean => {
  return !!item?.user?.parent && item.user.parent.length > 0;
};

const getParentName = (item: JobItem): string => {
  return hasParentInfo(item) ? item.user.parent[0].fullname : 'Nom non disponible';
};

const getChildrenCount = (item: JobItem): number => {
  return hasParentInfo(item) ? item.user.parent[0].number_of_children : 0;
};

const getAddress = (item: JobItem): string => {
  return item?.preferences?.adress?.[0]?.name || 'Adresse non spécifiée';
};

const getImageUrl = (item: JobItem): string => {
  return item?.image?.originalUrl || '/assets/default-avatar.png';
};

// Données pour les informations du job
const getJobInfoData = (item: JobItem) => {
  return [
    {
      icon: "RiCoinsFill",
      name: `${item.tarifPropose || 0} Fcfa`,
    },
    {
      icon: "RiBriefcaseFill",
      name: item.preferences?.frequence_des_services?.[0]?.name || 'Non spécifié',
    },
    {
      icon: "RiMapPin2Fill",
      name: item.preferences?.zone_de_travail?.[0]?.name || 'Non spécifié',
    },
    {
      icon: "RiTimeFill",
      name: item.preferences?.horaire_souhaites?.[0]?.name || 'Non spécifié',
    }
  ];
};

// Hooks pour la navigation
const router = useRouter();
const route = useRoute();

// Fonction pour ouvrir la modal d'abonnement
const openModalAbonnement = () => {
  const modal = document.getElementById("open-modal-abonnement");
  if (modal) modal.click();
};

// Fonction pour rediriger vers la page détaillée du job
const redirectToJob = async (job: JobItem) => {
  try {
    const userIdStore = await StorageUtils().getStore("nUser_Id");
    const userId = userIdStore?.value;
    const abonnementStore = useAbonnementStore();
    
    // Vérifier si l'utilisateur est le propriétaire ou a un abonnement
    if (job.user.id === userId || abonnementStore.isAbonnement) {
      router.push(`/job/${job.id}`);
    } else {
      // Vérifier si l'utilisateur peut accéder via iscroll
      return abonnementStore.iscroll(job.user.id === userId)
        ? router.push(`/job/${job.id}`)
        : openModalAbonnement();
    }
  } catch (error) {
    console.error("Erreur lors de la redirection:", error);
  }
};

// Mutation pour postuler à un job
const createJobApplication = async () => {
  try {
    const settingServices = SettingServices();
    const userId = (await StorageUtils().getStore("nUser_Id"))?.value;
    
    if (!userId) {
      throw new Error("ID utilisateur non disponible");
    }
    
    if (settingServices && settingServices.createSetting) {
      await settingServices.createSetting(URL_API_ROUTE.JOB_APPLICATION_CREATE, {
        is_apply: true,
        userId,
        jobId: route.params.id,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la candidature:", error);
    throw error;
  }
};

// Configuration de la mutation
const queryClient = useQueryClient();
const { mutate: applyForJob, isPending } = useMutation({
  mutationKey: ["create-job-applications"],
  mutationFn: createJobApplication,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["ListProfilToApplys"],
    });
  },
  onError: (error:any) => {
    console.error("Erreur lors de la candidature:", error);
  }
});
</script>

<style scoped>


/* Animation pour les cartes */
.grid > div {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.grid > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Style pour le badge urgent */
.bg-red-500 {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}
</style>
