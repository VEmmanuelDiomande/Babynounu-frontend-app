<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6">
    <!-- Hero banner -->
    <div class="relative rounded-3xl overflow-hidden mb-6 bg-gradient-to-br from-primary via-rose-400 to-rose-500 shadow-lg shadow-rose-100">
      <div class="absolute inset-0 opacity-10">
        <img src="/images/backgrounds/bn_background_auth.jpg" alt="" class="h-full w-full object-cover" />
      </div>
      <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
      <div class="absolute -left-6 -bottom-10 h-28 w-28 rounded-full bg-white/10"></div>

      <div class="relative z-10 p-6 sm:p-8 text-white">
        <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white mb-3">
          <i class="ri ri-briefcase-line" style="font-size: 14px;"></i>
          <span class="font-love text-[10px] font-bold uppercase tracking-wider">Mes annonces</span>
        </div>
        <h1 class="font-anton text-2xl sm:text-3xl mb-2">Gérez vos offres</h1>
        <p class="font-love text-sm text-white/80 max-w-md mb-5">
          Suivez et gérez vos annonces de garde d'enfants.
        </p>

        <!-- Create button -->
        <button
          @click="goToCreateJob"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-primary font-love text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          <i class="ri ri-add-line" style="font-size: 18px;"></i>
          Créer une annonce
        </button>
      </div>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-rose-50">
        <div class="flex items-center gap-2 mb-1">
          <div class="h-8 w-8 rounded-xl bg-rose-50 flex items-center justify-center">
            <i class="ri ri-briefcase-line text-rose-400" style="font-size: 16px;"></i>
          </div>
          <span class="font-anton text-xl text-gray-900">{{ jobs.length }}</span>
        </div>
        <p class="font-love text-xs text-gray-400">Total annonces</p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-rose-50">
        <div class="flex items-center gap-2 mb-1">
          <div class="h-8 w-8 rounded-xl bg-red-50 flex items-center justify-center">
            <i class="ri ri-flashlight-line text-red-400" style="font-size: 16px;"></i>
          </div>
          <span class="font-anton text-xl text-gray-900">{{ urgentCount }}</span>
        </div>
        <p class="font-love text-xs text-gray-400">Urgentes</p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-rose-50">
        <div class="flex items-center gap-2 mb-1">
          <div class="h-8 w-8 rounded-xl bg-green-50 flex items-center justify-center">
            <i class="ri ri-check-double-line text-green-500" style="font-size: 16px;"></i>
          </div>
          <span class="font-anton text-xl text-gray-900">{{ activeCount }}</span>
        </div>
        <p class="font-love text-xs text-gray-400">Actives</p>
      </div>
    </div>

    <!-- Search bar -->
    <div class="relative mb-5">
      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <i class="ri ri-search-line" style="font-size: 18px;"></i>
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher dans mes annonces..."
        class="w-full font-love text-sm bg-white rounded-2xl shadow-sm border border-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-200 pl-11 pr-4 py-3.5 placeholder:text-gray-400 text-gray-700"
      />
    </div>

    <!-- Filter chips -->
    <div class="flex items-center gap-2 mb-5 overflow-x-auto no-scrollbar">
      <button
        v-for="cat in jobCategories"
        :key="cat.id"
        @click="activeCategory = cat.id"
        :class="[
          'flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-love text-sm font-medium whitespace-nowrap transition-all border',
          activeCategory === cat.id
            ? 'bg-primary text-white border-primary shadow-sm shadow-rose-200'
            : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
        ]"
      >
        <i class="ri" :class="`ri-${cat.icon}`" style="font-size: 16px;"></i>
        {{ cat.label }}
      </button>
    </div>

    <!-- Section title -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="font-anton text-lg text-gray-900">Mes annonces</h2>
        <p class="font-love text-xs text-gray-400 mt-0.5">{{ filteredJobs.length }} annonce(s)</p>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-3xl p-5 shadow-sm animate-pulse">
        <div class="flex gap-4">
          <div class="h-14 w-14 rounded-2xl bg-gray-200 flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-5 bg-gray-200 rounded-lg w-1/3"></div>
            <div class="h-3 bg-gray-200 rounded-lg w-1/2"></div>
            <div class="h-3 bg-gray-200 rounded-lg w-2/3"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Jobs list -->
    <div v-else-if="filteredJobs.length > 0" class="space-y-4">
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        class="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all border border-rose-50/50 hover:border-rose-100 group"
      >
        <div class="flex items-start gap-4">
          <!-- Job icon -->
          <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-50 to-primary/10 flex items-center justify-center flex-shrink-0">
            <i class="ri ri-briefcase-line text-primary/40" style="font-size: 24px;"></i>
          </div>

          <!-- Job info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-1">
              <div>
                <h3 class="font-anton text-base text-gray-900 leading-tight group-hover:text-rose-500 transition-colors">{{ job.titre }}</h3>
              </div>
              <span
                :class="[
                  'px-2.5 py-1 rounded-full font-love text-xs font-medium flex-shrink-0 flex items-center gap-1',
                  job.missionUrgente ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                ]"
              >
                <i class="ri" :class="job.missionUrgente ? 'ri-flashlight-line' : 'ri-checkbox-circle-line'" style="font-size: 11px;"></i>
                {{ job.missionUrgente ? 'Urgent' : 'Disponible' }}
              </span>
            </div>

            <p class="font-love text-sm text-gray-600 line-clamp-2 mb-3">{{ job.description }}</p>

            <!-- Tags -->
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span v-if="job.periode" class="px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 font-love text-xs flex items-center gap-1">
                <i class="ri ri-time-line" style="font-size: 10px;"></i> {{ job.periode }}
              </span>
              <span v-if="job.nombreEnfants" class="px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 font-love text-xs flex items-center gap-1">
                <i class="ri ri-group-line" style="font-size: 10px;"></i> {{ job.nombreEnfants }} enfant(s)
              </span>
              <span v-if="job.inclusWeekend" class="px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 font-love text-xs flex items-center gap-1">
                <i class="ri ri-calendar-2-line" style="font-size: 10px;"></i> Week-end inclus
              </span>
              <span v-if="job.negociable" class="px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 font-love text-xs flex items-center gap-1">
                <i class="ri ri-hand-heart-line" style="font-size: 10px;"></i> Négociable
              </span>
            </div>

            <!-- Bottom row -->
            <div class="flex items-center justify-between pt-3 border-t border-rose-50">
              <div class="flex items-center gap-1">
                <i class="ri ri-calendar-2-line text-gray-400" style="font-size: 14px;"></i>
                <span class="font-love text-xs text-gray-500">{{ job.dateDebut || 'Date à définir' }}</span>
              </div>
              <div v-if="job.tarifPropose" class="flex items-center gap-1">
                <span class="font-anton text-base text-primary">{{ formatPrice(job.tarifPropose) }}</span>
                <span class="font-love text-xs text-gray-400">FCFA</span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-2 mt-4">
              <button
                @click="goToJobDetail(job.id)"
                class="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-600 font-love text-xs font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <i class="ri ri-eye-line" style="font-size: 14px;"></i>
                Voir
              </button>
              <button
                @click="editJob(job)"
                class="flex-1 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-love text-xs font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <i class="ri ri-edit-2-line" style="font-size: 14px;"></i>
                Modifier
              </button>
              <button
                @click="confirmDelete(job)"
                class="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 font-love text-xs font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <i class="ri ri-delete-bin-line" style="font-size: 14px;"></i>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!loading && !error" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
        <i class="ri ri-briefcase-line text-rose-200" style="font-size: 40px;"></i>
      </div>
      <h3 class="font-anton text-lg text-gray-900 mb-1">Aucune annonce pour le moment</h3>
      <p class="font-love text-sm text-gray-400 mb-4">Créez votre première annonce pour trouver la nounou idéale.</p>
      <button
        @click="goToCreateJob"
        class="px-5 py-2.5 rounded-2xl bg-primary text-white font-love text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <i class="ri ri-add-line" style="font-size: 16px;"></i>
        Créer une annonce
      </button>
    </div>

    <!-- Error state -->
    <div v-if="error" class="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 20px;"></i>
      <p class="text-sm text-red-600 font-love">{{ error }}</p>
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="showDeleteModal = false">
      <div class="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <div class="flex flex-col items-center text-center">
          <div class="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <i class="ri ri-delete-bin-line text-red-500" style="font-size: 28px;"></i>
          </div>
          <h3 class="font-anton text-lg text-gray-900 mb-2">Supprimer cette annonce ?</h3>
          <p class="font-love text-sm text-gray-400 mb-6">Cette action est irréversible. L'annonce sera définitivement supprimée.</p>
          <div class="flex gap-3 w-full">
            <button
              @click="showDeleteModal = false"
              class="flex-1 py-3 rounded-2xl bg-gray-50 text-gray-600 font-love text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="deleteJob"
              :disabled="deleting"
              class="flex-1 py-3 rounded-2xl bg-red-500 text-white font-love text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {{ deleting ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useJobStore } from '@/stores/jobStore';
import { useUserJobs, useDeleteJob } from '@/features/jobs/hooks/useJobs';

const router = useRouter();
const jobStore = useJobStore();

// TanStack Query for jobs
const { data: userJobsData, isLoading: jobsLoading, error: queryError } = useUserJobs();
const { mutate: deleteJobMutation } = useDeleteJob();

const deleting = ref(false);
const deleteError = ref<string | null>(null);
const activeCategory = ref('all');
const searchQuery = ref('');
const showDeleteModal = ref(false);
const jobToDelete = ref<any>(null);

const jobCategories = [
  { id: 'all', label: 'Toutes', icon: 'group-line' },
  { id: 'urgent', label: 'Urgent', icon: 'flashlight-line' },
  { id: 'negociable', label: 'Négociable', icon: 'hand-heart-line' },
  { id: 'weekend', label: 'Week-end', icon: 'calendar-2-line' },
  { id: 'experience', label: 'Exp. requise', icon: 'graduation-cap-line' },
];

const jobs = computed(() => {
  const result = userJobsData.value;
  const rawJobs = Array.isArray(result) ? result : (result?.data || []);
  const seen = new Set();
  return rawJobs.filter((job: any) => {
    if (seen.has(job.id)) return false;
    seen.add(job.id);
    return true;
  });
});

const urgentCount = computed(() => jobs.value.filter((j: any) => j.missionUrgente).length);
const activeCount = computed(() => jobs.value.filter((j: any) => !j.deletedAt).length);

const filteredJobs = computed(() => {
  let list = jobs.value;
  if (activeCategory.value === 'urgent') list = list.filter((j: any) => j.missionUrgente);
  else if (activeCategory.value === 'negociable') list = list.filter((j: any) => j.negociable);
  else if (activeCategory.value === 'weekend') list = list.filter((j: any) => j.inclusWeekend);
  else if (activeCategory.value === 'experience') list = list.filter((j: any) => j.experienceMinimun);

  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter((j: any) =>
      j.titre?.toLowerCase().includes(q) ||
      j.description?.toLowerCase().includes(q)
    );
  }
  return list;
});

const loading = computed(() => jobsLoading.value || deleting.value);

const error = computed(() => {
  const err = queryError.value;
  if (err) {
    return (err as any)?.response?.data?.message || (err as any)?.message || 'Erreur lors du chargement de vos annonces';
  }
  return deleteError.value;
});

const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseInt(price) : price;
  if (isNaN(num)) return price;
  return new Intl.NumberFormat('fr-FR').format(num);
};

const goToCreateJob = () => {
  jobStore.setUpdateJob(false);
  router.push({ name: 'CREATE_JOB' });
};

const goToJobDetail = (id: any) => {
  router.push({ name: 'JOB_DETAIL', params: { id } });
};

const editJob = (job: any) => {
  jobStore.ChangeInputToEdit(job);
  router.push({ name: 'CREATE_JOB' });
};

const confirmDelete = (job: any) => {
  jobToDelete.value = job;
  showDeleteModal.value = true;
};

const deleteJob = async () => {
  if (!jobToDelete.value) return;
  deleting.value = true;
  deleteError.value = null;
  deleteJobMutation(jobToDelete.value.id, {
    onSuccess: () => {
      showDeleteModal.value = false;
      jobToDelete.value = null;
      deleting.value = false;
    },
    onError: (e: any) => {
      deleteError.value = e?.response?.data?.message || 'Erreur lors de la suppression';
      deleting.value = false;
    },
  });
};
</script>
