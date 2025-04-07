<template>
  <div class="flex flex-col gap-2 font-love relative" ref="container">
    <div class="flex flex-col gap-1 w-full">
      <label
        class="text-label font-love font-semibold text-zinc-800 rounded-md "
        :for="'id_input_' + name"
      >
        {{ label }}
      </label>
      <span class="text-sm font-love font-normal text-zinc-500" v-if="LabelSub">
        {{ LabelSub }}
      </span>
    </div>

    <!-- Champ personnalisé pour les tags -->
    <div
      class="w-full border border-zinc-300  rounded-lg px-4 py-2 text-zinc-700 focus-within:border-primary focus-within:ring-primary outline-none text-sm font-semibold flex flex-wrap gap-2"
      @click="toggleDropdown"
    >
      <!-- Tags sélectionnés -->
      <div
        v-for="(tag, index) in selectedTags"
        :key="index"
        class="flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
      >
        <span>{{ tag[optionName] }}</span>
        <button
          type="button"
          @click.stop="removeTag(index)"
          class="text-primary hover:text-primary/70 focus:outline-none"
        >
          &times;
        </button>
      </div>

      <!-- Champ de saisie pour ajouter de nouveaux tags -->
      <input
        type="text"
        class="flex-grow py-2 outline-none bg-transparent"
        placeholder="Sélectionnez une option"
        v-model="searchQuery"
        @input="onInput"
        @keydown.enter="addTag"
        @keydown.backspace="handleBackspace"
        ref="input"
      />
    </div>

    <!-- Liste déroulante des options (flottante) -->
    <div
  v-if="isOpen && filteredOptions?.length > 0"
  class="absolute left-0 mt-1 w-full border border-zinc-300 bg-white rounded-lg shadow-lg max-h-52 overflow-y-auto z-50"
  :style="dropdownStyle"
>
      <div
        v-for="option in filteredOptions"
        :key="option[optionName]"
        class="px-4 py-2 hover:bg-zinc-100 cursor-pointer bg-white z-50"
        @click="selectOption(option)"
      >
        {{ option[optionName] }}
      </div>
    </div>

    <!-- Message d'erreur -->
    <span
      class="text-red-400 text-sm font-bold font-love mt-1"
      v-if="error?.path === name"
    >
      {{ error.message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, onMounted, onUnmounted } from "vue";

interface Option {
  [key: string]: any;
}

const props = defineProps({
  label: { type: String, required: true },
  LabelSub: { type: String, default: "" },
  optionName: { type: String, required: true },
  name: { type: String, required: true },
  modelValue: { type: Array as () => any[], default: () => [] }, // Tableau de tags sélectionnés
  error: { type: Object as () => { path: string; message: string } | null, default: null },
  options: {
    type: Array as () => Option[],
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const searchQuery = ref(""); // Requête de recherche
const input = ref<HTMLInputElement | null>(null); // Référence au champ de saisie
const isOpen = ref(false); // État de la liste déroulante
const container = ref<HTMLElement | null>(null); // Référence au conteneur du composant

// Tags sélectionnés
const selectedTags = computed(() => props.modelValue);

// Options filtrées en fonction de la recherche
const filteredOptions = computed(() => {
  return props.options?.filter(
    (option) =>
      !selectedTags.value.some((tag) => tag[props.optionName] === option[props.optionName]) &&
      option[props.optionName].toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Calculer le style de la liste déroulante
const dropdownStyle = computed(() => {
  if (!container.value) return {};
  const rect = container.value.getBoundingClientRect();
  return {
    top: `${rect.height + 4}px`, // Ajout d'un petit espace
    left: "0",
    width: `${rect.width}px`,
  };
});

// Ouvrir/fermer la liste déroulante
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Fermer la liste déroulante lors d'un clic à l'extérieur
const handleClickOutside = (event: MouseEvent) => {
  if (container.value && !container.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

// Ajouter un tag
const addTag = () => {
  const option = filteredOptions.value?.find(
    (opt) => opt[props.optionName].toLowerCase() === searchQuery.value.toLowerCase()
  );
  if (option) {
    const newTags = [...selectedTags.value, option];
    emit("update:modelValue", newTags);
    searchQuery.value = "";
  }
};

// Supprimer un tag
const removeTag = (index: number) => {
  const newTags = selectedTags.value.filter((_, i) => i !== index);
  emit("update:modelValue", newTags);
};

// Sélectionner une option dans la liste déroulante
const selectOption = (option: Option) => {
  const newTags = [...selectedTags.value, option];
  emit("update:modelValue", newTags);
  searchQuery.value = "";
  isOpen.value = false; // Fermer la liste déroulante après sélection
  focusInput();
};

// Gérer la touche Backspace
const handleBackspace = () => {
  if (searchQuery.value === "" && selectedTags.value.length > 0) {
    removeTag(selectedTags.value.length - 1);
  }
};

// Focus sur le champ de saisie
const focusInput = () => {
  input.value?.focus();
};

// Gérer l'input
const onInput = () => {
  isOpen.value = true; // Ouvrir la liste déroulante lors de la saisie
};

// Ajouter un écouteur d'événements pour les clics à l'extérieur
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

// Nettoyer l'écouteur d'événements
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.focus-within\:border-primary:focus-within {
  border-color: #6366f1;
}
</style>