<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Bouton de statut -->
    <button 
      class="relative w-full max-w-xs py-4 rounded-xl overflow-hidden transition-all duration-500 shadow-lg font-love"
      :class="{
        'bg-green-500 hover:bg-green-600': localStatus,
        'bg-red-500 hover:bg-red-600': !localStatus,
        'opacity-75 cursor-not-allowed': isPending || !isOwner,
        'cursor-pointer': isOwner && !isPending
      }"
      @click="isOwner && !isPending && showConfirmationDialog()"
      :aria-label="localStatus ? 'Changer statut à indisponible' : 'Changer statut à disponible'"
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
          aria-hidden="true"
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
        <!-- Indicateur de statut -->
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

    <!-- Statistiques de disponibilité -->
    <div v-if="isOwner && showStats" class="hidden w-full max-w-xs bg-white rounded-lg shadow-sm p-4">
      <h3 class="text-sm font-semibold mb-2 text-gray-700">Statistiques de disponibilité</h3>
      
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div class="bg-gray-50 rounded p-2 text-center">
          <div class="text-lg font-bold text-primary">{{ statsData.daysAvailable }}</div>
          <div class="text-xs text-gray-500">Jours disponible</div>
        </div>
        <div class="bg-gray-50 rounded p-2 text-center">
          <div class="text-lg font-bold text-primary">{{ statsData.viewsReceived }}</div>
          <div class="text-xs text-gray-500">Vues reçues</div>
        </div>
      </div>
      
      <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
        <span>Taux de réponse</span>
        <span class="font-semibold">{{ statsData.responseRate }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-1.5 mb-3">
        <div class="bg-primary h-1.5 rounded-full" :style="`width: ${statsData.responseRate}%`"></div>
      </div>
      
      <div class="text-xs text-gray-500 text-center">
        Dernière mise à jour: {{ formatDate(statsData.lastUpdate) }}
      </div>
    </div>

    <!-- Toast de notification -->
    <Transition name="toast">
      <div 
        v-if="showToast"
        class="fixed w-10/12 bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50"
        :class="{
          'bg-green-500': toastType === 'success',
          'bg-red-500': toastType === 'error'
        }"
        role="alert"
      >
        {{ toastMessage }}
      </div>
    </Transition>

    <!-- Popup de confirmation -->
    <Transition name="modal">
      <div 
        v-if="showConfirmation" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
        @click.self="showConfirmation = false"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100">
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-yellow-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900">Confirmation</h3>
            </div>
            
            <p class="text-gray-700 mb-2">
              Cette action va consommer <span class="font-bold text-primary">50 points</span> de disponibilité.
            </p>
            <p class="text-gray-600 text-sm mb-5">
              Votre statut passera à <span class="font-semibold" :class="localStatus ? 'text-red-500' : 'text-green-500'">{{ localStatus ? 'Indisponible' : 'Disponible' }}</span>.
            </p>
            
            <div class="flex justify-end gap-3">
              <button 
                @click="showConfirmation = false" 
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors"
              >
                Annuler
              </button>
              <button 
                @click="confirmToggleStatus" 
                class="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white font-medium transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive, onMounted } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { StorageUtils } from '@/utils/store.utils';

// Interface pour les statistiques
interface StatsData {
  daysAvailable: number;
  viewsReceived: number;
  responseRate: number;
  lastUpdate: Date;
}

// Props
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
  data: {
    type: Object,
    required: false,
    default: () => ({})
  },
  showStats: {
    type: Boolean,
    default: true
  }
});

// Émissions d'événements
const emit = defineEmits(['status-updated']);

// État local
const queryClient = useQueryClient();
const localStatus = ref(props.status === 'disponible');
const showToast = ref(false);
const toastType = ref<'success'|'error'>('success');
const toastMessage = ref('');
const showConfirmation = ref(false);

// Données de statistiques (simulées pour l'instant)
const statsData = reactive<StatsData>({
  daysAvailable: 15,
  viewsReceived: 42,
  responseRate: 85,
  lastUpdate: new Date()
});

// Mutation optimisée pour la mise à jour du statut
const { mutate, isPending } = useMutation({
  mutationFn: async (newStatus: boolean) => {
    try {
      const statusValue = newStatus ? 'disponible' : 'indisponible';
      const profilId = await getProfilId();
      
      if (!profilId) {
        throw new Error('ID de profil non disponible');
      }
      
      const response = await fetch(`${URL_API_ROUTE.NOUNU_UPDATE_STATUS}/${profilId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusValue })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Échec de la mise à jour');
      }
      
      return response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },
  onSuccess: async () => {
    // Fermer le popup de confirmation
    showConfirmation.value = false;
    
    // Inverser le statut local
    localStatus.value = !localStatus.value;
    
    // Afficher la notification de succès
    showNotification('success', 'Statut mis à jour avec succès !');
    
    // Invalider les requêtes pour forcer un rafraîchissement des données
    const profilId = await getProfilId();
    if (profilId) {
      await queryClient.invalidateQueries({
        queryKey: ["ListProfilNounuMe", profilId],
      });
    }
    
    // Émettre l'événement de mise à jour
    emit('status-updated', localStatus.value ? 'disponible' : 'indisponible');
    
    // Mettre à jour les statistiques (simulation)
    updateStats();
  },
  onError: (error:any) => {
    // Fermer le popup de confirmation
    showConfirmation.value = false;
    
    console.error('Erreur de mutation:', error);
    const errorMessage = error instanceof Error && error.message.includes('points')
      ? 'Impossible de changer le statut quand les points sont à 0'
      : 'Une erreur est survenue lors de la mise à jour du statut';
    
    showNotification('error', errorMessage);
  }
});

// Fonction pour récupérer l'ID du profil
const getProfilId = async (): Promise<string | null> => {
  try {
    const profilIdStore = await StorageUtils().getStore("nProfil_1_Id");
    return profilIdStore?.value || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ID du profil:', error);
    return null;
  }
};

// Fonction pour récupérer l'ID de l'utilisateur
const getUserId = async (): Promise<string | null> => {
  try {
    const userIdStore = await StorageUtils().getStore("nUser_Id");
    return userIdStore?.value || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
    return null;
  }
};

// Fonction pour afficher le dialogue de confirmation
const showConfirmationDialog = () => {
  showConfirmation.value = true;
};

// Fonction pour confirmer le changement de statut
const confirmToggleStatus = () => {
  mutate(!localStatus.value);
};

// Fonction pour basculer le statut (maintenant utilisée uniquement via la confirmation)
const toggleStatus = () => {
  showConfirmationDialog();
};

// Fonction pour afficher une notification
const showNotification = (type: 'success'|'error', message: string) => {
  toastType.value = type;
  toastMessage.value = message;
  showToast.value = true;
  
  const timer = setTimeout(() => {
    showToast.value = false;
    clearTimeout(timer);
  }, 3000);
};

// Fonction pour mettre à jour les statistiques (simulation)
const updateStats = () => {
  if (localStatus.value) {
    statsData.daysAvailable++;
  }
  statsData.lastUpdate = new Date();
};

// Fonction pour formater la date
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Synchronisation avec la prop status
watch(() => props.status, (newStatus) => {
  localStatus.value = newStatus === 'disponible';
}, { immediate: true });

// Initialisation des données au montage du composant
onMounted(async () => {
  // Ici, vous pourriez charger les statistiques réelles depuis une API
  // loadStats();
});
</script>

<style scoped>
.font-love {
  font-family: var(--font-love, sans-serif);
}

/* Animation de rotation */
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Animations de vague */
.animate-ripple-green {
  animation: ripple 3s linear infinite;
  background: rgba(16, 185, 129, 0.4);
}

.animate-ripple-red {
  animation: ripple 3s linear infinite;
  background: rgba(239, 68, 68, 0.4);
}

/* Définition des animations */
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

/* Animation pour le toast */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

/* Animation pour les statistiques */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.bg-white {
  animation: fadeIn 0.5s ease-out;
}

/* Animation pour le modal */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
  opacity: 0;
}
</style>