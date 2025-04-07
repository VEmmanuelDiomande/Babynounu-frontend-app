<template>
  <div class="flex flex-col gap-1 w-full relative font-love">
    <div class="flex flex-col gap-3 w-full">
      <label
        class="text-label font-love font-semibold text-zinc-800 rounded-md z-50"
        :for="'textarea_' + name"
        >{{ label }}</label
      >
      <textarea
        :id="'textarea_' + name" 
        :name="name"
        :value="modelValue"
        @input="onInputChange"
        :style="{
          height: textAreaHeight == 0 ? '300px' : textAreaHeight + 'px',
        }"
        class="w-full border-[1px] rounded-xl h-14 py-4 px-4 text-zinc-700 font-love placeholder:text-zinc-500 placeholder:font-love text-base border-zinc-300/70 bg-white/90  font-ligth outline-none focus:border-2 focus:border-primary"
        placeholder="Entrez votre texte..."
      ></textarea>
    </div>
    <!-- Message d'erreur -->
    <span
      class="text-red-400 text-sm font-bold mt-1"
      v-if="error?.path == name"
    >
      {{ error.message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from "vue";
import { set } from "zod";

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: String, default: "" },
  name: { type: String, default: "" },
  error: { type: Object, default: { path: "", message: "" } },
});

const emit = defineEmits(["update:modelValue"]);

const textAreaHeight = ref(300); // Hauteur initiale

const resizeTextarea = () => {
  const textarea = document.getElementById(
    "textarea_" + props.name
  ) as HTMLTextAreaElement | null;

  if (textarea) {
    textarea.style.height = "300px"; // Réinitialise la hauteur
    textAreaHeight.value = textarea.scrollHeight; // Ajuste à la hauteur du contenu
  } else {
    console.error("Textarea non trouvé :", "textarea_" + props.name);
  }
};

const onInputChange = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  resizeTextarea();
  emit("update:modelValue", textarea.value); // Met à jour le modèle de données
};

// Ajuster la hauteur au premier montage
onMounted(resizeTextarea);
</script>

<style scoped>
/* Styles personnalisés si besoin */
</style>