<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6">
    <!-- Account section -->
    <div class="bg-white rounded-3xl p-5 shadow-sm mb-4">
      <div class="flex items-center gap-2 mb-4">
        <div class="h-8 w-8 rounded-xl bg-rose-50 flex items-center justify-center">
          <i class="ri ri-user-settings-line text-rose-400" style="font-size: 16px;"></i>
        </div>
        <h2 class="font-anton text-base text-gray-900">Compte</h2>
      </div>
      <div class="space-y-1">
        <button
          @click="goToEditProfile"
          class="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-rose-50/50 transition-colors text-left"
        >
          <div class="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
            <i class="ri ri-pencil-line text-gray-500" style="font-size: 18px;"></i>
          </div>
          <div class="flex-1">
            <p class="font-love text-sm text-gray-900 font-medium">Modifier mon profil</p>
            <p class="font-love text-xs text-gray-400">Nom, photo, compétences, etc.</p>
          </div>
          <i class="ri ri-arrow-right-s-line text-gray-300" style="font-size: 20px;"></i>
        </button>

        <button
          @click="goToPrestations"
          class="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-rose-50/50 transition-colors text-left"
        >
          <div class="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
            <i class="ri ri-wallet-line text-gray-500" style="font-size: 18px;"></i>
          </div>
          <div class="flex-1">
            <p class="font-love text-sm text-gray-900 font-medium">Mes prestations</p>
            <p class="font-love text-xs text-gray-400">Tarifs et historique des paiements</p>
          </div>
          <i class="ri ri-arrow-right-s-line text-gray-300" style="font-size: 20px;"></i>
        </button>

        <button
          @click="goToSubscription"
          class="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-rose-50/50 transition-colors text-left"
        >
          <div class="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
            <i class="ri ri-vip-crown-line text-gray-500" style="font-size: 18px;"></i>
          </div>
          <div class="flex-1">
            <p class="font-love text-sm text-gray-900 font-medium">Abonnement</p>
            <p class="font-love text-xs text-gray-400">Gérez votre plan d'abonnement</p>
          </div>
          <i class="ri ri-arrow-right-s-line text-gray-300" style="font-size: 20px;"></i>
        </button>
      </div>
    </div>

    <!-- Availability section (nounu only) -->
    <div v-if="isNounu" class="bg-white rounded-3xl p-5 shadow-sm mb-4">
      <div class="flex items-center gap-2 mb-4">
        <div class="h-8 w-8 rounded-xl bg-green-50 flex items-center justify-center">
          <i class="ri ri-pulse-line text-green-500" style="font-size: 16px;"></i>
        </div>
        <h2 class="font-anton text-base text-gray-900">Disponibilité</h2>
      </div>
      <div class="space-y-1">
        <div class="flex items-center gap-3 p-3 rounded-2xl">
          <div class="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0" :class="isAvailable ? 'bg-green-50' : 'bg-red-50'">
            <i :class="['ri', isAvailable ? 'ri-checkbox-circle-line text-green-500' : 'ri-forbid-line text-red-500']" style="font-size: 18px;"></i>
          </div>
          <div class="flex-1">
            <p class="font-love text-sm text-gray-900 font-medium">{{ isAvailable ? 'Disponible' : 'Indisponible' }}</p>
            <p class="font-love text-xs text-gray-400">{{ isAvailable ? 'Vous apparaissez dans les recherches des parents' : 'Vous n\'apparaissez plus dans les recherches' }}</p>
          </div>
          <button
            @click="toggleAvailability"
            :disabled="statusLoading"
            :class="[
              'relative h-6 w-11 rounded-full transition-colors flex-shrink-0',
              statusLoading ? 'opacity-50 cursor-not-allowed' : '',
              isAvailable ? 'bg-green-500' : 'bg-gray-200'
            ]"
          >
            <span
              :class="[
                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                isAvailable ? 'translate-x-5' : 'translate-x-0.5'
              ]"
            ></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Preferences section -->
    <div class="bg-white rounded-3xl p-5 shadow-sm mb-4">
      <div class="flex items-center gap-2 mb-4">
        <div class="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
          <i class="ri ri-notification-3-line text-blue-400" style="font-size: 16px;"></i>
        </div>
        <h2 class="font-anton text-base text-gray-900">Préférences</h2>
      </div>
      <div class="space-y-1">
        <div class="flex items-center gap-3 p-3 rounded-2xl">
          <div class="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
            <i class="ri ri-notification-3-line text-gray-500" style="font-size: 18px;"></i>
          </div>
          <div class="flex-1">
            <p class="font-love text-sm text-gray-900 font-medium">Notifications push</p>
            <p class="font-love text-xs text-gray-400">{{ pushNotifStatusText }}</p>
          </div>
          <button
            @click="togglePushNotifications"
            :disabled="pushNotifLoading"
            :class="[
              'relative h-6 w-11 rounded-full transition-colors flex-shrink-0',
              pushNotifLoading ? 'opacity-50 cursor-not-allowed' : '',
              pushNotif ? 'bg-rose-400' : 'bg-gray-200'
            ]"
          >
            <span
              :class="[
                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                pushNotif ? 'translate-x-5' : 'translate-x-0.5'
              ]"
            ></span>
          </button>
        </div>

        <div class="flex items-center gap-3 p-3 rounded-2xl">
          <div class="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
            <i class="ri ri-mail-line text-gray-500" style="font-size: 18px;"></i>
          </div>
          <div class="flex-1">
            <p class="font-love text-sm text-gray-900 font-medium">Notifications email</p>
            <p class="font-love text-xs text-gray-400">Recevoir les emails</p>
          </div>
          <button
            @click="emailNotif = !emailNotif"
            :class="[
              'relative h-6 w-11 rounded-full transition-colors flex-shrink-0',
              emailNotif ? 'bg-rose-400' : 'bg-gray-200'
            ]"
          >
            <span
              :class="[
                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                emailNotif ? 'translate-x-5' : 'translate-x-0.5'
              ]"
            ></span>
          </button>
        </div>
      </div>
    </div>

    <!-- About section -->
    <div class="bg-white rounded-3xl p-5 shadow-sm mb-4">
      <div class="flex items-center gap-2 mb-4">
        <div class="h-8 w-8 rounded-xl bg-teal-50 flex items-center justify-center">
          <i class="ri ri-information-line text-teal-500" style="font-size: 16px;"></i>
        </div>
        <h2 class="font-anton text-base text-gray-900">À propos</h2>
      </div>
      <div class="space-y-1">
        <div class="flex items-center gap-3 p-3 rounded-2xl">
          <div class="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
            <i class="ri ri-shield-line text-gray-500" style="font-size: 18px;"></i>
          </div>
          <div class="flex-1">
            <p class="font-love text-sm text-gray-900 font-medium">Confidentialité</p>
            <p class="font-love text-xs text-gray-400">Politique de confidentialité</p>
          </div>
          <i class="ri ri-arrow-right-s-line text-gray-300" style="font-size: 20px;"></i>
        </div>

        <div class="flex items-center gap-3 p-3 rounded-2xl">
          <div class="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
            <i class="ri ri-file-list-line text-gray-500" style="font-size: 18px;"></i>
          </div>
          <div class="flex-1">
            <p class="font-love text-sm text-gray-900 font-medium">Conditions d'utilisation</p>
            <p class="font-love text-xs text-gray-400">Termes et conditions</p>
          </div>
          <i class="ri ri-arrow-right-s-line text-gray-300" style="font-size: 20px;"></i>
        </div>

        <div class="flex items-center gap-3 p-3 rounded-2xl">
          <div class="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
            <i class="ri ri-version-line text-gray-500" style="font-size: 18px;"></i>
          </div>
          <div class="flex-1">
            <p class="font-love text-sm text-gray-900 font-medium">Version</p>
            <p class="font-love text-xs text-gray-400">1.0.0</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Support section -->
    <div class="bg-white rounded-3xl p-5 shadow-sm mb-4">
      <div class="flex items-center gap-2 mb-4">
        <div class="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center">
          <i class="ri ri-customer-service-2-line text-amber-500" style="font-size: 16px;"></i>
        </div>
        <h2 class="font-anton text-base text-gray-900">Support</h2>
      </div>
      <div class="space-y-1">
        <button
          @click="hasPrioritySupport ? openPrioritySupport() : router.push({ name: 'MySubscription' })"
          class="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-amber-50/50 transition-colors text-left"
        >
          <div class="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0" :class="hasPrioritySupport ? 'bg-amber-50' : 'bg-gray-50'">
            <i :class="hasPrioritySupport ? 'ri ri-vip-crown-2-line text-amber-500' : 'ri ri-lock-line text-gray-400'" style="font-size: 18px;"></i>
          </div>
          <div class="flex-1">
            <p class="font-love text-sm text-gray-900 font-medium">Support prioritaire</p>
            <p class="font-love text-xs text-gray-400">{{ hasPrioritySupport ? 'Réponse garantie sous 24h' : 'Disponible avec le Pack Premium' }}</p>
          </div>
          <span v-if="hasPrioritySupport" class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-love text-[10px] font-semibold">Actif</span>
          <i v-else class="ri ri-arrow-right-s-line text-gray-300" style="font-size: 20px;"></i>
        </button>

        <div class="flex items-center gap-3 p-3 rounded-2xl">
          <div class="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
            <i class="ri ri-question-line text-gray-500" style="font-size: 18px;"></i>
          </div>
          <div class="flex-1">
            <p class="font-love text-sm text-gray-900 font-medium">Centre d'aide</p>
            <p class="font-love text-xs text-gray-400">FAQ et guides</p>
          </div>
          <i class="ri ri-arrow-right-s-line text-gray-300" style="font-size: 20px;"></i>
        </div>
      </div>
    </div>

    <!-- Logout -->
    <button
      @click="handleLogout"
      class="w-full py-3.5 rounded-2xl bg-white border border-red-100 text-red-500 hover:bg-red-50 font-love text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
    >
      <i class="ri ri-logout-box-line" style="font-size: 18px;"></i>
      Se déconnecter
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core';
import { StorageUtils } from '@/utils/store.utils';
import { useProfiNounulStore } from '@/stores/authProfilNounuStore';
import { useAuthStore } from '@/stores/auth.store';
import { useAbonnementStore } from '@/stores/abonnementStore';
import { useNounuProfile, useUpdateNounuStatus } from '@/features/profile/hooks/useProfile';
import { pushNotificationService } from '@/services/pushNotification.services';

const router = useRouter();
const nounuStore = useProfiNounulStore();
const authStore = useAuthStore();
const abonnementStore = useAbonnementStore();

const hasPrioritySupport = computed(() => abonnementStore.hasFeature('priority_support'));

const openPrioritySupport = () => {
  window.open('mailto:support@babynounu.com?subject=Support%20Prioritaire', '_blank');
};

// ── Push notifications toggle (vraie gestion des permissions) ──
const pushNotif = ref(false);
const pushNotifLoading = ref(false);
const pushPermissionDenied = ref(false); // permission OS refusee definitivement

const pushNotifStatusText = computed(() => {
  if (pushNotifLoading.value) return 'Mise à jour...';
  if (pushNotif.value) return 'Activées';
  if (pushPermissionDenied.value) return 'Refusées — voir paramètres Android';
  return 'Désactivées';
});

const togglePushNotifications = async () => {
  if (pushNotifLoading.value) return;
  pushNotifLoading.value = true;
  try {
    if (pushNotif.value) {
      // Desactiver : desenregistrer le token
      await pushNotificationService.disable();
      pushNotif.value = false;
    } else {
      // Activer : demander la permission + init + register
      const ok = await pushNotificationService.enable();
      pushNotif.value = ok;
      if (!ok) {
        // Si la permission a ete refusee, on propose d'ouvrir les parametres Android
        const status = await pushNotificationService.checkPermissionStatus();
        if (status === 'denied') {
          pushPermissionDenied.value = true;
          // Ouvrir les parametres de l'app pour permettre a l'utilisateur
          // d'activer manuellement les notifications
          if (Capacitor.isNativePlatform()) {
            try {
              const { App } = await import('@capacitor/app');
              // openUrl n'existe pas ; utiliser une intent Android via plugin natif
              // Pour l'instant, on informe l'utilisateur
              console.warn('[Settings] Push permission denied. User must enable in Android settings.');
            } catch (e) {
              console.warn('[Settings] Could not open app settings:', e);
            }
          }
        }
      } else {
        pushPermissionDenied.value = false;
      }
    }
  } catch (e) {
    console.error('[Settings] Toggle push error:', e);
  } finally {
    pushNotifLoading.value = false;
  }
};

const emailNotif = ref(true);

// ── Nounu availability toggle ──
const userType = ref<string | null>(null);
const { data: nounuProfileData } = useNounuProfile();
const updateStatusMutation = useUpdateNounuStatus();
const statusLoading = computed(() => updateStatusMutation.isPending.value);

const isNounu = computed(() => userType.value === 'nounu');
const currentStatus = computed(() => {
  const raw = nounuProfileData.value;
  // TransformInterceptor wraps responses as { success, data }
  const profile = raw && typeof raw === 'object' && 'success' in raw && 'data' in raw ? raw.data : raw;
  return profile?.status || 'disponible';
});
const isAvailable = computed(() => currentStatus.value === 'disponible');

const toggleAvailability = () => {
  const next = isAvailable.value ? 'indisponible' : 'disponible';
  updateStatusMutation.mutate(next as 'disponible' | 'indisponible');
};

onMounted(async () => {
  const [typeResult, pageTypeResult, roleResult] = await Promise.all([
    StorageUtils().getStore('nType_Profil'),
    StorageUtils().getStore('nPageType'),
    StorageUtils().getStore('nRole'),
  ]);
  const typeProfil = typeResult?.value || null;
  const pageType = pageTypeResult?.value || null;
  const role = roleResult?.value || null;

  if (pageType === '/home/jobs' || typeProfil === 'nounu' || typeProfil === 'prestataire' || role === 'nounou') {
    userType.value = 'nounu';
  } else if (pageType === '/home/nounus' || typeProfil === 'parent' || typeProfil === 'client' || role === 'parent') {
    userType.value = 'parent';
  } else {
    userType.value = null;
  }

  // Verifier l'etat reel des permissions push au chargement
  if (Capacitor.isNativePlatform()) {
    try {
      const status = await pushNotificationService.checkPermissionStatus();
      if (status === 'granted') {
        // Verifier si un token est enregistre localement
        const tokenResult = await StorageUtils().getStore('nPushToken');
        pushNotif.value = !!tokenResult?.value;
      } else if (status === 'denied') {
        pushNotif.value = false;
        pushPermissionDenied.value = true;
      } else {
        pushNotif.value = false;
      }
    } catch (e) {
      console.warn('[Settings] Could not check push permission status:', e);
    }
  }
});

const goBack = () => {
  router.back();
};

const goToEditProfile = () => {
  authStore.setUpdateProfil(true, '');
  router.push({ name: 'AUTH_PROFILE_NOUNU', query: { edit: 'true' } });
};

const goToPrestations = () => {
  router.push({ name: 'PRESTATIONS' });
};

const goToSubscription = () => {
  router.push({ name: 'MySubscription' });
};

const handleLogout = async () => {
  const storage = StorageUtils();
  await storage.clearStore();
  router.push({ name: 'AUTH_SIGN_IN' });
};
</script>
