<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Has subscription -->
    <div v-else-if="subscription" class="space-y-6">
      <!-- Pack card -->
      <div class="bg-white rounded-3xl border-2 border-primary/10 p-6">
        <div class="flex items-start gap-4 mb-4">
          <div class="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <i class="ri ri-vip-crown-line text-primary" style="font-size: 28px;"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="font-anton text-xl text-gray-900">{{ subscription.pack?.name || 'Abonnement actif' }}</h2>
            <p v-if="subscription.pack?.description" class="text-sm text-gray-500 font-love mt-0.5">{{ subscription.pack.description }}</p>
          </div>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-love font-semibold flex-shrink-0">
            <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            Actif
          </span>
        </div>

        <!-- Expiry -->
        <div class="flex items-center gap-2 text-sm font-love text-gray-600 bg-gray-50 rounded-xl px-4 py-3">
          <i class="ri ri-calendar-line text-primary" style="font-size: 18px;"></i>
          <template v-if="isLifetime">
            <span class="inline-flex items-center gap-1.5">
              <i class="ri ri-infinity-line text-green-600" style="font-size: 16px;"></i>
              Abonnement à vie
            </span>
          </template>
          <template v-else>
            Expire le {{ formatDate(subscription.expiresAt) }}
          </template>
        </div>
      </div>

      <!-- Features -->
      <div v-if="features.length > 0" class="bg-white rounded-3xl border border-primary/10 p-6">
        <h3 class="font-anton text-lg text-gray-900 mb-4">Fonctionnalités incluses</h3>
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
      <div class="flex justify-center">
        <button
          @click="goSubscribe"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-love font-semibold text-primary border border-primary/10 hover:bg-primary/10 active:scale-95 transition-all"
        >
          <i class="ri ri-swap-line" style="font-size: 18px;"></i>
          Changer de pack
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
const features = computed(() => abonnementStore.subscriptionFeatures);

const getFeatureLabel = (key: string): string => FEATURE_LABELS[key] || key;

const formatDate = (date: string | null) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
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
