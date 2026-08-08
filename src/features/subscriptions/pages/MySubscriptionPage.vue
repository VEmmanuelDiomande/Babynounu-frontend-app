<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Has subscription -->
    <div v-else-if="subscription" class="space-y-5">
      <!-- Pack card -->
      <div class="bg-white rounded-3xl border-2 border-primary/10 p-6">
        <div class="flex items-start gap-4 mb-5">
          <div class="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <i class="ri ri-vip-crown-line text-primary" style="font-size: 28px;"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="font-anton text-xl text-gray-900">{{ packName }}</h2>
            <p v-if="packDescription" class="text-sm text-gray-500 font-love mt-0.5">{{ packDescription }}</p>
            <!-- Price -->
            <div class="flex items-baseline gap-1 mt-2">
              <span class="font-anton text-2xl text-primary">{{ formatPrice(packPrice) }}</span>
              <span class="text-sm text-gray-500 font-love">{{ packCurrency }}</span>
              <span v-if="isLifetime" class="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">
                <i class="ri ri-infinity-line" style="font-size: 12px;"></i> À vie
              </span>
              <span v-else class="ml-2 text-xs text-gray-400 font-love">/ {{ packDurationLabel }}</span>
            </div>
          </div>
          <!-- Status badge -->
          <span
            :class="[
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-love font-semibold flex-shrink-0',
              isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            ]"
          >
            <span :class="['h-1.5 w-1.5 rounded-full', isExpired ? 'bg-red-500' : 'bg-green-500']"></span>
            {{ isExpired ? 'Expiré' : 'Actif' }}
          </span>
        </div>

        <!-- Expiry / duration -->
        <div class="flex items-center gap-2 text-sm font-love text-gray-600 bg-gray-50 rounded-xl px-4 py-3 mb-3">
          <i class="ri ri-calendar-line text-primary" style="font-size: 18px;"></i>
          <template v-if="isLifetime">
            <span class="inline-flex items-center gap-1.5">
              <i class="ri ri-infinity-line text-green-600" style="font-size: 16px;"></i>
              Abonnement à vie
            </span>
          </template>
          <template v-else>
            <span v-if="isExpired" class="text-red-600">
              Expiré le {{ formatDate(subscription.expiresAt) }}
            </span>
            <span v-else>
              Expire le {{ formatDate(subscription.expiresAt) }}
              <span class="text-gray-400">({{ daysRemaining }} jours restants)</span>
            </span>
          </template>
        </div>

        <!-- Subscription date -->
        <div class="flex items-center gap-2 text-xs font-love text-gray-500 px-1">
          <i class="ri ri-time-line" style="font-size: 14px;"></i>
          Souscrit le {{ formatDate(subscription.createdAt) }}
        </div>
      </div>

      <!-- Payment info -->
      <div v-if="payment" class="bg-white rounded-3xl border border-primary/10 p-6">
        <h3 class="font-anton text-base text-gray-900 mb-4 flex items-center gap-2">
          <i class="ri ri-bank-card-line text-primary" style="font-size: 20px;"></i>
          Détails du paiement
        </h3>
        <div class="grid grid-cols-2 gap-4 text-sm font-love">
          <!-- Amount -->
          <div>
            <p class="text-gray-400 text-xs mb-0.5">Montant</p>
            <p class="text-gray-900 font-semibold">{{ formatPrice(payment.amount) }} {{ payment.currency || 'FCFA' }}</p>
          </div>
          <!-- Method -->
          <div>
            <p class="text-gray-400 text-xs mb-0.5">Méthode</p>
            <p class="text-gray-900 font-semibold capitalize">{{ paymentMethodLabel }}</p>
          </div>
          <!-- Date -->
          <div>
            <p class="text-gray-400 text-xs mb-0.5">Date de paiement</p>
            <p class="text-gray-900 font-semibold">{{ formatDate(payment.paymentDate) }}</p>
          </div>
          <!-- Status -->
          <div>
            <p class="text-gray-400 text-xs mb-0.5">Statut</p>
            <p class="flex items-center gap-1.5">
              <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', paymentStatusClass]">
                <span :class="['h-1.5 w-1.5 rounded-full', paymentStatusDot]"></span>
                {{ paymentStatusLabel }}
              </span>
            </p>
          </div>
          <!-- Transaction ID -->
          <div class="col-span-2">
            <p class="text-gray-400 text-xs mb-0.5">Référence transaction</p>
            <p class="text-gray-700 font-mono text-xs break-all bg-gray-50 rounded-lg px-3 py-2">{{ payment.transactionId }}</p>
          </div>
        </div>
      </div>

      <!-- Features -->
      <div v-if="features.length > 0" class="bg-white rounded-3xl border border-primary/10 p-6">
        <h3 class="font-anton text-base text-gray-900 mb-4 flex items-center gap-2">
          <i class="ri ri-star-line text-primary" style="font-size: 20px;"></i>
          Fonctionnalités incluses
        </h3>
        <ul class="space-y-3">
          <li
            v-for="feature in features"
            :key="feature"
            class="flex items-start gap-2.5 text-sm font-love text-gray-700"
          >
            <div class="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i class="ri ri-check-line text-primary" style="font-size: 14px;"></i>
            </div>
            <span>{{ getFeatureLabel(feature) }}</span>
          </li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-3">
        <button
          v-if="isExpired"
          @click="goSubscribe"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-love font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
        >
          <i class="ri ri-refresh-line" style="font-size: 18px;"></i>
          Renouveler
        </button>
        <button
          @click="goSubscribe"
          :class="[
            'inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-love font-semibold border active:scale-95 transition-all',
            isExpired
              ? 'text-primary border-primary/10 hover:bg-primary/10'
              : 'text-primary border-primary/10 hover:bg-primary/10'
          ]"
        >
          <i class="ri ri-swap-line" style="font-size: 18px;"></i>
          {{ isExpired ? 'Changer de pack' : 'Changer de pack' }}
        </button>
      </div>
    </div>

    <!-- No subscription -->
    <div v-else class="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-primary/10">
      <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <i class="ri ri-vip-crown-line text-primary/40" style="font-size: 32px;"></i>
      </div>
      <h2 class="font-anton text-lg text-gray-900 mb-2">Aucun abonnement actif</h2>
      <p class="text-sm text-gray-500 font-love text-center mb-6 max-w-sm">
        Souscrivez à un pack pour accéder aux profils des nounous et profiter de toutes les fonctionnalités.
      </p>
      <button
        @click="goSubscribe"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-love font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
      >
        <i class="ri ri-rocket-line" style="font-size: 18px;"></i>
        Choisir un pack
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAbonnementStore } from '@/stores/abonnementStore';
import { FEATURE_LABELS } from '@/composables/useFeatureGate';

const router = useRouter();
const abonnementStore = useAbonnementStore();

const loading = ref(true);

const subscription = computed(() => abonnementStore.subscriptionData);
const isLifetime = computed(() => abonnementStore.isLifetime);
const isExpired = computed(() => {
  const sub = subscription.value;
  if (!sub) return false;
  // Expiré = status active mais date dépassée (le backend garde 'active' même expiré)
  if (sub.status !== 'active') return false;
  if (sub.expiresAt === null || sub.expiresAt === undefined) return false;
  return new Date(sub.expiresAt) <= new Date();
});
const features = computed(() => abonnementStore.subscriptionFeatures);

// Données du pack (depuis subscription.pack)
const pack = computed(() => subscription.value?.pack || null);
const packName = computed(() => pack.value?.name || 'Abonnement actif');
const packDescription = computed(() => pack.value?.description || '');
const packPrice = computed(() => pack.value?.price ?? subscription.value?.payment?.amount ?? 0);
const packCurrency = computed(() => pack.value?.currency || subscription.value?.payment?.currency || 'FCFA');
const packDurationLabel = computed(() => {
  const days = pack.value?.durationDays;
  if (!days || days === 0) return 'à vie';
  if (days === 30) return 'mois';
  if (days === 365) return 'an';
  if (days === 7) return 'semaine';
  return `${days} jours`;
});

// Données de paiement (depuis subscription.payment)
const payment = computed(() => subscription.value?.payment || null);
const paymentMethodLabel = computed(() => {
  const method = payment.value?.paymentMethod || '';
  const map: Record<string, string> = {
    mobile_money: 'Mobile Money',
    card: 'Carte bancaire',
    wave: 'Wave',
    orange_money: 'Orange Money',
    mtn_money: 'MTN Money',
    moov_money: 'Moov Money',
    cash: 'Espèces',
  };
  return map[method] || method || '—';
});
const paymentStatusLabel = computed(() => {
  const status = payment.value?.status || '';
  const map: Record<string, string> = {
    Success: 'Confirmé',
    Pending: 'En attente',
    Failed: 'Échec',
    Cancelled: 'Annulé',
  };
  return map[status] || status || '—';
});
const paymentStatusClass = computed(() => {
  const status = payment.value?.status;
  if (status === 'Success') return 'bg-green-100 text-green-700';
  if (status === 'Pending') return 'bg-yellow-100 text-yellow-700';
  if (status === 'Failed' || status === 'Cancelled') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
});
const paymentStatusDot = computed(() => {
  const status = payment.value?.status;
  if (status === 'Success') return 'bg-green-500';
  if (status === 'Pending') return 'bg-yellow-500';
  if (status === 'Failed' || status === 'Cancelled') return 'bg-red-500';
  return 'bg-gray-400';
});

// Jours restants avant expiration
const daysRemaining = computed(() => {
  const sub = subscription.value;
  if (!sub?.expiresAt) return 0;
  const diff = new Date(sub.expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

const getFeatureLabel = (key: string): string => FEATURE_LABELS[key] || key;

const formatDate = (date: string | null) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price || 0);
};

const goSubscribe = () => {
  router.push({ name: 'PackSubscrible' });
};

onMounted(async () => {
  try {
    await abonnementStore.myAbonnement();
  } catch (e) {
    console.error('Failed to load subscription:', e);
  } finally {
    loading.value = false;
  }
});
</script>
