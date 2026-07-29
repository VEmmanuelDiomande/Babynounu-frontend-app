<template>
  <div class="min-h-screen bg-rose-50 flex flex-col">
    <!-- Top bar -->
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center gap-2">
        <img src="/images/logos/bn_logo.png" alt="BabyNounu" class="h-8 w-8 object-contain" />
        <span class="font-anton text-lg text-gray-900">BabyNounu</span>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col px-6 py-6">
      <div class="max-w-md mx-auto w-full">
        <!-- Header text -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-4">
            <i class="ri ri-user-3-line" style="font-size: 14px;"></i>
            <span class="font-love text-[10px] font-bold uppercase tracking-wider">Bienvenue</span>
          </div>
          <h1 class="font-love text-3xl font-bold text-gray-900 mb-3">
            Qui êtes-vous <span class="text-rose-400">aujourd'hui ?</span>
          </h1>
          <p class="font-love text-sm text-gray-500 px-2">
            Choisissez votre profil pour accéder à l'expérience qui vous correspond.
          </p>
        </div>

        <!-- Cards -->
        <div class="space-y-4">
          <!-- Parent card -->
          <button
            type="button"
            @click="chooseParent"
            class="w-full text-left bg-white rounded-3xl p-5 border-2 border-rose-100 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-100 transition-all duration-200 group"
          >
            <div class="flex items-start gap-4">
              <div class="h-14 w-14 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-400 transition-colors">
                <i class="ri ri-user-3-line text-rose-400 group-hover:text-white transition-colors" style="font-size: 28px;"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-love text-lg font-bold text-gray-900 mb-1">Je suis parent</h3>
                <p class="font-love text-xs text-gray-500 leading-relaxed mb-3">
                  Trouvez une nounou de confiance pour garder vos enfants en toute sérénité.
                </p>
                <div class="flex items-center gap-2 text-rose-400 font-love text-xs font-bold">
                  <span>Trouver une nounou</span>
                  <i class="ri ri-arrow-right-line" style="font-size: 16px;"></i>
                </div>
              </div>
            </div>
          </button>

          <!-- Nounu card -->
          <button
            type="button"
            @click="chooseNounu"
            class="w-full text-left bg-white rounded-3xl p-5 border-2 border-rose-100 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-100 transition-all duration-200 group"
          >
            <div class="flex items-start gap-4">
              <div class="h-14 w-14 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-400 transition-colors">
                <i class="ri ri-briefcase-line text-rose-400 group-hover:text-white transition-colors" style="font-size: 28px;"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-love text-lg font-bold text-gray-900 mb-1">Je suis nounou</h3>
                <p class="font-love text-xs text-gray-500 leading-relaxed mb-3">
                  Créez votre profil, publiez vos disponibilités et trouvez des missions.
                </p>
                <div class="flex items-center gap-2 text-rose-400 font-love text-xs font-bold">
                  <span>Devenir nounou</span>
                  <i class="ri ri-arrow-right-line" style="font-size: 16px;"></i>
                </div>
              </div>
            </div>
          </button>
        </div>

        <!-- Trust badges -->
        <div class="grid grid-cols-3 gap-3 mt-8">
          <div class="text-center p-3 rounded-2xl bg-white border border-rose-100">
            <i class="ri ri-checkbox-circle-line text-rose-400 mx-auto mb-1.5" style="font-size: 20px;"></i>
            <p class="font-love text-[10px] font-medium text-gray-600">Profils vérifiés</p>
          </div>
          <div class="text-center p-3 rounded-2xl bg-white border border-rose-100">
            <i class="ri ri-bank-card-2-line text-rose-400 mx-auto mb-1.5" style="font-size: 20px;"></i>
            <p class="font-love text-[10px] font-medium text-gray-600">Paiement sécurisé</p>
          </div>
          <div class="text-center p-3 rounded-2xl bg-white border border-rose-100">
            <i class="ri ri-timer-line text-rose-400 mx-auto mb-1.5" style="font-size: 20px;"></i>
            <p class="font-love text-[10px] font-medium text-gray-600">Disponible 24/7</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="font-love text-xs text-gray-400">
            Vous avez déjà un compte ?
            <router-link :to="{ name: 'AUTH_SIGN_IN' }" class="text-rose-400 font-semibold hover:text-rose-500 transition-colors">
              Se connecter
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { StorageUtils } from '@/utils/store.utils';

const router = useRouter();

const chooseParent = async () => {
  await StorageUtils().setStore('nPageType', '/home/nounus');
  await StorageUtils().setStore('nType_Profil', 'parent');
  router.push({ name: 'HOME' });
};

const chooseNounu = async () => {
  await StorageUtils().setStore('nPageType', '/home/jobs');
  await StorageUtils().setStore('nType_Profil', 'nounu');
  router.push({ name: 'AUTH_SIGN_UP' });
};
</script>
