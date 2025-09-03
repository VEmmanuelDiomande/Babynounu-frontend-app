<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-content class="font-love z-50">
      <div class="flex flex-col h-full z-40  bg-white">
        <!-- En-tête du modal -->
        <div class="flex justify-between items-center mb-6 z-40 absolute top-4 left-4 bg-white/5 px-4 py-2">
          <span class="text-ng font-bold text-gray-800 hidden">{{ title }}</span>
          <ion-button id="closeModalToRedirectAuthModal"  fill="clear" @click="closeModal">
            <IcIcons name="RiCloseLine" class="hidden" :size="28" />
          </ion-button>
        </div>

        <SignAuth />
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import {
  IonModal,
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonCheckbox,
  IonSpinner,
} from "@ionic/vue";
import {
  closeOutline,
  eyeOutline,
  eyeOffOutline,
  logoGoogle,
  logoFacebook,
} from "ionicons/icons";
import SignAuth from "@/views/auth/signAuth.vue";
import { useRouter } from "vue-router";
import IcIcons from "../icons/IcIcons.vue";

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Authentification",
  },
});

// Emits
const emit = defineEmits(["update:isOpen", "login", "register"]);

// État local
const activeTab = ref("connexion");
const isLoading = ref(false);
const router = useRouter();

// Méthodes
const closeModal = () => {
  console.log("Fermeture du modal");
  emit("update:isOpen", false);
  // router.push({ name: "STARTER_DESTINATION" });
};
</script>

<style scoped>
.auth-modal {
  --height: auto;
  --width: 100%;
  --max-width: 500px;
  --border-radius: 16px;
  --box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

@media (min-width: 640px) {
  .auth-modal {
    --width: 90%;
  }
}
</style>
