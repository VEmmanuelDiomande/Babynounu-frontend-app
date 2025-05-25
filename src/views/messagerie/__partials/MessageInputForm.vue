<template>
  <div class="flex items-center gap-2 bg-[#f5f5f5] rounded-full p-2 px-3">
    <!-- Zone de saisie du message avec auto-ajustement -->
    <textarea
      ref="textareaRef"
      v-model="localMessage"
      @input="onInput"
      @keyup.enter="handleSend"
      class="flex-1 bg-transparent border-none outline-none py-2 px-0 text-[15px] resize-none"
      :class="{
        ' overflow-hidden': localMessage.length < MAX_HEIGHT,
        'overflow-y-auto': localMessage.length >= MAX_HEIGHT,
      }"
      placeholder="Écrivez votre message..."
      :style="{ height: textareaHeight + 'px' }"
    ></textarea>

    <!-- Bouton d'envoi -->
    <button
      class="w-10 h-10 rounded-full flex items-center justify-center border-none transition-all"
      :class="{
        'bg-primary text-white': localMessage.trim(),
        'bg-[#ccc] opacity-50': !localMessage.trim(),
      }"
      @click="handleSend"
      :disabled="!localMessage.trim()"
    >
      <IcIcons name="RiSendPlaneFill" :size="24" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import IcIcons from "@/components/icons/IcIcons.vue";

// Définition des props
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

// Définition des événements émis
const emit = defineEmits(["update:modelValue", "input", "send"]);

// Variables réactives
const localMessage = ref(props.modelValue);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const BASE_HEIGHT = 40; // Hauteur initiale
const MAX_HEIGHT = 150; // Hauteur maximale
const CHARACTERS_PER_HEIGHT_INCREASE = 80; // Nombre de caractères pour augmenter la hauteur
const HEIGHT_INCREASE_AMOUNT = 20; // Montant d'augmentation de hauteur en pixels

// Calculer la hauteur en fonction de la longueur du texte
const textareaHeight = computed(() => {
  const textLength = localMessage.value.length;
  const additionalHeight =
    Math.floor(textLength / CHARACTERS_PER_HEIGHT_INCREASE) *
    HEIGHT_INCREASE_AMOUNT;
  return Math.min(BASE_HEIGHT + additionalHeight, MAX_HEIGHT);
});

// Observer les changements de la prop modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    localMessage.value = newValue;
  }
);

// Gérer l'événement input
const onInput = (event: Event) => {
  const value = (event.target as HTMLTextAreaElement).value;
  localMessage.value = value;
  emit("update:modelValue", value);
  emit("input", event);
};

// Méthode pour gérer l'envoi du message
const handleSend = () => {
  if (!localMessage.value.trim()) return;
  emit("send");

  // Réinitialiser le message après l'envoi
  localMessage.value = "";
  emit("update:modelValue", "");
};

// Initialisation
onMounted(() => {
  // Rien à faire ici car la hauteur est calculée automatiquement via computed
});
</script>

<style scoped>
/* Animation pour le bouton d'envoi */
.bg-primary {
  transition: all 0.2s ease-in-out;
}

.bg-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Styles pour le textarea */
textarea {
  font-family: inherit;
  line-height: 1.5;
  transition: height 0.2s ease;
}

textarea::placeholder {
  color: #9ca3af;
}

/* Masquer la barre de défilement */
textarea::-webkit-scrollbar {
  display: none;
}

textarea {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
