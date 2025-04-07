<template>
  <div class="flex justify-center">
    <button 
      class="relative w-full max-w-xs py-4 rounded-xl overflow-hidden transition-all duration-500 shadow-lg"
      :class="{
        'bg-green-500 hover:bg-green-600': localStatus,
        'bg-red-500 hover:bg-red-600': !localStatus,
        'opacity-75': isPending || !isOwner
      }"
      @click="toggleStatus"
      :disabled="isPending || !isOwner"
    >
      <!-- Overlay de chargement -->
      <div 
        v-if="isPending"
        class="absolute inset-0 bg-black/20 flex items-center justify-center"
      >
        <svg
          class="animate-spin h-8 w-8 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

      <!-- Contenu du bouton -->
      <div class="relative z-10 flex items-center justify-center h-full gap-3">
        <!-- Icône animée -->
        <div
          class="w-4 h-4 rounded-full border-2 border-white transition-all duration-300"
          :class="{
            'bg-green-500': localStatus,
            'bg-red-500': !localStatus,
          }"
        ></div>
        
        <!-- Texte avec animation -->
        <span class="text-white font-bold text-ng transition-all duration-300">
          {{ localStatus ? 'Disponible' : 'Indisponible' }}
        </span>
      </div>

      <!-- Animation de vague au survol -->
      <div 
        v-if="!isPending"
        class="absolute inset-0 overflow-hidden"
      >
        <div 
          class="absolute -left-10 -top-8 w-60 h-40 bg-white/10 transform origin-center"
          :class="{
            'animate-ripple-green': localStatus,
            'animate-ripple-red': !localStatus,
          }"
        ></div>
      </div>
    </button>

    <!-- Toast de notification -->
    <Transition name="toast">
      <div 
        v-if="showToast"
        class="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-medium"
        :class="{
          'bg-green-500': toastType === 'success',
          'bg-red-500': toastType === 'error'
        }"
      >
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { StorageUtils } from '@/utils/store.utils';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value: string) => ['disponible', 'indisponible'].includes(value)
  },
  isOwner: {
    type: Boolean,
    required: true
  },
});

const emit = defineEmits(['status-updated']);

const queryClient = useQueryClient();
const localStatus = ref(props.status === 'disponible');
const showToast = ref(false);
const toastType = ref<'success'|'error'>('success');
const toastMessage = ref('');

// Mutation optimisée
const { mutate, isPending } = useMutation({
  mutationFn: async (newStatus: boolean) => {
    const statusValue = newStatus ? 'disponible' : 'indisponible';
    const response = await fetch(`${URL_API_ROUTE.NOUNU_UPDATE_STATUS}/${(await StorageUtils().getStore("nProfil_1_Id")).value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: statusValue })
    });
    
    if (!response.ok) throw new Error('Échec de la mise à jour');
    return response.json();
  },
  onSuccess: async () => {
    localStatus.value = !localStatus.value;
    showNotification('success', 'Statut mis à jour !');
    await queryClient.invalidateQueries({
      queryKey: ["ListProfilNounuMe", (await StorageUtils().getStore("nUser_Id")).value],
    });
    emit('status-updated', localStatus.value ? 'disponible' : 'indisponible');
  },
  onError: () => {
    showNotification('error', 'Erreur lors de la mise à jour');
  }
});

const toggleStatus = () => {
  mutate(!localStatus.value);
};

const showNotification = (type: 'success'|'error', message: string) => {
  toastType.value = type;
  toastMessage.value = message;
  showToast.value = true;
  
  const timer = setTimeout(() => {
    showToast.value = false;
    clearTimeout(timer);
  }, 3000);
};

// Synchronisation avec la prop status
watch(() => props.status, (newStatus) => {
  localStatus.value = newStatus === 'disponible';
}, { immediate: true });
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-ripple-green {
  animation: ripple 3s linear infinite;
  background: rgba(16, 185, 129, 0.4);
}

.animate-ripple-red {
  animation: ripple 3s linear infinite;
  background: rgba(239, 68, 68, 0.4);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>