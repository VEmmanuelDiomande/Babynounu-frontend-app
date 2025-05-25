<template>
  <div class="flex justify-between p-2 gap-4 items-center">
    <span class="text-sm">
      Démarrez une nouvelle mission, faites des propositions.
    </span>
    <button
      @click="toggleModal"
      :disabled="currentStatus === 'Accepted'"
      class="flex items-center gap-1 bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:shadow-md"
      :class="{ 'opacity-50 cursor-not-allowed': currentStatus === 'Accepted' }"
    >
      <IcIcons name="RiContractLine" :size="20" />
      <span>Proposition</span>
    </button>
  </div>

  <!-- Modal de proposition -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="openModal"
        class="fixed inset-0 h-screen font-love flex items-center justify-center bg-black/50 z-50"
        @click.self="closeModal"
      >
        <IonCard class="font-love max-w-md w-full mx-4 animate-slide-up">
          <IonCardHeader>
            <IonCardTitle class="font-bold text-lg">
              Faire une proposition
            </IonCardTitle>
            <ion-card-subtitle>
              <span>
                Faites une proposition pour une mission et une durée bien précise.
              </span>
            </ion-card-subtitle>
          </IonCardHeader>

          <IonCardContent>
            <form @submit.prevent="submitForm" class="space-y-4">
              <!-- Champ de prix -->
              <InputCurrencyForm
                label="Budget"
                labelSub="Entrez un montant exact pour cette mission."
                currency="XOF"
                locale="fr-FR"
                v-model="formData.price"
                :error="errors"
              />

              <!-- Champ de durée -->
              <div class="flex gap-2">
                <div class="flex-1">
                  <InputForm
                    label="Durée"
                    type="number"
                    labelSub="Indiquez la durée souhaitée pour cette mission."
                    name="duration"
                    placeholder="Ex: 45"
                    v-model="formData.duration"
                    :error="errors"
                  />
                </div>
                <div class="w-1/3 self-end pb-1">
                  <select
                    v-model="formData.durationUnit"
                    class="w-full p-3 rounded-lg border border-gray-300 bg-white focus:border-primary focus:outline-none"
                  >
                    <option value="heures">Heures</option>
                    <option value="jours">Jours</option>
                    <option value="semaines">Semaines</option>
                    <option value="mois">Mois</option>
                  </select>
                </div>
              </div>

              <!-- Champ de description -->
              <div>
                <TextareaAjustForm
                  label="Description"
                  labelSub="Décrivez les détails de votre proposition."
                  v-model="formData.comment"
                  :_textAreaHeight="100"
                  :error="errors"
                />
              </div>
            </form>
          </IonCardContent>

          <!-- Boutons d'action -->
          <div class="flex justify-end p-4 gap-2">
            <ion-button
              @click="closeModal"
              class="text-red-500 font-love"
              fill="clear"
            >
              Annuler
            </ion-button>
            <ion-button
              @click="submitForm"
              :disabled="!isFormValid || isLoading"
              class="font-love"
              :color="isFormValid ? 'secondary' : 'medium'"
            >
              <span v-if="!isLoading">Valider</span>
              <ion-spinner v-else name="crescent" />
            </ion-button>
          </div>
        </IonCard>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from "vue";
import { Toast } from "@capacitor/toast";
import moment from "moment";

// Composants
import InputCurrencyForm from "@/components/forms/inputCurrencyForm.vue";
import InputForm from "@/components/forms/inputForm.vue";
import TextareaAjustForm from "@/components/forms/textareaAjustForm.vue";
import IcIcons from "@/components/icons/IcIcons.vue";

// Services
import { SocketService } from "@/services/socket.services";
import { StorageUtils } from "@/utils/store.utils";
import { useNotificationStore } from "@/stores/notificationStore";

// Ionic components
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonSpinner
} from "@ionic/vue";

// Props
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  activeConversation: {
    type: [String, Number],
    required: true
  },
  isStatus: {
    type: String,
    default: "Pending"
  }
});

// État local
const socketService = ref(new SocketService());
const isLoading = ref(false);
const openModal = ref(false);
const notificationStore = useNotificationStore();
const currentStatus = ref(props.isStatus);

// Surveiller les changements de la prop isStatus
watch(() => props.isStatus, (newStatus) => {
  currentStatus.value = newStatus;
}, { immediate: true });

// Données du formulaire
const formData = reactive({
  price: 0,
  duration: 0,
  comment: "",
  durationUnit: "jours"
});

// Gestion des erreurs
const errors = reactive({
  path: "",
  message: ""
});

// Computed properties
const isFormValid = computed(() => {
  return formData.price > 0 && formData.duration > 0;
});

// Méthodes
const toggleModal = () => {
  if (currentStatus.value !== 'Accepted') {
    openModal.value = !openModal.value;
  }
};

const closeModal = () => {
  openModal.value = false;
  resetForm();
};

const resetForm = () => {
  formData.price = 0;
  formData.duration = 0;
  formData.comment = "";
  formData.durationUnit = "jours";
  
  // Réinitialiser les erreurs
  errors.message = "";
  errors.path = "";
};

const validateForm = () => {
  let isValid = true;
  
  // Validation du prix
  if (formData.price <= 0) {
    errors.path = "price";
    errors.message = "Veuillez entrer un montant valide";
    isValid = false;
  } else {
    errors.path = "price";
    errors.message = "";
  }
  
  // Validation de la durée
  if (formData.duration <= 0) {
    errors.path = "duration";
    errors.message = "Veuillez entrer une durée valide";
    isValid = false;
  } else {
    errors.path = "duration";
    errors.message = "";
  }
  
  return isValid;
};

const sendMessage = () => {
  if (!props.activeConversation || !socketService.value) return;

  socketService.value.emit("sendMessage", {
    roomId: props.activeConversation,
    content: JSON.stringify(formData),
    isProposition: true,
    type: 'Proposition',
    propositionExpired: moment().add(2, 'days'),
  });
};

const submitForm = async () => {
  if (!validateForm()) return;
  
  isLoading.value = true;
  
  try {
    // Envoyer le message
    sendMessage();
    
    // Notifier l'utilisateur
    await Toast.show({
      text: "Proposition envoyée avec succès",
      duration: "long",
    });

    // Envoyer une notification
    const userId = (await StorageUtils().getStore("nUser_Id")).value;
    socketService.value.emit("getNotifications", { userId });

    // Fermer le modal et réinitialiser
    closeModal();
  } catch (error) {
    console.error("Erreur lors de l'envoi de la proposition:", error);
    
    await Toast.show({
      text: "Une erreur est survenue lors de l'envoi de la proposition",
      duration: "long",
    });
  } finally {
    isLoading.value = false;
  }
};

// Initialisation
onMounted(() => {
  // Initialiser le service de socket si nécessaire
  if (!socketService.value) {
    socketService.value = new SocketService();
  }
  
  // S'assurer que currentStatus est initialisé avec la valeur actuelle
  currentStatus.value = props.isStatus;
});
</script>

<style scoped>
/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out forwards;
}

/* Styles pour le spinner */
ion-spinner {
  --color: #55c4bd;
}

/* Styles pour les boutons */
button:not(:disabled):hover {
  transform: translateY(-2px);
}

button:not(:disabled):active {
  transform: translateY(0);
}

/* Transition pour les boutons */
button {
  transition: all 0.2s ease;
}
</style>
