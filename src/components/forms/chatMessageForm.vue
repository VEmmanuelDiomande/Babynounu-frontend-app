<template>
  <div class="chat-form-container font-love">
    <div class="textarea-wrapper">
      <textarea
        :id="'textarea_' + name"
        :name="name"
        :value="modelValue"
        @input="onInputChange"
        :style="{
          height: textAreaHeight + 'px',
        }"
        class="chat-textarea"
        :placeholder="placeholder || 'Entrez votre texte...'"
      ></textarea>
    </div>
    <!-- Message d'erreur -->
    <span
      v-if="error?.path === name && error?.message"
      class="error-message"
    >
      {{ error.message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, watch, nextTick } from "vue";

const props = defineProps({
  label: { type: String, required: false },
  modelValue: { type: String, default: "" },
  name: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  error: { 
    type: Object, 
    default: () => ({ path: "", message: "" }) 
  },
  maxHeight: { type: Number, default: 120 },
  minHeight: { type: Number, default: 45 }
});

const emit = defineEmits(["update:modelValue", "input"]);

const textAreaHeight = ref(props.minHeight);

// Fonction pour redimensionner le textarea
const resizeTextarea = async () => {
  const textarea = document.getElementById(
    "textarea_" + props.name
  ) as HTMLTextAreaElement | null;
  
  if (textarea) {
    // Réinitialiser la hauteur à la valeur minimale
    textarea.style.height = props.minHeight + "px";
    
    // Attendre que le DOM soit mis à jour
    await nextTick();
    
    // Calculer la nouvelle hauteur en fonction du contenu
    const scrollHeight = textarea.scrollHeight;
    
    // Limiter la hauteur maximale
    if (scrollHeight >= props.maxHeight) {
      textAreaHeight.value = props.maxHeight;
    } else {
      textAreaHeight.value = Math.max(scrollHeight, props.minHeight);
    }
  }
};

// Gérer les changements d'entrée
const onInputChange = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  const value = textarea.value;
  
  // Émettre l'événement pour mettre à jour le modèle
  emit("update:modelValue", value);
  emit("input", event);
  
  // Redimensionner après la mise à jour
  resizeTextarea();
};

// Observer les changements de modelValue pour redimensionner
watch(() => props.modelValue, () => {
  nextTick(resizeTextarea);
});

// Ajuster la hauteur au premier montage
onMounted(() => {
  // Supprimer la valeur par défaut incorrecte
  resizeTextarea();
});
</script>

<style scoped>
.chat-form-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  position: relative;
}

.textarea-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.chat-textarea {
  width: 100%;
  overflow-y: auto;
  border: 1px solid rgba(229, 231, 235, 0.7);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: #374151;
  font-family: inherit;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  outline: none;
  resize: none;
  transition: border 0.2s ease, height 0.2s ease;
}

.chat-textarea:focus {
  border: 2px solid var(--ion-color-primary);
}

.chat-textarea::placeholder {
  color: #9CA3AF;
  font-family: inherit;
}

.error-message {
  color: #EF4444;
  font-size: 0.875rem;
  font-weight: bold;
  margin-top: 0.25rem;
}

/* Masquer la barre de défilement tout en permettant le défilement */
.chat-textarea::-webkit-scrollbar {
  display: none;
}

.chat-textarea {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>