<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-b from-rose-50/30 to-white">
    <div class="w-full max-w-md">
      <!-- Loading -->
      <div v-if="status === 'loading'" class="bg-white rounded-3xl shadow-sm border border-primary/10 p-8 flex flex-col items-center text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-6"></div>
        <h2 class="font-anton text-xl text-gray-900 mb-2">Vérification du paiement</h2>
        <p class="text-sm text-gray-500 font-love">
          Nous vérifions votre paiement auprès de CinetPay. Veuillez patienter...
        </p>
      </div>

      <!-- Success -->
      <div v-else-if="status === 'success'" class="bg-white rounded-3xl shadow-sm border border-primary/10 p-8 flex flex-col items-center text-center">
        <div class="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <i class="ri ri-check-double-line text-green-500" style="font-size: 40px;"></i>
        </div>
        <h2 class="font-anton text-xl text-gray-900 mb-2">Paiement réussi !</h2>
        <p class="text-sm text-gray-500 font-love mb-1">
          Votre abonnement <span class="font-semibold text-primary">{{ pendingPayment?.packName }}</span> est maintenant actif.
        </p>
        <p class="text-xs text-gray-400 font-love mb-6">
          Durée : {{ pendingPayment?.packDurationDays }} jours
        </p>
        <button
          @click="goHome"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-love font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
        >
          <i class="ri ri-home-line" style="font-size: 18px;"></i>
          Retour à l'accueil
        </button>
      </div>

      <!-- Pending -->
      <div v-else-if="status === 'pending'" class="bg-white rounded-3xl shadow-sm border border-primary/10 p-8 flex flex-col items-center text-center">
        <div class="h-20 w-20 rounded-full bg-yellow-100 flex items-center justify-center mb-6">
          <i class="ri ri-time-line text-yellow-500" style="font-size: 40px;"></i>
        </div>
        <h2 class="font-anton text-xl text-gray-900 mb-2">Paiement en cours</h2>
        <p class="text-sm text-gray-500 font-love mb-6">
          Votre paiement est en cours de traitement. Vous serez notifié dès qu'il sera confirmé.
        </p>
        <div class="flex flex-col gap-3 w-full">
          <button
            @click="retryVerify"
            :disabled="verifying"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-love font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-sm disabled:opacity-60"
          >
            <div v-if="verifying" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <i v-else class="ri ri-refresh-line" style="font-size: 18px;"></i>
            Vérifier à nouveau
          </button>
          <button
            @click="goHome"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-love font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>

      <!-- Failed -->
      <div v-else-if="status === 'failed'" class="bg-white rounded-3xl shadow-sm border border-primary/10 p-8 flex flex-col items-center text-center">
        <div class="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <i class="ri ri-close-circle-line text-red-500" style="font-size: 40px;"></i>
        </div>
        <h2 class="font-anton text-xl text-gray-900 mb-2">Paiement échoué</h2>
        <p class="text-sm text-gray-500 font-love mb-6">
          Le paiement n'a pas pu être complété. Veuillez réessayer.
        </p>
        <button
          @click="goSubscribe"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-love font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
        >
          <i class="ri ri-arrow-left-line" style="font-size: 18px;"></i>
          Réessayer
        </button>
      </div>

      <!-- Error -->
      <div v-else-if="status === 'error'" class="bg-white rounded-3xl shadow-sm border border-primary/10 p-8 flex flex-col items-center text-center">
        <div class="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <i class="ri ri-error-warning-line text-gray-400" style="font-size: 40px;"></i>
        </div>
        <h2 class="font-anton text-xl text-gray-900 mb-2">Erreur</h2>
        <p class="text-sm text-gray-500 font-love mb-6">{{ errorMsg }}</p>
        <button
          @click="goHome"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-love font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
        >
          <i class="ri ri-home-line" style="font-size: 18px;"></i>
          Retour à l'accueil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { verifyPayment, subscribeToPack } from '@/services/subscrible.services';
import { StorageUtils } from '@/utils/store.utils';

const router = useRouter();
const route = useRoute();

const status = ref<'loading' | 'success' | 'pending' | 'failed' | 'error'>('loading');
const errorMsg = ref<string>('');
const verifying = ref(false);
const pendingPayment = ref<any>(null);
let browserListener: any = null;
let isHandling = false;

const handleReturn = async (transactionId?: string) => {
  if (isHandling) return;
  isHandling = true;

  const txId = transactionId || (route.query.transaction_id as string);

  if (!txId) {
    status.value = 'error';
    errorMsg.value = 'Aucun identifiant de transaction trouvé.';
    isHandling = false;
    return;
  }

  const stored = await StorageUtils().getStore("nPendingPayment");
  if (stored?.value) {
    try {
      pendingPayment.value = JSON.parse(stored.value);
    } catch {
      pendingPayment.value = null;
    }
  }

  await verifyTransaction(txId);
  isHandling = false;
};

const verifyTransaction = async (transactionId: string) => {
  try {
    status.value = 'loading';
    verifying.value = true;

    const result = await verifyPayment(transactionId);

    if (result.status === 'Success') {
      if (pendingPayment.value) {
        try {
          await subscribeToPack({
            paymentId: result.paymentId,
            packId: pendingPayment.value.packId,
            durationDays: pendingPayment.value.packDurationDays,
          });
        } catch (e: any) {
          console.warn('Subscription creation warning:', e.message);
        }
      }

      await StorageUtils().setStore("nIsAbonnement", "true");
      await StorageUtils().removeStore("nPendingPayment");
      status.value = 'success';
    } else if (result.status === 'Pending') {
      status.value = 'pending';
    } else {
      status.value = 'failed';
    }
  } catch (e: any) {
    status.value = 'error';
    errorMsg.value = e.message || 'Erreur lors de la vérification du paiement.';
  } finally {
    verifying.value = false;
  }
};

const retryVerify = () => {
  const transactionId = route.query.transaction_id as string;
  if (transactionId) {
    verifyTransaction(transactionId);
  }
};

const goHome = () => {
  router.push({ name: 'HOME' });
};

const goSubscribe = () => {
  router.push({ name: 'PackSubscrible' });
};

onMounted(async () => {
  if (Capacitor.isNativePlatform()) {
    browserListener = await Browser.addListener('browserFinished', () => {
      const txId = route.query.transaction_id as string;
      if (txId) {
        handleReturn(txId);
      }
    });
  }
  handleReturn();
});

onUnmounted(() => {
  if (browserListener) {
    browserListener.remove();
  }
});
</script>
