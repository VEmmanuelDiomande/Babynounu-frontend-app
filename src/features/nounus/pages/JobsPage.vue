<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6">
    <!-- Hero banner -->
    <div class="relative rounded-3xl overflow-hidden mb-6 bg-gradient-to-br from-rose-400 via-rose-400 to-primary shadow-lg shadow-rose-100">
      <div class="absolute inset-0 opacity-10">
        <img src="/images/backgrounds/bn_background_auth.jpg" alt="" class="h-full w-full object-cover" />
      </div>
      <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
      <div class="absolute -left-6 -bottom-10 h-28 w-28 rounded-full bg-white/10"></div>

      <div class="relative z-10 p-6 sm:p-8 text-white">
        <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white mb-3">
          <i class="ri ri-briefcase-line" style="font-size: 14px;"></i>
          <span class="font-love text-[10px] font-bold uppercase tracking-wider">Offres d'emploi</span>
        </div>
        <h1 class="font-anton text-2xl sm:text-3xl mb-2">Trouvez votre famille</h1>
        <p class="font-love text-sm text-white/80 max-w-md mb-5">
          Des offres de garde d'enfants près de chez vous.
        </p>

        <!-- Search bar -->
        <div class="relative">
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300">
            <i class="ri ri-search-line" style="font-size: 18px;"></i>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher une offre..."
            class="w-full font-love text-sm bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 pl-11 pr-4 py-3.5 placeholder:text-gray-400 text-gray-700"
          />
        </div>
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
        <p class="font-love text-xs text-gray-400">Offres actives</p>
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
          <span class="font-anton text-xl text-gray-900">{{ filteredJobs.length }}</span>
        </div>
        <p class="font-love text-xs text-gray-400">Disponibles</p>
      </div>
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
        <h2 class="font-anton text-lg text-gray-900">Offres récentes</h2>
        <p class="font-love text-xs text-gray-400 mt-0.5">{{ filteredJobs.length }} offre(s) trouvée(s)</p>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="bg-white rounded-3xl p-5 shadow-sm animate-pulse">
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
      <JobCard
        v-for="job in filteredJobs"
        :key="job.id"
        :job="job"
        @click="goToJobDetail"
      />

      <!-- Load more button -->
      <div v-if="hasNextPage" class="flex justify-center pt-4">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="px-6 py-3 rounded-2xl bg-white border border-rose-100 text-rose-500 font-love text-sm font-medium hover:bg-rose-50 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <i v-if="loadingMore" class="ri ri-loader-4-line animate-spin" style="font-size: 16px;"></i>
          <i v-else class="ri ri-arrow-down-line" style="font-size: 16px;"></i>
          {{ loadingMore ? 'Chargement...' : 'Voir plus' }}
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <div class="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
        <i class="ri ri-briefcase-line text-rose-200" style="font-size: 40px;"></i>
      </div>
      <h3 class="font-anton text-lg text-gray-900 mb-1">Aucune offre pour le moment</h3>
      <p class="font-love text-sm text-gray-400 mb-4">Revenez plus tard pour de nouvelles opportunités.</p>
      <button
        @click="activeCategory = 'all'"
        class="px-5 py-2.5 rounded-2xl bg-rose-400 text-white font-love text-sm font-medium hover:bg-rose-500 transition-colors flex items-center gap-2"
      >
        <i class="ri ri-refresh-line" style="font-size: 16px;"></i>
        Réinitialiser les filtres
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import JobCard from '@/features/nounus/components/JobCard.vue';
import { usePullToRefresh } from '@/composables/usePullToRefresh';
import { useAllJobs } from '@/features/jobs/hooks/useJobs';

const router = useRouter();

const PAGE_SIZE = 10;
const currentPage = ref(1);
const params = computed(() => ({ page: currentPage.value, limit: PAGE_SIZE }));

// TanStack Query for jobs
const { data: allJobsData, isLoading: jobsLoading, isFetching, refetch: refetchJobs } = useAllJobs(params);

const activeCategory = ref('all');
const searchQuery = ref('');
const hasNextPage = ref(false);
const allLoadedJobs = ref<any[]>([]);

const jobCategories = [
  { id: 'all', label: 'Toutes', icon: 'group-line' },
  { id: 'urgent', label: 'Urgent', icon: 'flashlight-line' },
  { id: 'negociable', label: 'Négociable', icon: 'hand-heart-line' },
  { id: 'weekend', label: 'Week-end', icon: 'calendar-2-line' },
  { id: 'experience', label: 'Exp. requise', icon: 'graduation-cap-line' },
];

const normalizeJobs = (result: any) => {
  // Backend retourne { success, data: { data: [...], pagination } } via TransformInterceptor
  const inner = result?.data?.data || result?.data || result;
  const raw = Array.isArray(inner) ? inner : [];
  const seen = new Set();
  return raw.filter((job: any) => {
    if (seen.has(job.id)) return false;
    seen.add(job.id);
    return true;
  });
};

watch(allJobsData, (data) => {
  if (!data) return;
  const newJobs = normalizeJobs(data);
  const pagination = data?.data?.pagination || data?.pagination;
  hasNextPage.value = pagination?.hasNextPage ?? false;
  if (currentPage.value === 1) {
    allLoadedJobs.value = newJobs;
  } else {
    const seen = new Set(allLoadedJobs.value.map((j) => j.id));
    const deduped = newJobs.filter((job: any) => {
      if (seen.has(job.id)) return false;
      seen.add(job.id);
      return true;
    });
    allLoadedJobs.value = [...allLoadedJobs.value, ...deduped];
  }
});

const jobs = computed(() => allLoadedJobs.value);

const urgentCount = computed(() => jobs.value.filter((j: any) => j.missionUrgente).length);

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

const loading = computed(() => jobsLoading.value && currentPage.value === 1);
const loadingMore = computed(() => isFetching.value && currentPage.value > 1);

const goToJobDetail = (id: any) => {
  router.push({ name: 'JOB_DETAIL', params: { id } });
};

const fetchJobs = async () => {
  currentPage.value = 1;
  await refetchJobs();
};

const loadMore = async () => {
  if (loadingMore.value || !hasNextPage.value) return;
  currentPage.value++;
};

usePullToRefresh(fetchJobs);
</script>
