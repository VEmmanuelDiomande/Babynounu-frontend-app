<template>
  <div class="min-h-full pb-6">
    <!-- Hero -->
    <div class="px-6 pt-6 pb-4">
      <div class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-300 to-rose-400 p-6 shadow-lg shadow-rose-100">
        <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"></div>
        <div class="absolute -right-4 -bottom-8 h-24 w-24 rounded-full bg-white/10"></div>

        <div class="relative z-10">
          <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white mb-3">
            <i class="ri ri-checkbox-circle-line" style="font-size: 14px;"></i>
            <span class="font-love text-[10px] font-bold uppercase tracking-wider">Profils vérifiés</span>
          </div>
          <h1 class="font-love text-2xl font-bold text-white mb-2 leading-tight">
            Trouvez votre <br />Nounu de confiance
          </h1>
          <p class="font-love text-sm text-white/80 mb-4">
            Des nounous qualifiées et vérifiées près de chez vous.
          </p>

          <!-- Search bar inside hero -->
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300">
              <i class="ri ri-search-line" style="font-size: 16px;"></i>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une nounou..."
              class="w-full font-love text-sm bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 pl-10 pr-12 py-3.5 placeholder:text-gray-400"
            />
            <button
              @click="hasAdvancedSearch ? (showFilters = true) : router.push({ name: 'MySubscription' })"
              :class="[
                'absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center transition-colors',
                hasActiveFilters ? 'bg-rose-400 text-white' : 'text-gray-400 hover:text-rose-400 hover:bg-rose-50'
              ]"
            >
              <i :class="hasAdvancedSearch ? 'ri ri-filter-3-line' : 'ri ri-lock-line'" style="font-size: 16px;"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Active filters summary -->
    <div v-if="hasActiveFilters" class="px-6 mb-4 flex items-center gap-2 flex-wrap">
      <span class="font-love text-xs text-gray-400">Filtres actifs:</span>
      <span
        v-for="(af, i) in activeFiltersSummary"
        :key="i"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 font-love text-xs font-medium"
      >
        {{ af.label }}
        <button @click="removeFilterGroup(af.key)" class="hover:text-rose-700">
          <i class="ri ri-close-line" style="font-size: 10px;"></i>
        </button>
      </span>
      <button @click="resetFilters" class="font-love text-xs text-gray-400 hover:text-rose-400 transition-colors">
        Tout effacer
      </button>
    </div>

    <!-- Filter drawer -->
    <Drawer v-if="hasAdvancedSearch" :show="showFilters" title="Filtres de recherche" max-height="70%" @close="showFilters = false">
      <div class="space-y-5">
        <div class="flex items-center justify-end">
          <button
            @click="resetFilters"
            class="font-love text-xs text-rose-400 hover:text-rose-500 transition-colors"
          >
            Réinitialiser
          </button>
        </div>

        <!-- Localisation -->
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-2">Localisation</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.adress"
              :key="item.id"
              @click="togglePreference('adress', item)"
              :class="[
                'px-3 py-1.5 rounded-full font-love text-xs font-medium transition-all border',
                isPreferenceSelected('adress', item.id)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <!-- Zone de travail -->
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-2">Zone de travail</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.zone_de_travail"
              :key="item.id"
              @click="togglePreference('zone_de_travail', item)"
              :class="[
                'px-3 py-1.5 rounded-full font-love text-xs font-medium transition-all border',
                isPreferenceSelected('zone_de_travail', item.id)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <!-- Horaires disponibles -->
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-2">Horaires disponibles</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.horaire_disponible"
              :key="item.id"
              @click="togglePreference('horaire_disponible', item)"
              :class="[
                'px-3 py-1.5 rounded-full font-love text-xs font-medium transition-all border',
                isPreferenceSelected('horaire_disponible', item.id)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <!-- Tranche d'âge des enfants -->
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-2">Tranche d'âge des enfants</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.tranche_age_enfants"
              :key="item.id"
              @click="togglePreference('tranche_age_enfants', item)"
              :class="[
                'px-3 py-1.5 rounded-full font-love text-xs font-medium transition-all border',
                isPreferenceSelected('tranche_age_enfants', item.id)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <!-- Compétences spécifiques -->
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-2">Compétences spécifiques</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.competance_specifique"
              :key="item.id"
              @click="togglePreference('competance_specifique', item)"
              :class="[
                'px-3 py-1.5 rounded-full font-love text-xs font-medium transition-all border',
                isPreferenceSelected('competance_specifique', item.id)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <!-- Langues parlées -->
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-2">Langues parlées</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.langue_parler"
              :key="item.id"
              @click="togglePreference('langue_parler', item)"
              :class="[
                'px-3 py-1.5 rounded-full font-love text-xs font-medium transition-all border',
                isPreferenceSelected('langue_parler', item.id)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <button
          @click="applyFilters"
          class="w-full py-3 rounded-2xl bg-rose-400 text-white font-love font-semibold text-sm hover:bg-rose-500 transition-colors"
        >
          Appliquer les filtres
        </button>
      </template>
    </Drawer>

    <!-- Categories -->
    <div class="px-6 mb-4">
      <div class="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="activeCategory = category.id"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all whitespace-nowrap border',
            activeCategory === category.id
              ? 'bg-rose-400 text-white border-rose-400'
              : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300'
          ]"
        >
          <i class="ri" :class="`ri-${category.icon}`" style="font-size: 16px;"></i>
          {{ category.label }}
        </button>
      </div>
    </div>

    <!-- Section title -->
    <div class="px-6 mb-4 flex items-center justify-between">
      <div>
        <h2 class="font-love text-lg font-bold text-gray-900">Nounus près de vous</h2>
        <p class="font-love text-xs text-gray-400 mt-0.5">{{ filteredNounus.length }} nounus disponibles</p>
      </div>
      <button class="font-love text-xs font-medium text-rose-400 hover:text-rose-500 transition-colors">
        Voir tout
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="nounuStore.isLoading" class="px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="i in 4" :key="i" class="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
        <div class="h-48 bg-gray-200"></div>
        <div class="p-4 space-y-3">
          <div class="h-5 bg-gray-200 rounded-lg w-2/3"></div>
          <div class="h-3 bg-gray-200 rounded-lg w-1/2"></div>
          <div class="h-8 bg-gray-200 rounded-xl w-full"></div>
        </div>
      </div>
    </div>

    <!-- Nounus grid -->
    <div v-else-if="sortedNounus.length > 0" class="px-6 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NounuCard
          v-for="nounu in sortedNounus"
          :key="nounu.id"
          :nounu="nounu"
          :is-favorite="isLiked(nounu.id)"
          :like-count="getLikeCount(nounu.id)"
          :show-new-badge="hasEarlyAccess && isNewNounu(nounu)"
          @click="goToDetail(nounu)"
          @favorite="onToggleLike"
          @contact="contactNounu"
        />
      </div>

      <!-- Load more button -->
      <div v-if="nounuStore.hasNextPage" class="flex justify-center pt-2">
        <button
          @click="loadMore"
          :disabled="nounuStore.isLoadingMore"
          class="px-6 py-3 rounded-2xl bg-white border border-rose-100 text-rose-500 font-love text-sm font-medium hover:bg-rose-50 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <i v-if="nounuStore.isLoadingMore" class="ri ri-loader-4-line animate-spin" style="font-size: 16px;"></i>
          <i v-else class="ri ri-arrow-down-line" style="font-size: 16px;"></i>
          {{ nounuStore.isLoadingMore ? 'Chargement...' : 'Voir plus' }}
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!nounuStore.isLoading" class="flex flex-col items-center justify-center py-16 text-center px-6">
      <div class="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
        <i class="ri ri-user-3-line text-rose-200" style="font-size: 40px;"></i>
      </div>
      <h3 class="font-love text-lg font-bold text-gray-900 mb-1">Aucune nounu trouvée</h3>
      <p class="font-love text-sm text-gray-400 mb-4">Essayez d'élargir vos critères de recherche.</p>
      <button
        @click="loadNounus"
        class="px-5 py-2.5 rounded-2xl bg-rose-400 text-white font-love text-sm font-medium hover:bg-rose-500 transition-colors"
      >
        Réessayer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useNounuStore } from '@/stores/nounu.store';
import NounuCard from '@/features/nounus/components/NounuCard.vue';
import { Drawer } from '@/components/ui';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import type { Nounu } from '@/features/nounus/types';
import { usePullToRefresh } from '@/composables/usePullToRefresh';
import { useLikes } from '@/composables/useLikes';
import { useAllSettings } from '@/features/settings/hooks/useSettings';
import { useAbonnementStore } from '@/stores/abonnementStore';

const router = useRouter();
const nounuStore = useNounuStore();
const abonnementStore = useAbonnementStore();

const hasAdvancedSearch = computed(() => abonnementStore.hasFeature('advanced_search'));
const hasEarlyAccess = computed(() => abonnementStore.hasFeature('early_access_nounus'));

// TanStack Query for settings
const { data: settingsData } = useAllSettings();

const { fetchBatchStatus, toggleLike, isLiked, getLikeCount } = useLikes();

const activeCategory = ref('all');
const searchQuery = ref('');
const showFilters = ref(false);

type PrefItem = { id: number | string; name: string };
type PrefKey = 'adress' | 'zone_de_travail' | 'horaire_disponible' | 'tranche_age_enfants' | 'competance_specifique' | 'langue_parler';

const preferenceOptions = reactive<Record<PrefKey, PrefItem[]>>({
  adress: [],
  zone_de_travail: [],
  horaire_disponible: [],
  tranche_age_enfants: [],
  competance_specifique: [],
  langue_parler: [],
});

const filterLabels: Record<PrefKey, string> = {
  adress: 'Localisation',
  zone_de_travail: 'Zone',
  horaire_disponible: 'Horaires',
  tranche_age_enfants: 'Âge enfants',
  competance_specifique: 'Compétences',
  langue_parler: 'Langues',
};

let preferenceCache: Record<PrefKey, PrefItem[]> | null = null;

const slugToPrefKey: Record<string, PrefKey> = {
  adresse: 'adress',
  zone: 'zone_de_travail',
  horaire: 'horaire_disponible',
  tranche_age: 'tranche_age_enfants',
  competence: 'competance_specifique',
  langue: 'langue_parler',
};

const fetchPreferenceOptions = async () => {
  if (preferenceCache) {
    (Object.keys(preferenceCache) as PrefKey[]).forEach((key) => {
      preferenceOptions[key] = preferenceCache![key];
    });
    return;
  }
  try {
    const data = settingsData.value;
    const grouped: Record<PrefKey, PrefItem[]> = {
      adress: [],
      zone_de_travail: [],
      horaire_disponible: [],
      tranche_age_enfants: [],
      competance_specifique: [],
      langue_parler: [],
    };
    (data || []).forEach((p: any) => {
      const slug = p?.typeParameter?.slug;
      const key = slugToPrefKey[slug];
      if (key) grouped[key].push({ id: p.id, name: p.name });
    });
    preferenceCache = grouped;
    (Object.keys(grouped) as PrefKey[]).forEach((key) => {
      preferenceOptions[key] = grouped[key];
    });
  } catch {
    preferenceOptions.adress = [];
    preferenceOptions.zone_de_travail = [];
    preferenceOptions.horaire_disponible = [];
    preferenceOptions.tranche_age_enfants = [];
    preferenceOptions.competance_specifique = [];
    preferenceOptions.langue_parler = [];
  }
};

const isPreferenceSelected = (key: PrefKey, itemId: number | string) => {
  return nounuStore.searchPreferences[key].some((item: any) => item.id === itemId);
};

const togglePreference = (key: PrefKey, item: PrefItem) => {
  const arr = nounuStore.searchPreferences[key] as any[];
  const idx = arr.findIndex((i) => i.id === item.id);
  if (idx > -1) {
    arr.splice(idx, 1);
  } else {
    arr.push(item);
  }
};

const hasActiveFilters = computed(() => {
  return (Object.keys(nounuStore.searchPreferences) as PrefKey[]).some(
    (key) => nounuStore.searchPreferences[key].length > 0
  );
});

const activeFiltersSummary = computed(() => {
  const list: { label: string; key: PrefKey }[] = [];
  (Object.keys(nounuStore.searchPreferences) as PrefKey[]).forEach((key) => {
    if (nounuStore.searchPreferences[key].length > 0) {
      const names = nounuStore.searchPreferences[key].map((i: any) => i.name).join(', ');
      list.push({ label: `${filterLabels[key]}: ${names}`, key });
    }
  });
  return list;
});

const removeFilterGroup = (key: PrefKey) => {
  nounuStore.searchPreferences[key].splice(0);
  loadNounus();
};

const resetFilters = () => {
  (Object.keys(nounuStore.searchPreferences) as PrefKey[]).forEach((key) => {
    nounuStore.searchPreferences[key].splice(0);
  });
};

const applyFilters = () => {
  showFilters.value = false;
  loadNounus();
};

const categories = [
  { id: 'all', label: 'Toutes', icon: 'group-line' },
  { id: 'available', label: 'Disponibles', icon: 'checkbox-circle-line' },
  { id: 'verified', label: 'Vérifiées', icon: 'shield-line' },
  { id: 'night', label: 'De nuit', icon: 'moon-line' },
  { id: 'baby', label: 'Nourrissons', icon: 'emoticon-line' },
  { id: 'school', label: 'Aide-devoirs', icon: 'pencil-line' },
];

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const PAGE_SIZE = '25';

const loadNounus = () => {
  nounuStore.searchNounu(searchQuery.value.trim(), '1', PAGE_SIZE);
};

const loadMore = () => {
  if (nounuStore.isLoadingMore || !nounuStore.hasNextPage) return;
  const nextPage = (nounuStore.currentPage + 1).toString();
  nounuStore.searchNounu(searchQuery.value.trim(), nextPage, PAGE_SIZE, true);
};

const filteredNounus = computed(() => {
  let list = nounuStore.DataNounus;

  switch (activeCategory.value) {
    case 'available':
      return list.filter((n: Nounu) => n.status === 'disponible');
    case 'verified':
      return list.filter((n: Nounu) => n.certif === 'Accepted');
    case 'night':
      return list.filter(
        (n: Nounu) =>
          n.preferences?.horaire_disponible?.some((h) =>
            /nuit|soir/i.test(h.name)
          )
      );
    case 'baby':
      return list.filter(
        (n: Nounu) =>
          n.preferences?.tranche_age_enfants?.some((a) =>
            /0-3|bébé|nourrisson|baby/i.test(a.name)
          )
      );
    case 'school':
      return list.filter(
        (n: Nounu) =>
          n.preferences?.type_services?.some((s) =>
            /devoir|école|scolaire|aide/i.test(s.name)
          )
      );
    case 'all':
    default:
      return list;
  }
});

watch(searchQuery, (value) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadNounus();
  }, 400);
});

const goToDetail = (nounu: Nounu) => {
  router.push({ name: 'PROFIL_PARENT', params: { id: nounu.id } });
};

const onToggleLike = async (nounu: Nounu) => {
  const result = await toggleLike(nounu.id);
  if (result === null) {
    router.push({ name: 'AUTH_SIGN_IN' });
  }
};

const contactNounu = (nounu: Nounu) => {
  router.push({ name: 'CHAT_MESSAGE_DETAIL', params: { id: nounu.id } });
};

const NEW_NOUNU_THRESHOLD_DAYS = 7;
const isNewNounu = (nounu: Nounu) => {
  if (!nounu.createdAt) return false;
  const created = new Date(nounu.createdAt);
  const diffDays = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= NEW_NOUNU_THRESHOLD_DAYS;
};

const sortedNounus = computed(() => {
  const list = filteredNounus.value;
  if (!hasEarlyAccess.value) return list;
  return [...list].sort((a: Nounu, b: Nounu) => {
    const aNew = isNewNounu(a) ? 1 : 0;
    const bNew = isNewNounu(b) ? 1 : 0;
    if (aNew !== bNew) return bNew - aNew;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});

watch(sortedNounus, (list) => {
  if (list.length > 0) {
    fetchBatchStatus(list.map((n: Nounu) => n.id));
  }
});

usePullToRefresh(async () => {
  preferenceCache = null;
  await fetchPreferenceOptions();
  await loadNounus();
});

onMounted(() => {
  fetchPreferenceOptions();
  if (nounuStore.DataNounus.length === 0) {
    loadNounus();
  }
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
