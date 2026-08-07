<template>
  <div class="flex-1 flex flex-col pb-8">
    <!-- Header -->
    <div class="text-center mb-6 px-6">
      <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-4">
        <i class="ri ri-mail-send-line" style="font-size: 14px;"></i>
        <span class="font-love text-[10px] font-bold uppercase tracking-wider">Récupération</span>
      </div>
      <h1 class="font-love text-2xl font-bold text-gray-900 mb-2">
        <template v-if="step === 1">Mot de passe <span class="text-rose-400">oublié</span></template>
        <template v-else-if="step === 2">Code de <span class="text-rose-400">vérification</span></template>
        <template v-else>Nouveau <span class="text-rose-400">mot de passe</span></template>
      </h1>
      <p class="font-love text-sm text-gray-500 px-2">
        <template v-if="step === 1">Entrez votre adresse e-mail, nous vous enverrons un code de réinitialisation.</template>
        <template v-else-if="step === 2">Entrez le code à 6 chiffres envoyé à {{ email }}.</template>
        <template v-else>Choisissez un nouveau mot de passe pour votre compte.</template>
      </p>
    </div>

    <!-- Step indicator -->
    <div class="flex items-center justify-center gap-2 mb-6">
      <div v-for="s in 3" :key="s" :class="['h-1.5 rounded-full transition-all duration-300', s <= step ? 'w-8 bg-rose-400' : 'w-4 bg-rose-100']"></div>
    </div>

    <!-- Success banner -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="successMessage"
        class="mb-5 rounded-2xl bg-teal-50 border border-teal-100 px-4 py-3 flex items-center gap-3"
      >
        <div class="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
          <i class="ri ri-check-line text-teal-600" style="font-size: 16px;"></i>
        </div>
        <p class="font-love text-sm text-teal-700">{{ successMessage }}</p>
      </div>
    </Transition>

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
        v-if="errorMessage"
        class="mb-5 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 flex items-center gap-3"
      >
        <div class="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <i class="ri ri-question-line text-red-600" style="font-size: 16px;"></i>
        </div>
        <p class="font-love text-sm text-red-700">{{ errorMessage }}</p>
      </div>
    </Transition>

    <!-- Card -->
    <div class="bg-white rounded-[32px] shadow-sm p-6 mb-5" v-if="step < 3 || !successMessage">
      <!-- Step 1: Email -->
      <form v-if="step === 1" @submit.prevent="handleSendCode" class="space-y-4">
        <div>
          <label class="block font-love text-sm font-medium text-gray-700 mb-1.5">Adresse e-mail</label>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i class="ri ri-mail-line" style="font-size: 16px;"></i>
            </div>
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="vanessa@example.com"
              class="w-full font-love text-sm bg-rose-50/60 border-0 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-200 pl-10 pr-4 py-3.5 placeholder:text-gray-400"
            />
          </div>
        </div>
        <button
          type="submit"
          :disabled="loading || !email"
          class="relative w-full inline-flex items-center justify-center font-love font-semibold text-white bg-rose-400 hover:bg-rose-500 active:scale-[0.98] rounded-2xl shadow-lg shadow-rose-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-4 text-sm tracking-wide"
        >
          <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <i class="ri ri-loader-4-line ri-spin" style="font-size: 20px;"></i>
          </span>
          <span :class="{ 'opacity-0': loading }">ENVOYER LE CODE</span>
        </button>
      </form>

      <!-- Step 2: Code -->
      <form v-else-if="step === 2" @submit.prevent="handleVerifyCode" class="space-y-4">
        <div>
          <label class="block font-love text-sm font-medium text-gray-700 mb-1.5">Code de vérification</label>
          <input
            ref="codeInputRef"
            v-model="code"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="123456"
            class="w-full font-love text-2xl font-bold text-center tracking-[0.5em] bg-rose-50/60 border-0 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-200 px-4 py-4 placeholder:text-gray-300 placeholder:tracking-normal placeholder:text-sm"
          />
        </div>
        <button
          type="submit"
          :disabled="loading || code.length !== 6"
          class="relative w-full inline-flex items-center justify-center font-love font-semibold text-white bg-rose-400 hover:bg-rose-500 active:scale-[0.98] rounded-2xl shadow-lg shadow-rose-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-4 text-sm tracking-wide"
        >
          <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <i class="ri ri-loader-4-line ri-spin" style="font-size: 20px;"></i>
          </span>
          <span :class="{ 'opacity-0': loading }">VÉRIFIER</span>
        </button>
        <button
          type="button"
          @click="resendCode"
          :disabled="loading || resendCooldown > 0"
          class="w-full text-center font-love text-sm text-teal-500 hover:text-teal-600 font-medium transition-colors disabled:opacity-50"
        >
          {{ resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer le code' }}
        </button>
      </form>

      <!-- Step 3: New password -->
      <form v-else @submit.prevent="handleResetPassword" class="space-y-4">
        <div>
          <label class="block font-love text-sm font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i class="ri ri-lock-line" style="font-size: 16px;"></i>
            </div>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="••••••••"
              class="w-full font-love text-sm bg-rose-50/60 border-0 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-200 pl-10 pr-12 py-3.5 placeholder:text-gray-400"
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
        <div>
          <label class="block font-love text-sm font-medium text-gray-700 mb-1.5">Confirmer le mot de passe</label>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i class="ri ri-lock-line" style="font-size: 16px;"></i>
            </div>
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="••••••••"
              class="w-full font-love text-sm bg-rose-50/60 border-0 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-200 pl-10 pr-12 py-3.5 placeholder:text-gray-400"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i v-if="!showConfirmPassword" class="ri ri-eye-line" style="font-size: 20px;"></i>
              <i v-else class="ri ri-close-line" style="font-size: 20px;"></i>
            </button>
          </div>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="relative w-full inline-flex items-center justify-center font-love font-semibold text-white bg-rose-400 hover:bg-rose-500 active:scale-[0.98] rounded-2xl shadow-lg shadow-rose-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-4 text-sm tracking-wide"
        >
          <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <i class="ri ri-loader-4-line ri-spin" style="font-size: 20px;"></i>
          </span>
          <span :class="{ 'opacity-0': loading }">RÉINITIALISER</span>
        </button>
      </form>
    </div>

    <!-- Footer link -->
    <p class="text-center font-love text-sm text-gray-500 mb-6" v-if="!successMessage">
      <button v-if="step > 1" type="button" @click="goBack" class="text-gray-400 hover:text-gray-600 font-medium transition-colors mr-2">
        <i class="ri ri-arrow-left-line" style="font-size: 14px;"></i> Retour
      </button>
      <router-link :to="{ name: 'AUTH_SIGN_IN' }" class="text-rose-400 hover:text-rose-500 font-semibold transition-colors underline">
        Se connecter
      </router-link>
    </p>

    <!-- Success: link to sign-in -->
    <p class="text-center font-love text-sm text-gray-500 mb-6" v-if="successMessage">
      <router-link :to="{ name: 'AUTH_SIGN_IN' }" class="text-rose-400 hover:text-rose-500 font-semibold transition-colors underline">
        Se connecter
      </router-link>
    </p>

    <!-- Footer -->
    <div class="mt-auto text-center">
      <p class="font-love text-xs text-gray-400">© 2026 BabyNounu. Tous droits réservés.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onUnmounted } from 'vue';
import { usePasswordReset, usePasswordResetConfirm } from '@/features/auth/hooks/useAuth';

const passwordReset = usePasswordReset();
const passwordResetConfirm = usePasswordResetConfirm();

const step = ref(1);
const email = ref('');
const code = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const resendCooldown = ref(0);
const codeInputRef = ref<HTMLInputElement | null>(null);
let cooldownTimer: ReturnType<typeof setInterval> | null = null;

const clearError = () => { errorMessage.value = ''; };

const handleSendCode = async () => {
  if (!email.value) return;
  loading.value = true;
  clearError();
  successMessage.value = '';

  try {
    const data = await passwordReset.mutateAsync(email.value);
    step.value = 2;
    successMessage.value = data.message || 'Un code de réinitialisation a été envoyé à votre email.';
    startCooldown();
    await nextTick();
    codeInputRef.value?.focus();
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.';
  } finally {
    loading.value = false;
  }
};

const handleVerifyCode = async () => {
  if (code.value.length !== 6) return;
  loading.value = true;
  clearError();
  successMessage.value = '';

  try {
    step.value = 3;
    successMessage.value = '';
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || 'Code invalide. Veuillez réessayer.';
  } finally {
    loading.value = false;
  }
};

const handleResetPassword = async () => {
  if (password.value.length < 8) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères.';
    return;
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password.value)) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre.';
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.';
    return;
  }

  loading.value = true;
  clearError();
  successMessage.value = '';

  try {
    const data = await passwordResetConfirm.mutateAsync({
      code: code.value,
      password: password.value,
    });
    successMessage.value = data.message || 'Mot de passe réinitialisé avec succès.';
    step.value = 4;
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.';
    step.value = 2;
  } finally {
    loading.value = false;
  }
};

const resendCode = async () => {
  if (resendCooldown.value > 0) return;
  loading.value = true;
  clearError();

  try {
    await passwordReset.mutateAsync(email.value);
    startCooldown();
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || 'Une erreur est survenue.';
  } finally {
    loading.value = false;
  }
};

const startCooldown = () => {
  resendCooldown.value = 30;
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
    }
  }, 1000);
};

const goBack = () => {
  clearError();
  successMessage.value = '';
  if (step.value > 1) step.value--;
};

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});
</script>
