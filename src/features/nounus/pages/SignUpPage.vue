<template>
  <div class="flex-1 flex flex-col pb-8">
    <!-- Header -->
    <div class="text-center mb-6 px-6">
      <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-4">
        <i class="ri ri-user-3-line" style="font-size: 14px;"></i>
        <span class="font-love text-[10px] font-bold uppercase tracking-wider">Rejoignez la communauté</span>
      </div>
      <h1 class="font-love text-2xl font-bold text-gray-900 mb-2">
        <template v-if="isParent">
          Trouvez une <span class="text-rose-400">Nounu</span><br />BabyNounu
        </template>
        <template v-else>
          Devenez une <span class="text-rose-400">Nounu</span><br />BabyNounu
        </template>
      </h1>
      <p class="font-love text-sm text-gray-500 px-2">
        <template v-if="isParent">
          Rejoignez une communauté de confiance pour trouver la nounou idéale.
        </template>
        <template v-else>
          Offrez vos soins, gagnez en liberté et rejoignez une plateforme de confiance.
        </template>
      </p>
    </div>

    <!-- Error banner -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="authStore.errors.general.message"
        class="mb-5 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 flex items-center gap-3"
      >
        <div class="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <i class="ri ri-question-line text-red-600" style="font-size: 16px;"></i>
        </div>
        <p class="font-love text-sm text-red-700">{{ authStore.errors.general.message }}</p>
      </div>
    </Transition>

    <!-- Card -->
    <div class="bg-white rounded-[32px] shadow-sm p-6 mb-5">
      <div class="mb-5">
        <h2 class="font-love text-xl font-bold text-gray-900 mb-1">Inscription gratuite</h2>
        <p class="font-love text-sm text-gray-400">Commencez votre voyage en quelques secondes.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Profile type selector -->
        <div>
          <label class="block font-love text-sm font-medium text-gray-700 mb-1.5">Je suis</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              :class="[
                'flex items-center justify-center gap-2 font-love font-medium rounded-2xl px-4 py-3 text-sm transition-all duration-200',
                !isParent
                  ? 'bg-rose-400 text-white shadow-md shadow-rose-200'
                  : 'bg-rose-50 text-gray-600 hover:bg-rose-100'
              ]"
              @click="selectProfileType('nounu')"
            >
              <i class="ri ri-briefcase-line" style="font-size: 16px;"></i>
              Nounu
            </button>
            <button
              type="button"
              :class="[
                'flex items-center justify-center gap-2 font-love font-medium rounded-2xl px-4 py-3 text-sm transition-all duration-200',
                isParent
                  ? 'bg-teal-400 text-white shadow-md shadow-teal-200'
                  : 'bg-teal-50 text-gray-600 hover:bg-teal-100'
              ]"
              @click="selectProfileType('parent')"
            >
              <i class="ri ri-parent-line" style="font-size: 16px;"></i>
              Parent
            </button>
          </div>
        </div>

        <!-- Full name -->
        <div>
          <label class="block font-love text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i class="ri ri-user-3-line" style="font-size: 16px;"></i>
            </div>
            <input
              v-model="form.fullname"
              type="text"
              autocomplete="name"
              placeholder="Vanessa Martin"
              class="w-full font-love text-sm bg-rose-50/60 border-0 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-200 pl-10 pr-4 py-3.5 placeholder:text-gray-400"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block font-love text-sm font-medium text-gray-700 mb-1.5">Adresse e-mail</label>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i class="ri ri-mail-line" style="font-size: 16px;"></i>
            </div>
            <input
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="vanessa@example.com"
              :class="[
                'w-full font-love text-sm bg-rose-50/60 border-0 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-200 pl-10 pr-4 py-3.5 placeholder:text-gray-400',
                authStore.errors.general.path === 'email' ? 'ring-2 ring-red-300' : ''
              ]"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block font-love text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i class="ri ri-lock-line" style="font-size: 16px;"></i>
            </div>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="••••••••"
              :class="[
                'w-full font-love text-sm bg-rose-50/60 border-0 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-200 pl-10 pr-12 py-3.5 placeholder:text-gray-400',
                authStore.errors.general.path === 'password' ? 'ring-2 ring-red-300' : ''
              ]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i v-if="!showPassword" class="ri ri-eye-line" style="font-size: 20px;"></i>
              <i v-else class="ri ri-close-line" style="font-size: 20px;"></i>
            </button>
          </div>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="state.loading"
          class="relative w-full inline-flex items-center justify-center font-love font-semibold text-white bg-rose-400 hover:bg-rose-500 active:scale-[0.98] rounded-2xl shadow-lg shadow-rose-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-4 text-sm tracking-wide"
        >
          <span v-if="state.loading" class="absolute inset-0 flex items-center justify-center">
            <i class="ri ri-loader-4-line ri-spin" style="font-size: 20px;"></i>
          </span>
          <span :class="{ 'opacity-0': state.loading }">
            {{ isParent ? 'Créer mon compte Parent' : 'Créer mon compte Nounu' }}
          </span>
        </button>
      </form>
    </div>

    <!-- Divider -->
    <div class="flex items-center gap-4 mb-5">
      <div class="flex-1 h-px bg-rose-200"></div>
      <span class="font-love text-[10px] text-gray-400 uppercase tracking-wider">ou s'inscrire avec</span>
      <div class="flex-1 h-px bg-rose-200"></div>
    </div>

    <!-- Social buttons -->
    <div class="grid grid-cols-2 gap-3 mb-8">
      <button
        type="button"
        class="flex items-center justify-center gap-2 font-love font-medium text-gray-700 bg-white border border-rose-100 hover:bg-rose-50 rounded-2xl transition-all duration-200 px-3 py-3 text-sm"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </button>
      <button
        type="button"
        class="flex items-center justify-center gap-2 font-love font-medium text-white bg-teal-400 hover:bg-teal-500 rounded-2xl transition-all duration-200 px-3 py-3 text-sm"
      >
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.14 3.57-.74.89.28 1.85.84 2.41 1.89-2.63 1.31-2.21 5.98.22 7.13-.57 1.5-1.31 2.99-2.28 3.95zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
        Apple
      </button>
    </div>

    <!-- Footer link -->
    <p class="text-center font-love text-sm text-gray-500 mb-6">
      Déjà membre ?
      <router-link :to="{ name: 'AUTH_SIGN_IN' }" class="text-rose-400 hover:text-rose-500 font-semibold transition-colors underline">
        Se connecter
      </router-link>
    </p>

    <!-- Trust badges -->
    <div class="flex flex-wrap items-center justify-center gap-4 mb-6">
      <div class="flex items-center gap-1.5">
        <i class="ri ri-checkbox-circle-line text-teal-400" style="font-size: 16px;"></i>
        <span class="font-love text-xs text-gray-600">Paiements Sécurisés</span>
      </div>
      <div class="flex items-center gap-1.5">
        <i class="ri ri-checkbox-circle-line text-teal-400" style="font-size: 16px;"></i>
        <span class="font-love text-xs text-gray-600">Profils Vérifiés</span>
      </div>
      <div class="flex items-center gap-1.5">
        <i class="ri ri-timer-line text-teal-400" style="font-size: 16px;"></i>
        <span class="font-love text-xs text-gray-600">Support 24/7</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-auto text-center">
      <p class="font-love text-xs text-gray-400">© 2026 BabyNounu. Tous droits réservés.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useAuthSignUpHook } from '@/hooks/authHooks/signUp.hook';
import { useAuthStore } from '@/stores/auth.store';
import { useProfilStore } from '@/stores/authProfilStore';
import { StorageUtils } from '@/utils/store.utils';

const { state, Register, ToggleActiveMenu_typeOfProfil } = useAuthSignUpHook();
const authStore = useAuthStore();
const profilStore = useProfilStore();

const form = reactive({
  fullname: '',
  email: '',
  password: '',
});

const showPassword = ref(false);

const isParent = computed(
  () => profilStore.state.activeMenu_typeOfProfil === 'open-modal-auth-profil-parent'
);

const selectProfileType = (type: 'nounu' | 'parent') => {
  const index = type === 'parent' ? 3 : 0;
  ToggleActiveMenu_typeOfProfil(index);
};

const handleSubmit = async () => {
  authStore.clearErrors();
  authStore.setEmail(form.email);

  // Stocker le fullname pour pré-remplir la page de création de profil
  if (form.fullname.trim()) {
    await StorageUtils().setStore('nUserFullname', form.fullname.trim());
  }

  Register({
    email: form.email,
    password: form.password,
    type: profilStore.state.activeMenu_typeOfProfil,
    role: 'user',
  });
};
</script>
