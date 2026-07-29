<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="font-anton text-xl text-gray-900">Paramètres de l'application</h2>
      <p class="text-sm text-gray-500 font-love mt-1">Configurez les informations générales de BabyNounu</p>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading && !adminStore.settings" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Form -->
    <div v-else class="space-y-6">
      <!-- Form card -->
      <div class="bg-white rounded-3xl border border-primary/10 p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <i class="ri ri-settings-3-line text-primary" style="font-size: 20px;"></i>
          </div>
          <div>
            <h3 class="font-anton text-base text-gray-900">Informations générales</h3>
            <p class="text-xs text-gray-500 font-love">Modifiez les paramètres de votre application</p>
          </div>
        </div>

        <form @submit.prevent="handleSave" class="space-y-5">
          <!-- App name -->
          <div>
            <label class="block text-sm font-love font-medium text-gray-700 mb-1.5">
              Nom de l'application
            </label>
            <input
              v-model="form.appName"
              type="text"
              placeholder="BabyNounu"
              class="w-full text-sm font-love border border-primary/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
            />
          </div>

          <!-- App description -->
          <div>
            <label class="block text-sm font-love font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              v-model="form.appDescription"
              rows="3"
              placeholder="Description de l'application"
              class="w-full text-sm font-love border border-primary/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all resize-none"
            />
          </div>

          <!-- Contact email -->
          <div>
            <label class="block text-sm font-love font-medium text-gray-700 mb-1.5">
              Email de contact
            </label>
            <input
              v-model="form.contactEmail"
              type="email"
              placeholder="contact@babynounu.com"
              class="w-full text-sm font-love border border-primary/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
            />
          </div>

          <!-- Support phone -->
          <div>
            <label class="block text-sm font-love font-medium text-gray-700 mb-1.5">
              Téléphone de support
            </label>
            <input
              v-model="form.supportPhone"
              type="tel"
              placeholder="+225 00 00 00 00"
              class="w-full text-sm font-love border border-primary/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
            />
          </div>

          <!-- Submit -->
          <div class="flex items-center gap-3 pt-2">
            <button
              type="submit"
              :disabled="adminStore.isLoading"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-love font-medium hover:bg-primary/90 active:scale-95 disabled:opacity-50 transition-all"
            >
              <i v-if="!adminStore.isLoading" class="ri ri-save-3-line" style="font-size: 16px;"></i>
              <i v-else class="ri ri-loader-4-line ri-spin" style="font-size: 16px;"></i>
              {{ adminStore.isLoading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button
              type="button"
              @click="resetForm"
              class="px-5 py-2.5 rounded-xl border border-primary/10 text-sm font-love font-medium text-gray-600 hover:bg-primary/5 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      <!-- Preview card -->
      <div class="bg-white rounded-3xl border border-primary/10 p-6 shadow-sm">
        <h3 class="font-anton text-sm text-gray-900 mb-4">Aperçu</h3>
        <div class="space-y-4">
          <div class="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <div class="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <img src="/images/logos/bn_logo.png" alt="BabyNounu" class="h-6 w-6 object-contain" />
            </div>
            <div class="min-w-0">
              <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ form.appName || 'BabyNounu' }}</div>
              <div class="text-xs text-gray-500 font-love truncate">{{ form.contactEmail || 'contact@babynounu.com' }}</div>
            </div>
          </div>
          <div class="text-xs text-gray-500 font-love leading-relaxed">
            {{ form.appDescription || 'Aucune description définie' }}
          </div>
          <div class="flex items-center gap-2 pt-3 border-t border-primary/10">
            <i class="ri ri-phone-line text-primary/70" style="font-size: 16px;"></i>
            <span class="text-xs text-gray-500 font-love">{{ form.supportPhone || 'Non défini' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Success message -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="saveSuccess" class="fixed bottom-6 right-6 bg-primary text-white rounded-xl px-5 py-3 shadow-lg shadow-primary/30 flex items-center gap-2 z-50">
        <i class="ri ri-checkbox-circle-line" style="font-size: 20px;"></i>
        <span class="text-sm font-love font-medium">Paramètres enregistrés</span>
      </div>
    </Transition>

    <!-- Error -->
    <div v-if="adminStore.error" class="bg-red-50 border border-red-200 rounded-3xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 24px;"></i>
      <p class="text-sm text-red-600 font-love">{{ adminStore.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';

const adminStore = useAdminStore();
const saveSuccess = ref(false);

const form = reactive({
  appName: '',
  appDescription: '',
  contactEmail: '',
  supportPhone: '',
});

const loadSettings = () => {
  if (adminStore.settings) {
    form.appName = adminStore.settings.appName || '';
    form.appDescription = adminStore.settings.appDescription || '';
    form.contactEmail = adminStore.settings.contactEmail || '';
    form.supportPhone = adminStore.settings.supportPhone || '';
  }
};

const handleSave = async () => {
  saveSuccess.value = false;
  try {
    await adminStore.saveSettings({ ...form });
    saveSuccess.value = true;
    setTimeout(() => { saveSuccess.value = false; }, 3000);
  } catch {
    // error handled in store
  }
};

const resetForm = () => {
  loadSettings();
  saveSuccess.value = false;
};

onMounted(async () => {
  if (!adminStore.settings) {
    await adminStore.fetchSettings();
  }
  loadSettings();
});
</script>
