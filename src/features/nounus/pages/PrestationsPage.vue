<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6">
    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
          <div class="h-8 bg-gray-200 rounded-lg w-20 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded-lg w-16"></div>
        </div>
      </div>
      <div class="bg-white rounded-3xl p-5 shadow-sm animate-pulse">
        <div class="h-5 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
        <div class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-16 bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-5">
      <!-- Financial summary -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <div class="flex items-center gap-2 mb-1">
            <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <i class="ri ri-coins-line text-primary" style="font-size: 16px;"></i>
            </div>
          </div>
          <p class="font-anton text-xl text-gray-900">{{ formatPrice(totalGenerated) }}</p>
          <p class="font-love text-xs text-gray-400 mt-0.5">Total généré</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <div class="flex items-center gap-2 mb-1">
            <div class="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
              <i class="ri ri-checkbox-circle-line text-green-500" style="font-size: 16px;"></i>
            </div>
          </div>
          <p class="font-anton text-xl text-green-600">{{ formatPrice(totalPaid) }}</p>
          <p class="font-love text-xs text-gray-400 mt-0.5">Total payé</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <div class="flex items-center gap-2 mb-1">
            <div class="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <i class="ri ri-timer-line text-orange-500" style="font-size: 16px;"></i>
            </div>
          </div>
          <p class="font-anton text-xl text-orange-500">{{ formatPrice(totalPending) }}</p>
          <p class="font-love text-xs text-gray-400 mt-0.5">En attente</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <div class="flex items-center gap-2 mb-1">
            <div class="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center">
              <i class="ri ri-calendar-line text-rose-400" style="font-size: 16px;"></i>
            </div>
          </div>
          <p class="font-anton text-xl text-rose-400">{{ upcomingPrestations.length }}</p>
          <p class="font-love text-xs text-gray-400 mt-0.5">À venir</p>
        </div>
      </div>

      <!-- Tab switcher -->
      <div class="flex items-center gap-2 bg-white rounded-2xl p-1.5 shadow-sm">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 py-2.5 rounded-xl font-love text-sm font-medium transition-all',
            activeTab === tab.id
              ? 'bg-primary text-white'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" :class="['ml-1 text-xs', activeTab === tab.id ? 'text-white/70' : 'text-gray-400']">
            ({{ tab.count }})
          </span>
        </button>
      </div>

      <!-- Agenda view (upcoming) -->
      <div v-if="activeTab === 'agenda'" class="space-y-4">
        <div class="bg-white rounded-3xl p-6 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <i class="ri ri-calendar-line text-primary" style="font-size: 20px;"></i>
            <h2 class="font-anton text-lg text-gray-900">Agenda des prestations</h2>
          </div>

          <div v-if="upcomingPrestations.length > 0" class="space-y-3">
            <div
              v-for="prestation in upcomingPrestations"
              :key="prestation.id"
              @click="openDetailDrawer(prestation)"
              class="flex items-start gap-4 p-4 rounded-2xl border border-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
            >
              <div class="flex flex-col items-center justify-center min-w-[48px] flex-shrink-0">
                <span class="font-anton text-2xl text-primary">{{ getDay(prestation) }}</span>
                <span class="font-love text-xs text-gray-400 uppercase">{{ getMonth(prestation) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-love text-sm font-semibold text-gray-900">{{ prestation.familyName }}</h3>
                  <span class="px-2.5 py-1 rounded-full bg-rose-50 text-rose-400 font-love text-xs font-medium flex-shrink-0">
                    À venir
                  </span>
                </div>
                <p class="font-love text-xs text-gray-400 mt-0.5 line-clamp-2">{{ prestation.description }}</p>
                <div class="flex items-center gap-2 mt-2 flex-wrap">
                  <span v-if="prestation.periode" class="flex items-center gap-1 font-love text-xs text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                    <i class="ri ri-time-line" style="font-size: 12px;"></i> {{ prestation.periode }}
                  </span>
                  <span class="flex items-center gap-1 font-love text-xs text-gray-500">
                    <i class="ri ri-time-line" style="font-size: 12px;"></i> {{ prestation.schedule || 'Horaire à définir' }}
                  </span>
                  <span class="flex items-center gap-1 font-love text-xs text-gray-500">
                    <i class="ri ri-calendar-2-line" style="font-size: 12px;"></i> {{ formatPeriod(prestation) }}
                  </span>
                </div>
                <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                  <span class="font-anton text-sm text-primary">{{ formatPrice(prestation.amount) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-12 text-center">
            <div class="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center mb-3">
              <i class="ri ri-calendar-line text-rose-300" style="font-size: 32px;"></i>
            </div>
            <p class="font-love text-sm text-gray-400">Aucune prestation à venir</p>
          </div>
        </div>
      </div>

      <!-- Prestations list (future / current / past) -->
      <div v-else class="space-y-3">
        <div
          v-for="prestation in filteredPrestations"
          :key="prestation.id"
          @click="openDetailDrawer(prestation)"
          class="bg-white rounded-3xl p-5 shadow-sm cursor-pointer"
        >
          <div class="flex items-start gap-4">
            <!-- Family avatar -->
            <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img v-if="prestation.familyAvatar" :src="prestation.familyAvatar" alt="" class="h-full w-full object-cover" />
              <span v-else class="font-anton text-sm text-primary/40">{{ prestation.familyName?.[0] || 'F' }}</span>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 class="font-anton text-base text-gray-900 leading-tight">{{ prestation.familyName }}</h3>
                  <p class="font-love text-xs text-gray-400 mt-0.5">{{ prestation.description }}</p>
                </div>
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full font-love text-xs font-medium flex-shrink-0',
                    statusBadgeClass(prestation)
                  ]"
                >
                  {{ statusBadgeLabel(prestation) }}
                </span>
              </div>

              <!-- Period -->
              <div class="flex items-center gap-2 mt-2 flex-wrap">
                <span v-if="prestation.periode" class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 font-love text-xs font-medium">
                  <i class="ri ri-time-line" style="font-size: 12px;"></i> {{ prestation.periode }}
                </span>
                <span class="flex items-center gap-1 font-love text-xs text-gray-500">
                  <i class="ri ri-calendar-2-line" style="font-size: 14px;"></i> {{ formatPeriod(prestation) }}
                </span>
              </div>

              <!-- Amount & payment status -->
              <div class="flex items-center justify-between pt-3 mt-3 border-t border-gray-50">
                <div class="flex items-center gap-3">
                  <span class="font-anton text-base text-primary">{{ formatPrice(prestation.amount) }}</span>
                  <span
                    :class="[
                      'flex items-center gap-1 px-2 py-0.5 rounded-full font-love text-xs font-medium',
                      prestation.isPaid ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    ]"
                  >
                    <i :class="prestation.isPaid ? 'ri ri-checkbox-circle-line' : 'ri ri-timer-line'" style="font-size: 12px;"></i>
                    {{ prestation.isPaid ? 'Payé' : 'Non payé' }}
                  </span>
                </div>
                <div class="flex items-center gap-1 text-gray-400">
                  <i class="ri ri-calendar-line" style="font-size: 14px;"></i>
                  <span class="font-love text-xs">{{ formatDate(prestation.date) }}</span>
                </div>
              </div>

              <!-- Rate button (past prestations only) -->
              <div v-if="activeTab === 'past' && prestation.nounuId && prestation.nounuId !== currentProfileId" class="flex items-center justify-end pt-3 mt-3 border-t border-gray-50">
                <button
                  v-if="!reviewedContracts.has(prestation.id)"
                  @click.stop="openRatingModal(prestation)"
                  class="px-4 py-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 font-love text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <i class="ri ri-star-line" style="font-size: 14px;"></i>
                  Noter la nounu
                </button>
                <span v-else class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 text-green-600 font-love text-xs font-medium">
                  <i class="ri ri-check-line" style="font-size: 14px;"></i>
                  Évaluée
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredPrestations.length === 0" class="flex flex-col items-center justify-center py-16 text-center bg-white rounded-3xl">
          <div class="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="ri ri-wallet-line text-gray-300" style="font-size: 32px;"></i>
          </div>
          <p class="font-love text-sm text-gray-400">Aucune prestation dans cette catégorie</p>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
        <i class="ri ri-close-circle-line text-red-500" style="font-size: 20px;"></i>
        <p class="text-sm text-red-600 font-love">{{ error }}</p>
      </div>
    </div>

    <!-- Rating Modal -->
    <RatingModal
      ref="ratingModalRef"
      :show="showRatingModal"
      :nounu-name="ratingPrestation?.nounuName"
      :nounu-avatar="ratingPrestation?.nounuAvatar"
      @close="closeRatingModal"
      @submit="submitReview"
    />

    <!-- Prestation detail drawer -->
    <Drawer
      :show="showDetailDrawer"
      title="Détail de la prestation"
      max-height="85%"
      @close="closeDetailDrawer"
    >
      <div v-if="selectedPrestation" class="space-y-5">
        <!-- Family -->
        <div class="flex items-center gap-3 p-3 rounded-2xl bg-rose-50">
          <div class="h-12 w-12 rounded-2xl overflow-hidden bg-rose-100 flex items-center justify-center flex-shrink-0">
            <img v-if="selectedPrestation.familyAvatar" :src="selectedPrestation.familyAvatar" alt="" class="h-full w-full object-cover" />
            <i v-else class="ri ri-user-3-line text-rose-400" style="font-size: 24px;"></i>
          </div>
          <div>
            <p class="font-love text-xs text-gray-400">Famille</p>
            <p class="font-anton text-base text-gray-900">{{ selectedPrestation.familyName }}</p>
          </div>
        </div>

        <!-- Nounu -->
        <div v-if="selectedPrestation.nounuName" class="flex items-center gap-3 p-3 rounded-2xl bg-rose-50">
          <div class="h-12 w-12 rounded-2xl overflow-hidden bg-rose-100 flex items-center justify-center flex-shrink-0">
            <img v-if="selectedPrestation.nounuAvatar" :src="selectedPrestation.nounuAvatar" alt="" class="h-full w-full object-cover" />
            <i v-else class="ri ri-user-heart-line text-rose-400" style="font-size: 24px;"></i>
          </div>
          <div>
            <p class="font-love text-xs text-gray-400">Nounu</p>
            <p class="font-anton text-base text-gray-900">{{ selectedPrestation.nounuName }}</p>
          </div>
        </div>

        <!-- Info -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h4 class="font-love text-xs font-medium text-gray-500 mb-3 uppercase">Détails</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-love text-sm text-gray-500">Montant</span>
              <span class="font-anton text-base text-primary">{{ formatPrice(selectedPrestation.amount) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-love text-sm text-gray-500">Statut</span>
              <span :class="['px-2.5 py-1 rounded-full font-love text-xs font-medium', statusBadgeClass(selectedPrestation)]">
                {{ statusBadgeLabel(selectedPrestation) }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-love text-sm text-gray-500">Paiement</span>
              <span :class="['flex items-center gap-1 px-2 py-0.5 rounded-full font-love text-xs font-medium', selectedPrestation.isPaid ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600']">
                <i :class="selectedPrestation.isPaid ? 'ri ri-checkbox-circle-line' : 'ri ri-timer-line'" style="font-size: 12px;"></i>
                {{ selectedPrestation.isPaid ? 'Payé' : 'Non payé' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-love text-sm text-gray-500">Période</span>
              <span class="font-love text-xs text-gray-600">{{ formatPeriod(selectedPrestation) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-love text-sm text-gray-500">Date</span>
              <span class="font-love text-xs text-gray-600">{{ formatDate(selectedPrestation.date) }}</span>
            </div>
            <div v-if="selectedPrestation.periode" class="flex items-center justify-between">
              <span class="font-love text-sm text-gray-500">Durée</span>
              <span class="font-love text-xs text-gray-600">{{ selectedPrestation.periode }}</span>
            </div>
            <div v-if="selectedPrestation.schedule" class="flex items-center justify-between">
              <span class="font-love text-sm text-gray-500">Horaire</span>
              <span class="font-love text-xs text-gray-600">{{ selectedPrestation.schedule }}</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="selectedPrestation.description" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h4 class="font-love text-xs font-medium text-gray-500 mb-2 uppercase">Description</h4>
          <p class="font-love text-sm text-gray-700 leading-relaxed">{{ selectedPrestation.description }}</p>
        </div>

        <!-- Rate button in drawer -->
        <div v-if="activeTab === 'past' && selectedPrestation.nounuId && selectedPrestation.nounuId !== currentProfileId && !reviewedContracts.has(selectedPrestation.id)" class="pt-2">
          <button
            @click="openRatingModal(selectedPrestation); closeDetailDrawer();"
            class="w-full py-3 rounded-2xl bg-rose-400 text-white hover:bg-rose-500 font-love text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <i class="ri ri-star-line" style="font-size: 16px;"></i>
            Noter la nounu
          </button>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import RatingModal from '@/features/nounus/components/RatingModal.vue';
import { Drawer } from '@/components/ui';
import { useAllContracts } from '@/features/contracts/hooks/useContracts';
import { useCreateReview, useCheckReviewsBatch } from '@/features/reviews/hooks/useReviews';
import { getAvatarUrl } from '@/utils/media.utils';
import { StorageUtils } from '@/utils/store.utils';

interface Prestation {
  id: number;
  familyName: string;
  familyAvatar?: string;
  description: string;
  amount: number;
  date: string;
  endDate?: string;
  periode?: string;
  schedule?: string;
  status: string;
  isPaid: boolean;
  contractStatus: string;
  propositionExpired?: string;
  proposalStatus?: string;
  isExpired: boolean;
  nounuId?: string;
  nounuName?: string;
  nounuAvatar?: string;
}

// TanStack Query for contracts
const { data: allContracts, isLoading: loading, error: contractsError } = useAllContracts();
const { mutate: createReview } = useCreateReview();

const activeTab = ref('agenda');
const currentProfileId = ref<string | null>(null);

onMounted(async () => {
  try {
    const stored = await StorageUtils().getStore('nProfil_1_Id');
    currentProfileId.value = stored?.value ?? null;
  } catch {}
});

const error = computed(() => {
  const err = contractsError.value;
  if (err) {
    return (err as any)?.response?.data?.message || (err as any)?.message || 'Erreur lors de la récupération des prestations';
  }
  return null;
});

const prestations = computed<Prestation[]>(() => {
  const data = allContracts.value;
  const contracts = Array.isArray(data) ? data : (data?.data || []);

  return contracts.map((contract: any) => {
    const room = contract.room || {};
    const message = contract.message || {};
    const nounu = room.nounu;
    const parent = room.parent;
    const sender = room.sender;
    const receiver = room.receiver;

    const familyName = parent?.fullname || receiver?.email || sender?.email || 'Famille';
    const familyAvatar = getAvatarUrl(parent?.user?.medias)
      || getAvatarUrl(receiver?.medias)
      || getAvatarUrl(sender?.medias);

    const nounuAvatar = getAvatarUrl(nounu?.user?.medias);

    const propositionExpired = message.propositionExpired || undefined;
    const isExpired = contract.status === 'Pending' && propositionExpired && new Date(propositionExpired) <= new Date();

    return {
      id: contract.id,
      familyName,
      familyAvatar,
      description: message.content?.substring(0, 80) || 'Prestation de garde',
      amount: message.montant || 0,
      date: message.propositionExpired || contract.createdAt,
      endDate: message.propositionExpired || undefined,
      periode: message.periode || undefined,
      schedule: message.content?.match(/\d{1,2}h-\d{1,2}h/)?.[0],
      status: contract.status,
      isPaid: contract.status === 'Accepted' && message.proposalStatus === 'Accepted',
      contractStatus: contract.status,
      propositionExpired,
      proposalStatus: message.proposalStatus,
      isExpired,
      nounuId: nounu?.id,
      nounuName: nounu?.fullname,
      nounuAvatar,
    };
  });
});
const reviewedContracts = ref(new Set<number>());
const showRatingModal = ref(false);
const ratingPrestation = ref<Prestation | null>(null);
const ratingModalRef = ref<any>(null);
const showDetailDrawer = ref(false);
const selectedPrestation = ref<Prestation | null>(null);

// Batch check reviews for past prestations (replaces N+1 pattern)
// Uses useQueries at setup level - proper TanStack Query pattern
const pastContractIds = computed(() =>
  prestations.value
    .filter(p => (p.contractStatus === 'Accepted' || p.contractStatus === 'Completed') && isPastDate(p.date))
    .map(p => p.id.toString())
);
const { reviewedMap } = useCheckReviewsBatch(pastContractIds);

// Sync batch results into reviewedContracts set
watch(reviewedMap, (map) => {
  if (!map || map.size === 0) return;
  const newSet = new Set(reviewedContracts.value);
  for (const [contractId, hasReviewed] of map.entries()) {
    if (hasReviewed) newSet.add(Number(contractId));
  }
  reviewedContracts.value = newSet;
}, { deep: true });

const tabs = computed(() => [
  { id: 'agenda', label: 'Agenda', count: upcomingPrestations.value.length },
  { id: 'future', label: 'À venir', count: prestations.value.filter(p => p.contractStatus === 'Pending' && !p.isExpired).length },
  { id: 'current', label: 'En cours', count: prestations.value.filter(p => p.contractStatus === 'Accepted' && !isPastDate(p.date)).length },
  { id: 'past', label: 'Passées', count: prestations.value.filter(p => (p.contractStatus === 'Accepted' || p.contractStatus === 'Completed') && isPastDate(p.date)).length },
]);

const upcomingPrestations = computed(() => {
  return prestations.value
    .filter(p => !isPastDate(p.date) && !p.isExpired)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

const filteredPrestations = computed(() => {
  if (activeTab.value === 'future') {
    return prestations.value.filter(p => p.contractStatus === 'Pending' && !p.isExpired);
  }
  if (activeTab.value === 'current') {
    return prestations.value.filter(p => p.contractStatus === 'Accepted' && !isPastDate(p.date));
  }
  if (activeTab.value === 'past') {
    return prestations.value
      .filter(p => (p.contractStatus === 'Accepted' || p.contractStatus === 'Completed') && isPastDate(p.date))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  return prestations.value;
});

const totalGenerated = computed(() => {
  return prestations.value
    .filter(p => p.contractStatus === 'Accepted')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
});

const totalPaid = computed(() => {
  return prestations.value
    .filter(p => p.isPaid)
    .reduce((sum, p) => sum + (p.amount || 0), 0);
});

const totalPending = computed(() => {
  return prestations.value
    .filter(p => p.contractStatus === 'Accepted' && !p.isPaid)
    .reduce((sum, p) => sum + (p.amount || 0), 0);
});

const isPastDate = (dateStr: string) => {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() < Date.now();
};

const formatPrice = (price: number) => {
  if (!price) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Date à définir';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatPeriod = (prestation: Prestation) => {
  const start = prestation.date;
  const end = prestation.endDate;
  if (!start && !end) return 'Période à définir';
  if (start && end && start !== end) {
    const startDate = new Date(start).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const endDate = new Date(end).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    return `${startDate} → ${endDate}`;
  }
  return formatDate(start || end || '');
};

const getDay = (prestation: Prestation) => {
  if (!prestation.date) return '--';
  return new Date(prestation.date).getDate().toString().padStart(2, '0');
};

const getMonth = (prestation: Prestation) => {
  if (!prestation.date) return '';
  return new Date(prestation.date).toLocaleDateString('fr-FR', { month: 'short' });
};

const statusBadgeClass = (prestation: Prestation) => {
  if (prestation.contractStatus === 'Pending' && prestation.isExpired) return 'bg-gray-50 text-gray-500';
  if (prestation.contractStatus === 'Pending') return 'bg-yellow-50 text-yellow-600';
  if (prestation.contractStatus === 'Accepted' && !isPastDate(prestation.date)) return 'bg-green-50 text-green-600';
  if (prestation.contractStatus === 'Canceled') return 'bg-red-50 text-red-600';
  return 'bg-gray-50 text-gray-500';
};

const statusBadgeLabel = (prestation: Prestation) => {
  if (prestation.contractStatus === 'Pending' && prestation.isExpired) return 'Expirée';
  if (prestation.contractStatus === 'Pending') return 'En attente';
  if (prestation.contractStatus === 'Accepted' && !isPastDate(prestation.date)) return 'Confirmée';
  if (prestation.contractStatus === 'Canceled') return 'Annulée';
  return 'Terminée';
};

const openRatingModal = (prestation: Prestation) => {
  ratingPrestation.value = prestation;
  showRatingModal.value = true;
};

const closeRatingModal = () => {
  showRatingModal.value = false;
  ratingPrestation.value = null;
};

const openDetailDrawer = (prestation: Prestation) => {
  selectedPrestation.value = prestation;
  showDetailDrawer.value = true;
};

const closeDetailDrawer = () => {
  showDetailDrawer.value = false;
  selectedPrestation.value = null;
};

const submitReview = async (data: { rating: number; comment: string }) => {
  if (!ratingPrestation.value?.nounuId) return;
  try {
    const currentPrestation = ratingPrestation.value;
    createReview({
      nounuId: currentPrestation.nounuId,
      rating: data.rating,
      comment: data.comment || undefined,
      contractId: currentPrestation.id,
    }, {
      onSuccess: () => {
        reviewedContracts.value.add(currentPrestation.id);
        closeRatingModal();
      },
      onError: (e: any) => {
        const msg = e?.response?.data?.message || 'Erreur lors de l\'envoi de l\'évaluation';
        ratingModalRef.value?.setError(msg);
      },
    });
  } catch (e: any) {
    const msg = e?.response?.data?.message || 'Erreur lors de l\'envoi de l\'évaluation';
    ratingModalRef.value?.setError(msg);
  }
};

// Note: checkReviewedPrestations() has been replaced by useCheckReviewsBatch above
// (proper TanStack Query pattern, no more N+1 HTTP requests)
</script>
