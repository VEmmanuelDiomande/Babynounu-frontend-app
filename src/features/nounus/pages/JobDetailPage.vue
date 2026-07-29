<template>
  <div class="flex flex-col min-h-[calc(100vh-4rem)]">
    <div class="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="bg-white rounded-3xl p-6 shadow-sm animate-pulse">
        <div class="h-6 bg-gray-200 rounded-lg w-2/3 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded-lg w-1/2 mb-6"></div>
        <div class="space-y-2">
          <div class="h-3 bg-gray-200 rounded-lg w-full"></div>
          <div class="h-3 bg-gray-200 rounded-lg w-5/6"></div>
          <div class="h-3 bg-gray-200 rounded-lg w-3/4"></div>
        </div>
      </div>
    </div>

    <!-- Job detail -->
    <div v-else-if="job" class="space-y-5">
      <!-- Header card -->
      <div class="bg-white rounded-3xl p-6 shadow-sm">
        <div class="flex items-start gap-4 mb-4">
          <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img v-if="familyAvatar" :src="familyAvatar" alt="" class="h-full w-full object-cover" />
            <span v-else class="font-anton text-xl text-primary/40">{{ familyInitial }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="font-anton text-xl text-gray-900 leading-tight">{{ job.titre }}</h1>
            <p class="font-love text-sm text-gray-400 mt-1">{{ familyName }}</p>
            <p v-if="formattedDate" class="font-love text-xs text-gray-300 mt-0.5">Publiée le {{ formattedDate }}</p>
          </div>
          <span
            :class="[
              'px-3 py-1.5 rounded-full font-love text-xs font-medium flex-shrink-0',
              job.missionUrgente ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
            ]"
          >
            {{ job.missionUrgente ? 'Urgent' : 'Disponible' }}
          </span>
        </div>

        <!-- Tags row -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <span v-if="job.nombreEnfants" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
            <i class="ri ri-emotion-happy-line" style="font-size: 12px;"></i> {{ job.nombreEnfants }} enfant(s)
          </span>
          <span v-if="job.inclusWeekend" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
            <i class="ri ri-calendar-2-line" style="font-size: 12px;"></i> Week-end inclus
          </span>
          <span v-if="job.negociable" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
            <i class="ri ri-hand-heart-line" style="font-size: 12px;"></i> Négociable
          </span>
          <span v-if="job.experienceMinimun" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
            <i class="ri ri-graduation-cap-line" style="font-size: 12px;"></i> Exp. requise
          </span>
          <span v-if="job.combinaisonService" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
            <i class="ri ri-stack-line" style="font-size: 12px;"></i> Combinaison de services
          </span>
          <span v-if="job.periode" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
            <i class="ri ri-time-line" style="font-size: 12px;"></i> {{ job.periode }}
          </span>
        </div>

        <!-- Price -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-50">
          <div>
            <span class="font-anton text-2xl text-primary">{{ job.tarifPropose || 'Non spécifié' }}</span>
            <span v-if="job.tarifPropose" class="font-love text-sm text-gray-400 ml-1">FCFA</span>
          </div>
          <div v-if="job.dateDebut" class="text-right">
            <p class="font-love text-xs text-gray-400">Date de début</p>
            <p class="font-love text-sm text-gray-700 font-medium">{{ job.dateDebut }}</p>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="bg-white rounded-3xl p-6 shadow-sm">
        <h2 class="font-anton text-lg text-gray-900 mb-3">Description</h2>
        <p class="font-love text-sm text-gray-600 leading-relaxed">{{ job.description }}</p>

        <div v-if="job.descriptionComplementaire" class="mt-4 pt-4 border-t border-gray-50">
          <h3 class="font-anton text-sm text-gray-900 mb-2">Informations complémentaires</h3>
          <p class="font-love text-sm text-gray-600 leading-relaxed">{{ job.descriptionComplementaire }}</p>
        </div>
      </div>

      <!-- Localisation & Zone de travail -->
      <div v-if="prefArray('adress').length || prefArray('zoneDeTravail').length" class="bg-white rounded-3xl p-6 shadow-sm">
        <h2 class="font-anton text-lg text-gray-900 mb-3">Localisation</h2>
        <div v-if="prefArray('adress').length" class="mb-3">
          <p class="font-love text-xs text-gray-400 mb-1.5">Adresse</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in prefArray('adress')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
              <i class="ri ri-map-pin-line" style="font-size: 12px;"></i> {{ item.name }}
            </span>
          </div>
        </div>
        <div v-if="prefArray('zoneDeTravail').length">
          <p class="font-love text-xs text-gray-400 mb-1.5">Zone de travail</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in prefArray('zoneDeTravail')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
              <i class="ri ri-road-map-line" style="font-size: 12px;"></i> {{ item.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Type de service & Tâches -->
      <div v-if="prefArray('typeServices').length || prefArray('taches').length" class="bg-white rounded-3xl p-6 shadow-sm">
        <h2 class="font-anton text-lg text-gray-900 mb-3">Type de service</h2>
        <div v-if="prefArray('typeServices').length" class="mb-3">
          <p class="font-love text-xs text-gray-400 mb-1.5">Service(s)</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in prefArray('typeServices')" :key="item.id" class="px-3 py-1.5 rounded-full bg-primary/5 text-primary font-love text-xs font-medium">
              <i class="ri ri-service-line" style="font-size: 12px;"></i> {{ item.name }}
            </span>
          </div>
        </div>
        <div v-if="prefArray('taches').length">
          <p class="font-love text-xs text-gray-400 mb-1.5">Tâches</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in prefArray('taches')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
              <i class="ri ri-checkbox-circle-line" style="font-size: 12px;"></i> {{ item.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Détails de la mission -->
      <div v-if="prefArray('frequenceDesServices').length || prefArray('horaireSouhaites').length" class="bg-white rounded-3xl p-6 shadow-sm">
        <h2 class="font-anton text-lg text-gray-900 mb-3">Détails de la mission</h2>
        <div v-if="prefArray('frequenceDesServices').length" class="mb-3">
          <p class="font-love text-xs text-gray-400 mb-1.5">Fréquence</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in prefArray('frequenceDesServices')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
              <i class="ri ri-repeat-line" style="font-size: 12px;"></i> {{ item.name }}
            </span>
          </div>
        </div>
        <div v-if="prefArray('horaireSouhaites').length">
          <p class="font-love text-xs text-gray-400 mb-1.5">Horaires souhaités</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in prefArray('horaireSouhaites')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
              <i class="ri ri-time-line" style="font-size: 12px;"></i> {{ item.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Garde d'enfants & Besoins spécifiques -->
      <div v-if="prefArray('gardeEnfants').length || prefArray('besionsSpecifiques').length || prefArray('trancheAgeEnfants').length" class="bg-white rounded-3xl p-6 shadow-sm">
        <h2 class="font-anton text-lg text-gray-900 mb-3">Garde d'enfants</h2>
        <div v-if="prefArray('gardeEnfants').length" class="mb-3">
          <p class="font-love text-xs text-gray-400 mb-1.5">Type de garde</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in prefArray('gardeEnfants')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
              <i class="ri ri-parent-line" style="font-size: 12px;"></i> {{ item.name }}
            </span>
          </div>
        </div>
        <div v-if="prefArray('trancheAgeEnfants').length" class="mb-3">
          <p class="font-love text-xs text-gray-400 mb-1.5">Tranche d'âge</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in prefArray('trancheAgeEnfants')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
              <i class="ri ri-child-line" style="font-size: 12px;"></i> {{ item.name }}
            </span>
          </div>
        </div>
        <div v-if="prefArray('besionsSpecifiques').length">
          <p class="font-love text-xs text-gray-400 mb-1.5">Besoins spécifiques</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in prefArray('besionsSpecifiques')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
              <i class="ri ri-heart-line" style="font-size: 12px;"></i> {{ item.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Compétences & Langues -->
      <div v-if="prefArray('competanceSpecifique').length || prefArray('langueParler').length" class="bg-white rounded-3xl p-6 shadow-sm">
        <h2 class="font-anton text-lg text-gray-900 mb-3">Compétences & Langues</h2>
        <div v-if="prefArray('competanceSpecifique').length" class="mb-3">
          <p class="font-love text-xs text-gray-400 mb-1.5">Compétences spécifiques</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in prefArray('competanceSpecifique')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
              <i class="ri ri-medal-line" style="font-size: 12px;"></i> {{ item.name }}
            </span>
          </div>
        </div>
        <div v-if="prefArray('langueParler').length">
          <p class="font-love text-xs text-gray-400 mb-1.5">Langues parlées</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in prefArray('langueParler')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
              <i class="ri ri-translate-2" style="font-size: 12px;"></i> {{ item.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Aide ménagère & Équipement -->
      <div v-if="prefArray('aideMenagere').length || prefArray('equipementMenager').length" class="bg-white rounded-3xl p-6 shadow-sm">
        <h2 class="font-anton text-lg text-gray-900 mb-3">Aide ménagère</h2>
        <div v-if="prefArray('aideMenagere').length" class="mb-3">
          <p class="font-love text-xs text-gray-400 mb-1.5">Aide ménagère</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in prefArray('aideMenagere')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
              <i class="ri ri-home-smile-line" style="font-size: 12px;"></i> {{ item.name }}
            </span>
          </div>
        </div>
        <div v-if="prefArray('equipementMenager').length">
          <p class="font-love text-xs text-gray-400 mb-1.5">Équipement ménager</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in prefArray('equipementMenager')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
              <i class="ri ri-tools-line" style="font-size: 12px;"></i> {{ item.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Critères de sélection -->
      <div v-if="job.experienceMinimun || job.anneeExperience || prefArray('certificationsCriteres').length || prefArray('criteresSelections').length" class="bg-white rounded-3xl p-6 shadow-sm">
        <h2 class="font-anton text-lg text-gray-900 mb-3">Critères de sélection</h2>
        <div class="space-y-3">
          <div v-if="job.experienceMinimun" class="flex items-center gap-2">
            <i class="ri ri-graduation-cap-line text-primary" style="font-size: 18px;"></i>
            <p class="font-love text-sm text-gray-600">Expérience minimum requise{{ job.anneeExperience ? ` : ${job.anneeExperience} an(s)` : '' }}</p>
          </div>
          <div v-if="prefArray('certificationsCriteres').length">
            <p class="font-love text-xs text-gray-400 mb-1.5">Certifications</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="item in prefArray('certificationsCriteres')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
                <i class="ri ri-shield-check-line" style="font-size: 12px;"></i> {{ item.name }}
              </span>
            </div>
          </div>
          <div v-if="prefArray('criteresSelections').length">
            <p class="font-love text-xs text-gray-400 mb-1.5">Critères de sélection</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="item in prefArray('criteresSelections')" :key="item.id" class="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 font-love text-xs">
                <i class="ri ri-filter-line" style="font-size: 12px;"></i> {{ item.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Médias -->
      <div v-if="jobMedias.length" class="bg-white rounded-3xl p-6 shadow-sm">
        <h2 class="font-anton text-lg text-gray-900 mb-3">Photos / Vidéos</h2>
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
          <div v-for="media in jobMedias" :key="media.id" class="aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <img v-if="isImage(media)" :src="getMediaUrl(media)" alt="" class="h-full w-full object-cover" />
            <div v-else class="h-full w-full flex items-center justify-center">
              <i class="ri ri-video-line text-gray-400" style="font-size: 28px;"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact info (admin / permissionné uniquement) -->
      <div v-if="canViewContact" class="bg-white rounded-3xl p-6 shadow-sm">
        <h2 class="font-anton text-lg text-gray-900 mb-3">Moyens de contact</h2>
        <p class="font-love text-sm text-gray-600">{{ job.moyensDeContact }}</p>
      </div>

      <!-- Stats footer -->
      <div class="flex items-center justify-between px-2">
        <span class="font-love text-xs text-gray-400 flex items-center gap-1.5">
          <i class="ri ri-group-line" style="font-size: 14px;"></i>
          {{ applicationCount }} candidature(s)
        </span>
      </div>

      <!-- Apply button -->
    </div>

    <!-- Not found -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <div class="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <i class="ri ri-briefcase-line text-gray-300" style="font-size: 40px;"></i>
      </div>
      <h3 class="font-anton text-lg text-gray-900 mb-1">Offre introuvable</h3>
      <p class="font-love text-sm text-gray-400">Cette offre n'existe plus ou a été supprimée.</p>
    </div>

    <!-- Error -->
    <div v-if="error" class="mt-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 20px;"></i>
      <p class="text-sm text-red-600 font-love">{{ error }}</p>
    </div>
    </div>

    <!-- Footer -->
    <footer v-if="job" class="bg-white border-t border-gray-100 px-4 sm:px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div class="max-w-5xl mx-auto flex gap-3">
        <button
          @click="applyToJob"
          :disabled="isApplyDisabled"
          :class="[
            'flex-1 py-3.5 rounded-2xl font-love font-semibold text-sm transition-all',
            isOwner
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : hasApplied
                ? 'bg-green-100 text-green-600 cursor-default'
                : isApplyDisabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20'
          ]"
        >
          <span v-if="userIdLoading" class="flex items-center justify-center gap-2">
            <i class="ri ri-loader-4-line animate-spin" style="font-size: 16px;"></i> Vérification...
          </span>
          <span v-else-if="!currentUserId" class="flex items-center justify-center gap-2">
            <i class="ri ri-lock-line" style="font-size: 16px;"></i> Connexion requise
          </span>
          <span v-else-if="isOwner" class="flex items-center justify-center gap-2">
            <i class="ri ri-user-line" style="font-size: 16px;"></i> Votre offre
          </span>
          <span v-else-if="hasApplied" class="flex items-center justify-center gap-2">
            <i class="ri ri-check-line" style="font-size: 16px;"></i> Candidature envoyée
          </span>
          <span v-else-if="applying" class="flex items-center justify-center gap-2">
            <i class="ri ri-loader-4-line animate-spin" style="font-size: 16px;"></i> Envoi...
          </span>
          <span v-else>Postuler à cette offre</span>
        </button>
        <button
          @click="goToChat"
          class="px-5 py-3.5 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-all flex items-center gap-2"
        >
          <i class="ri ri-chat-3-line" style="font-size: 18px;"></i>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { StorageUtils } from '@/utils/store.utils';
import { getMediaUrl, getAvatarUrl } from '@/utils/media.utils';
import { useUserStore } from '@/stores/user.store';
import { useJobDetail, useApplyToJob } from '@/features/jobs/hooks/useJobs';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const jobId = computed(() => route.params.id as string);

// TanStack Query for job data
const { data: jobData, isLoading: jobLoading, error: jobError } = useJobDetail(jobId);
const { mutate: applyToJobMutation } = useApplyToJob();

const applying = ref(false);
const currentUserId = ref<string | null>(null);
const userIdLoading = ref(true);

onMounted(() => {
  StorageUtils().getStore('nUser_Id').then((res) => {
    currentUserId.value = res.value ?? null;
    userIdLoading.value = false;
  });
});

const job = computed(() => {
  const result = jobData.value;
  if (result && typeof result === 'object' && !Array.isArray(result) && !result.data) {
    return result;
  }
  return result?.data || null;
});

const loading = computed(() => jobLoading.value);

const error = computed(() => {
  const err = jobError.value;
  if (err) {
    return (err as any)?.response?.data?.message || (err as any)?.message || 'Erreur lors de la récupération de l\'offre';
  }
  return null;
});

const familyName = computed(() => {
  const user = job.value?.user;
  if (!user) return 'Famille';
  const nounu = user?.nounus?.[0];
  const parent = user?.parents?.[0];
  return parent?.fullname || nounu?.fullname || user?.email || 'Famille';
});

const familyAvatar = computed(() => {
  const medias = job.value?.user?.medias;
  if (medias && medias.length > 0) {
    return getAvatarUrl(medias) || getMediaUrl(medias[0]);
  }
  return null;
});

const familyInitial = computed(() => {
  const name = familyName.value;
  return name?.[0]?.toUpperCase() || 'F';
});

const formattedDate = computed(() => {
  if (!job.value?.createdAt) return '';
  const d = new Date(job.value.createdAt);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
});

const applicationCount = computed(() => {
  const apps = job.value?.jobApplications;
  return Array.isArray(apps) ? apps.length : 0;
});

const jobMedias = computed(() => {
  return job.value?.medias || [];
});

const isImage = (media: any) => {
  const url = getMediaUrl(media);
  const type = media?.typeMedia?.name || media?.type || '';
  if (type.toLowerCase().includes('video')) return false;
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url) || type.toLowerCase().includes('image') || (!type && url);
};

const prefArray = (key: string): any[] => {
  const prefs = job.value?.preferences;
  if (!prefs || !Array.isArray(prefs)) return [];
  return prefs
    .map((p: any) => p?.[key])
    .filter((v: any) => v != null);
};

const canViewContact = computed(() => {
  if (userStore.isAdmin) return true;
  if (userStore.hasPermission('admin.users.read')) return true;
  const uid = currentUserId.value;
  return !!uid && job.value?.userId === uid;
});

const isOwner = computed(() => {
  const uid = currentUserId.value;
  return !!uid && job.value?.userId === uid;
});

const hasApplied = computed(() => {
  const uid = currentUserId.value;
  if (!uid || !job.value?.jobApplications) return false;
  return job.value.jobApplications.some((app: any) =>
    app.userId === uid || app.user?.id === uid
  );
});

const isApplyDisabled = computed(() =>
  userIdLoading.value || !currentUserId.value || applying.value || isOwner.value || hasApplied.value
);

const applyToJob = async () => {
  const id = jobId.value;
  if (!id || !currentUserId.value || isOwner.value || hasApplied.value) return;

  applying.value = true;
  applyToJobMutation(id, {
    onSuccess: () => {
      applying.value = false;
    },
    onError: () => {
      applying.value = false;
    },
  });
};

const goToChat = () => {
  router.push({ name: 'CHAT_MESSAGE' });
};
</script>
