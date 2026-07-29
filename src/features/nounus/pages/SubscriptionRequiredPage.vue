<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6">
    <!-- Header -->
    <div class="flex flex-col items-center justify-center py-8 px-4 bg-white rounded-3xl mb-6">
      <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <i class="ri ri-vip-crown-line text-primary" style="font-size: 32px;"></i>
      </div>
      <h1 class="font-anton text-2xl text-gray-900 mb-2">Abonnement requis</h1>
      <p class="text-sm text-gray-500 font-love text-center max-w-md">
        Choisissez un pack pour accéder aux profils des nounous et profiter de toutes les fonctionnalités.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Packs -->
    <div v-else-if="packs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="pack in packs"
        :key="pack.id"
        :class="[
          'relative bg-white rounded-3xl border-2 p-6 transition-all duration-300 hover:shadow-lg',
          selectedPackId === pack.id ? 'border-primary shadow-md' : 'border-primary/10'
        ]"
      >
        <!-- Popular badge -->
        <div
          v-if="pack.priority === 0"
          class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-love font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide"
        >
          Populaire
        </div>

        <!-- Pack name -->
        <h3 class="font-anton text-xl text-gray-900 mb-1">{{ pack.name }}</h3>
        <p v-if="pack.description" class="text-xs text-gray-500 font-love mb-4">{{ pack.description }}</p>

        <!-- Price -->
        <div class="flex items-baseline gap-1 mb-4">
          <span class="font-anton text-3xl text-primary">{{ formatPrice(pack.price) }}</span>
          <span class="text-sm text-gray-500 font-love">{{ pack.currency || 'FCFA' }}</span>
        </div>

        <!-- Duration -->
        <div class="text-xs text-gray-500 font-love mb-4 flex items-center gap-1.5">
          <i class="ri ri-calendar-line" style="font-size: 14px;"></i>
          <template v-if="pack.durationDays === 0 || !pack.durationDays">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">
              <i class="ri ri-infinity-line" style="font-size: 12px;"></i> À vie
            </span>
          </template>
          <template v-else>
            Durée : {{ pack.durationDays }} jours
          </template>
        </div>

        <!-- Features -->
        <ul v-if="pack.features && Array.isArray(pack.features) && pack.features.length > 0" class="space-y-2 mb-6">
          <li
            v-for="(feature, idx) in pack.features"
            :key="idx"
            class="flex items-start gap-2 text-sm font-love text-gray-700"
          >
            <i class="ri ri-check-line text-primary flex-shrink-0 mt-0.5" style="font-size: 16px;"></i>
            <span>{{ getFeatureLabel(feature) }}</span>
          </li>
        </ul>

        <!-- Select button -->
        <button
          @click="selectPack(pack)"
          :disabled="subscribing"
          :class="[
            'w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-love font-semibold transition-all active:scale-95',
            selectedPackId === pack.id
              ? 'bg-primary text-white hover:bg-primary/90 shadow-sm'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          ]"
        >
          <i class="ri ri-checkbox-circle-line" style="font-size: 18px;"></i>
          {{ selectedPackId === pack.id ? 'Pack sélectionné' : 'Choisir ce pack' }}
        </button>
      </div>
    </div>

    <!-- No packs -->
    <div v-else class="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl">
      <div class="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <i class="ri ri-inbox-line text-gray-300" style="font-size: 32px;"></i>
      </div>
      <p class="text-sm text-gray-500 font-love text-center">
        Aucun pack disponible pour le moment. Veuillez réessayer plus tard.
      </p>
    </div>

    <!-- Subscribe button -->
    <div v-if="selectedPackId && packs.length > 0" class="flex justify-center mt-6">
      <button
        @click="subscribe"
        :disabled="subscribing"
        class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-love font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-md disabled:opacity-60"
      >
        <div v-if="subscribing" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        <i v-else class="ri ri-rocket-line" style="font-size: 18px;"></i>
        {{ subscribing ? 'Traitement en cours...' : 'Souscrire maintenant' }}
      </button>
    </div>

    <!-- Error -->
    <div v-if="errorMsg" class="mt-4 flex items-center justify-center gap-2 text-sm text-red-600 font-love">
      <i class="ri ri-error-warning-line" style="font-size: 16px;"></i>
      {{ errorMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Browser } from '@capacitor/browser';
import { fetchActivePacks, initiatePayment } from '@/services/subscrible.services';
import { StorageUtils } from '@/utils/store.utils';
import { isNativePlatform, getPaymentReturnUrl } from '@/utils/payment.utils';
import { FEATURE_LABELS } from '@/composables/useFeatureGate';

const router = useRouter();

const getFeatureLabel = (key: string): string => FEATURE_LABELS[key] || key;

const packs = ref<any[]>([]);
const loading = ref(true);
const subscribing = ref(false);
const selectedPackId = ref<number | null>(null);
const errorMsg = ref<string | null>(null);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price);
};

const fetchPacks = async () => {
  try {
    loading.value = true;
    const data = await fetchActivePacks();
    packs.value = Array.isArray(data) ? data : [];
  } catch (e: any) {
    errorMsg.value = e.message || 'Erreur lors du chargement des packs';
  } finally {
    loading.value = false;
  }
};

const selectPack = (pack: any) => {
  selectedPackId.value = pack.id;
};

const subscribe = async () => {
  if (!selectedPackId.value) return;
  const pack = packs.value.find((p) => p.id === selectedPackId.value);
  if (!pack) return;

  try {
    subscribing.value = true;
    errorMsg.value = null;

    const nUser = await StorageUtils().getStore("nUser");
    const userData = nUser?.value ? JSON.parse(nUser.value) : {};

    const returnUrl = getPaymentReturnUrl();

    const payment = await initiatePayment({
      amount: pack.price,
      currency: pack.currency || 'XOF',
      customerName: userData.fullname || userData.name || 'Client',
      customerSurname: 'BabyNounu',
      customerEmail: userData.email || undefined,
      customerPhoneNumber: userData.phone || undefined,
      description: `Abonnement ${pack.name} - ${pack.price} ${pack.currency || 'FCFA'}`,
      packId: pack.id,
      returnUrl,
    });

    await StorageUtils().setStore("nPendingPayment", JSON.stringify({
      paymentId: payment.paymentId,
      transactionId: payment.transactionId,
      packId: pack.id,
      packName: pack.name,
      packPrice: pack.price,
      packCurrency: pack.currency || 'FCFA',
      packDurationDays: pack.durationDays,
    }));

    if (isNativePlatform()) {
      await Browser.open({
        url: payment.paymentUrl,
        presentationStyle: 'fullscreen',
      });
    } else {
      window.location.href = payment.paymentUrl;
    }
  } catch (e: any) {
    errorMsg.value = e.message || 'Erreur lors de l\'initialisation du paiement';
  } finally {
    subscribing.value = false;
  }
};

onMounted(() => {
  fetchPacks();
});
</script>
