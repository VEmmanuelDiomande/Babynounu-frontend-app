<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6">
    <!-- Search bar -->
    <div class="relative mb-4">
      <div class="relative">
        <i class="ri ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" style="font-size: 18px;"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Titre, mot-clé, lieu..."
          class="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white border border-gray-200 font-love text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          @keyup.enter="performSearch"
        />
        <button
          @click="hasAdvancedSearch ? toggleAdvancedFilters() : router.push({ name: 'MySubscription' })"
          :class="[
            'absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center transition-colors',
            showAdvancedFilters ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary hover:bg-rose-50'
          ]"
        >
          <i :class="hasAdvancedSearch ? 'ri ri-filter-3-line' : 'ri ri-lock-line'" style="font-size: 16px;"></i>
        </button>
      </div>
    </div>

    <!-- Quick filter chips (multi-select) -->
    <div class="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
      <button
        v-for="filter in quickFilters"
        :key="filter.id"
        @click="toggleQuickFilter(filter.id)"
        :class="[
          'px-4 py-2 rounded-full font-love text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5',
          activeQuickFilters.includes(filter.id)
            ? 'bg-primary text-white'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
        ]"
      >
        <i :class="filter.icon" style="font-size: 12px;"></i> {{ filter.label }}
      </button>
    </div>

    <!-- Advanced filters drawer -->
    <Drawer v-if="hasAdvancedSearch" :show="showAdvancedFilters" title="Filtres avancés" max-height="70%" @close="showAdvancedFilters = false">
      <div class="space-y-5">
        <div class="flex items-center justify-end">
          <button
            @click="resetFilters"
            class="font-love text-xs text-rose-400 hover:text-rose-500 transition-colors"
          >
            Réinitialiser
          </button>
        </div>

        <!-- Nombre d'enfants -->
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-2">Nombre d'enfants</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="n in childrenOptions"
              :key="n"
              @click="advancedFilters.nombreEnfants = advancedFilters.nombreEnfants === n ? '' : n"
              :class="[
                'px-3 py-1.5 rounded-full font-love text-xs font-medium transition-all border',
                advancedFilters.nombreEnfants === n
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ n }}
            </button>
          </div>
        </div>

        <!-- Tarif range -->
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-2">Tarif proposé (FCFA)</label>
          <div class="grid grid-cols-2 gap-3">
            <input
              v-model="advancedFilters.tarifMin"
              type="number"
              placeholder="Min"
              class="font-love text-sm bg-rose-50/60 border border-rose-100 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 placeholder:text-gray-400"
            />
            <input
              v-model="advancedFilters.tarifMax"
              type="number"
              placeholder="Max"
              class="font-love text-sm bg-rose-50/60 border border-rose-100 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 placeholder:text-gray-400"
            />
          </div>
        </div>

        <!-- Date de début -->
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-2">Date de début</label>
          <input
            v-model="advancedFilters.dateDebut"
            type="date"
            class="w-full font-love text-sm bg-rose-50/60 border border-rose-100 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 placeholder:text-gray-400"
          />
        </div>

        <!-- Toggle switches -->
        <div class="space-y-2.5">
          <div
            v-for="toggle in toggleFilters"
            :key="toggle.key"
            class="flex items-center justify-between"
          >
            <span class="font-love text-sm text-gray-700">{{ toggle.label }}</span>
            <button
              @click="advancedFilters[toggle.key] = !advancedFilters[toggle.key]"
              :class="[
                'relative h-6 w-11 rounded-full transition-colors',
                advancedFilters[toggle.key] ? 'bg-primary' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                  advancedFilters[toggle.key] ? 'translate-x-5' : 'translate-x-0.5'
                ]"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <button
          @click="performSearch"
          class="w-full py-3 rounded-2xl bg-primary text-white font-love font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Appliquer les filtres
        </button>
      </template>
    </Drawer>

    <!-- Active filters summary -->
    <div v-if="activeFiltersCount > 0" class="flex items-center gap-2 mb-4 flex-wrap">
      <span class="font-love text-xs text-gray-400">Filtres actifs:</span>
      <span
        v-for="(af, i) in activeFiltersList"
        :key="i"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 font-love text-xs font-medium"
      >
        {{ af.label }}
        <button @click="removeFilter(af.key)" class="hover:text-rose-700">
          <i class="ri ri-close-line" style="font-size: 10px;"></i>
        </button>
      </span>
      <button @click="resetAll" class="font-love text-xs text-gray-400 hover:text-rose-400 transition-colors">
        Tout effacer
      </button>
    </div>

    <!-- Loading -->
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

    <!-- Results -->
    <div v-else-if="sortedResults.length > 0" class="space-y-4">
      <div class="flex items-center justify-between mb-2">
        <p class="font-love text-xs text-gray-400">{{ sortedResults.length }} résultat(s)</p>
        <button
          @click="sortBy = sortBy === 'recent' ? 'urgent' : 'recent'"
          class="flex items-center gap-1 font-love text-xs text-gray-500 hover:text-primary transition-colors"
        >
          <i class="ri ri-sort-desc-line" style="font-size: 12px;"></i>
          {{ sortBy === 'recent' ? 'Plus récents' : 'Urgents d\'abord' }}
        </button>
      </div>
      <JobCard
        v-for="job in sortedResults"
        :key="job.id"
        :job="job"
        @click="goToJobDetail"
      />

      <!-- Load more -->
      <div v-if="hasNextPage" class="flex justify-center pt-2 pb-4">
        <button
          @click="fetchNextPage()"
          :disabled="isFetchingNextPage"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-love font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-sm disabled:opacity-60"
        >
          <div v-if="isFetchingNextPage" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <i v-else class="ri ri-arrow-down-line" style="font-size: 18px;"></i>
          {{ isFetchingNextPage ? 'Chargement...' : 'Charger plus' }}
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!loading && hasSearched" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <i class="ri ri-search-line text-gray-300" style="font-size: 40px;"></i>
      </div>
      <h3 class="font-anton text-lg text-gray-900 mb-1">Aucun résultat</h3>
      <p class="font-love text-sm text-gray-400">Essayez avec d'autres critères de recherche.</p>
    </div>

    <!-- Initial state -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <div class="h-20 w-20 rounded-full bg-rose-100 flex items-center justify-center mb-4">
        <i class="ri ri-search-line text-rose-300" style="font-size: 40px;"></i>
      </div>
      <h3 class="font-anton text-lg text-gray-900 mb-1">Rechercher une offre</h3>
      <p class="font-love text-sm text-gray-400">Tapez un mot-clé ou utilisez les filtres avancés.</p>
    </div>

    <!-- Error -->
    <div v-if="error" class="mt-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 20px;"></i>
      <p class="text-sm text-red-600 font-love">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import JobCard from '@/features/nounus/components/JobCard.vue';
import { Drawer } from '@/components/ui';
import { useInfiniteJobs } from '@/features/jobs/hooks/useJobs';
import { useAbonnementStore } from '@/stores/abonnementStore';

const router = useRouter();
const abonnementStore = useAbonnementStore();

const hasAdvancedSearch = computed(() => abonnementStore.hasFeature('advanced_search'));

const PAGE_LIMIT = 20;
const params = ref<Record<string, any>>({ page: 1, limit: PAGE_LIMIT });

// TanStack Query for jobs (infinite scroll)
const {
  data: allJobsData,
  isFetching: loading,
  error: jobsError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteJobs(params);

const searchQuery = ref('');
const hasSearched = ref(false);
const showAdvancedFilters = ref(false);
const sortBy = ref<'recent' | 'urgent'>('recent');

const quickFilters = [
  { id: 'urgent', label: 'Urgentes', icon: 'ri ri-notification-3-line' },
  { id: 'negociable', label: 'Négociables', icon: 'ri ri-hand-heart-line' },
  { id: 'weekend', label: 'Week-end', icon: 'ri ri-calendar-2-line' },
  { id: 'experience', label: 'Exp. requise', icon: 'ri ri-graduation-cap-line' },
  { id: 'combinaison', label: 'Combinaison', icon: 'ri ri-layers-line' },
];

const activeQuickFilters = ref<string[]>([]);
const childrenOptions = ['1', '2', '3', '4+'];

const advancedFilters = ref({
  nombreEnfants: '',
  tarifMin: '',
  tarifMax: '',
  dateDebut: '',
  missionUrgente: false,
  negociable: false,
  inclusWeekend: false,
  experienceMinimun: false,
  combinaisonService: false,
});

const toggleFilters = [
  { key: 'missionUrgente' as const, label: 'Missions urgentes' },
  { key: 'negociable' as const, label: 'Tarif négociable' },
  { key: 'inclusWeekend' as const, label: 'Week-end inclus' },
  { key: 'experienceMinimun' as const, label: 'Expérience requise' },
  { key: 'combinaisonService' as const, label: 'Combinaison de services' },
];

const error = computed(() => {
  const err = jobsError.value;
  if (err) {
    return (err as any)?.response?.data?.message || (err as any)?.message || 'Erreur lors de la recherche';
  }
  return null;
});

const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value;
};

const toggleQuickFilter = (id: string) => {
  const idx = activeQuickFilters.value.indexOf(id);
  if (idx > -1) {
    activeQuickFilters.value.splice(idx, 1);
  } else {
    activeQuickFilters.value.push(id);
  }

  const filterMap: Record<string, string> = {
    urgent: 'missionUrgente',
    negociable: 'negociable',
    weekend: 'inclusWeekend',
    experience: 'experienceMinimun',
    combinaison: 'combinaisonService',
  };

  const key = filterMap[id];
  if (key) {
    (advancedFilters.value as any)[key] = activeQuickFilters.value.includes(id);
  }

  performSearch();
};

const activeFiltersCount = computed(() => {
  let count = 0;
  if (searchQuery.value) count++;
  if (advancedFilters.value.nombreEnfants) count++;
  if (advancedFilters.value.tarifMin) count++;
  if (advancedFilters.value.tarifMax) count++;
  if (advancedFilters.value.dateDebut) count++;
  if (advancedFilters.value.missionUrgente) count++;
  if (advancedFilters.value.negociable) count++;
  if (advancedFilters.value.inclusWeekend) count++;
  if (advancedFilters.value.experienceMinimun) count++;
  if (advancedFilters.value.combinaisonService) count++;
  return count;
});

const activeFiltersList = computed(() => {
  const list: { label: string; key: string }[] = [];
  if (searchQuery.value) list.push({ label: `"${searchQuery.value}"`, key: 'searchQuery' });
  if (advancedFilters.value.nombreEnfants) list.push({ label: `${advancedFilters.value.nombreEnfants} enfant(s)`, key: 'nombreEnfants' });
  if (advancedFilters.value.tarifMin) list.push({ label: `Min: ${advancedFilters.value.tarifMin} FCFA`, key: 'tarifMin' });
  if (advancedFilters.value.tarifMax) list.push({ label: `Max: ${advancedFilters.value.tarifMax} FCFA`, key: 'tarifMax' });
  if (advancedFilters.value.dateDebut) list.push({ label: `À partir du ${new Date(advancedFilters.value.dateDebut).toLocaleDateString('fr-FR')}`, key: 'dateDebut' });
  if (advancedFilters.value.missionUrgente) list.push({ label: 'Urgent', key: 'missionUrgente' });
  if (advancedFilters.value.negociable) list.push({ label: 'Négociable', key: 'negociable' });
  if (advancedFilters.value.inclusWeekend) list.push({ label: 'Week-end', key: 'inclusWeekend' });
  if (advancedFilters.value.experienceMinimun) list.push({ label: 'Exp. requise', key: 'experienceMinimun' });
  if (advancedFilters.value.combinaisonService) list.push({ label: 'Combinaison', key: 'combinaisonService' });
  return list;
});

const removeFilter = (key: string) => {
  if (key === 'searchQuery') {
    searchQuery.value = '';
  } else if (key === 'tarifMin' || key === 'tarifMax' || key === 'dateDebut' || key === 'nombreEnfants') {
    (advancedFilters.value as any)[key] = '';
  } else {
    (advancedFilters.value as any)[key] = false;
    const quickMap: Record<string, string> = {
      missionUrgente: 'urgent',
      negociable: 'negociable',
      inclusWeekend: 'weekend',
      experienceMinimun: 'experience',
      combinaisonService: 'combinaison',
    };
    const qid = quickMap[key];
    if (qid) {
      const idx = activeQuickFilters.value.indexOf(qid);
      if (idx > -1) activeQuickFilters.value.splice(idx, 1);
    }
  }
  performSearch();
};

const resetFilters = () => {
  advancedFilters.value = {
    nombreEnfants: '',
    tarifMin: '',
    tarifMax: '',
    dateDebut: '',
    missionUrgente: false,
    negociable: false,
    inclusWeekend: false,
    experienceMinimun: false,
    combinaisonService: false,
  };
  activeQuickFilters.value = [];
};

const resetAll = () => {
  searchQuery.value = '';
  resetFilters();
  performSearch();
};

const jobs = computed(() => {
  const pages = allJobsData.value?.pages;
  if (!pages || pages.length === 0) return [];
  // Aggregate all pages, dedup by id
  const seen = new Set();
  const all: any[] = [];
  for (const page of pages) {
    // Backend retourne { success, data: { data: [...], pagination } } via TransformInterceptor
    const inner = page?.data?.data || page?.data || page;
    const items = Array.isArray(inner) ? inner : [];
    for (const item of items) {
      if (item?.id && !seen.has(item.id)) {
        seen.add(item.id);
        all.push(item);
      }
    }
  }
  return all;
});

const filteredResults = computed(() => {
  let list = jobs.value;

  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter((j: any) =>
      j.titre?.toLowerCase().includes(q) ||
      j.description?.toLowerCase().includes(q)
    );
  }

  if (advancedFilters.value.tarifMin || advancedFilters.value.tarifMax) {
    list = list.filter((job: any) => {
      const tarif = parseFloat(job.tarifPropose);
      if (isNaN(tarif)) return false;
      if (advancedFilters.value.tarifMin && tarif < parseFloat(advancedFilters.value.tarifMin)) return false;
      if (advancedFilters.value.tarifMax && tarif > parseFloat(advancedFilters.value.tarifMax)) return false;
      return true;
    });
  }

  if (advancedFilters.value.dateDebut) {
    const filterDate = advancedFilters.value.dateDebut;
    list = list.filter((job: any) => {
      if (!job.dateDebut) return false;
      const jobDate = new Date(job.dateDebut).toISOString().split('T')[0];
      return jobDate >= filterDate;
    });
  }

  return list;
});

const sortedResults = computed(() => {
  if (sortBy.value === 'urgent') {
    return [...filteredResults.value].sort((a, b) => {
      if (a.missionUrgente && !b.missionUrgente) return -1;
      if (!a.missionUrgente && b.missionUrgente) return 1;
      return (b.priority || 0) - (a.priority || 0);
    });
  }
  return [...filteredResults.value].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const performSearch = () => {
  showAdvancedFilters.value = false;
  hasSearched.value = true;

  const newParams: Record<string, any> = { page: 1, limit: PAGE_LIMIT };
  if (advancedFilters.value.missionUrgente) newParams.missionUrgente = true;
  if (advancedFilters.value.negociable) newParams.negociable = true;
  if (advancedFilters.value.inclusWeekend) newParams.inclusWeekend = true;
  if (advancedFilters.value.experienceMinimun) newParams.experienceMinimun = true;
  if (advancedFilters.value.combinaisonService) newParams.combinaisonService = true;
  if (advancedFilters.value.nombreEnfants) newParams.nombreEnfants = advancedFilters.value.nombreEnfants;

  params.value = newParams;
};

const goToJobDetail = (id: number) => {
  router.push({ name: 'JOB_DETAIL', params: { id } });
};

onMounted(() => {
  performSearch();
});
</script>
