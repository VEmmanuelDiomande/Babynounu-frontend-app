<template>
  <div class="flex flex-col gap-2 z-50 font-love">
    <div class="flex flex-col gap-1 w-full">
      <label
        class="text-label font-love font-semibold text-zinc-800 rounded-md z-50"
        :for="'id_input_' + name"
      >
        {{ label }}
      </label>
      <span class="text-sm font-love font-normal text-zinc-500" v-if="LabelSub">
        {{ LabelSub }}
      </span>
    </div>

    <select
      class="w-full border border-zinc-300 bg-white rounded-lg px-4 py-4 text-zinc-700 focus:border-primary focus:ring-primary outline-none text-sm font-semibold"
      :id="'input_select_' + name"
      :name="name"
      :value="selectedValue"
      @change="onSelectChange"
    >
      <option disabled value="">Sélectionnez une option</option>
      <option
        v-for="option in options"
        :key="option[optionName]"
        :value="option[optionName]"
      >
        {{ option[optionName] }}
      </option>
    </select>

    <!-- Error -->
    <span
      class="text-red-400 text-sm font-bold font-love mt-1"
      v-if="error?.path === name"
    >
      {{ error.message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";

interface Option {
  [key: string]: any;
}

const props = defineProps({
  label: { type: String, required: true },
  LabelSub: { type: String, default: "" },
  optionName: { type: String, required: true },
  name: { type: String, required: true },
  modelValue: { type: [], default: () => [] }, // Accepte un tableau, une chaîne ou un nombre
  error: { type: Object as () => { path: string; message: string } | null, default: null },
  options: {
    type: Array as () => Option[],
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

// Valeur sélectionnée dans le <select>
const selectedValue = computed(() => {
  if (!props.options || !props.modelValue) return "";

  // Si modelValue est un tableau (cas actuel)
  if (Array.isArray(props.modelValue)) {
    const selectedOption = props.options.find(
      (option) => option[props.optionName] === props.modelValue[0]?.[props.optionName]
    );
    return selectedOption ? selectedOption[props.optionName] : "";
  }

  // Si modelValue est une chaîne ou un nombre (nouveau cas)
  const selectedOption = props.options.find(
    (option) => option[props.optionName] === props.modelValue
  );
  return selectedOption ? selectedOption[props.optionName] : "";
});

// Gestion du changement de sélection
const onSelectChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const selectedOptionValue = target.value;

  // Trouver l'option correspondante
  const selectedOption = props.options.find(
    (option) => option[props.optionName] === selectedOptionValue
  );

  // Émettre la valeur mise à jour
  if (selectedOption) {
    if (Array.isArray(props.modelValue)) {
      // Si modelValue est un tableau, émettre un tableau contenant l'option sélectionnée
      emit("update:modelValue", [selectedOption]);
    } else {
      // Sinon, émettre la valeur simple (chaîne ou nombre)
      emit("update:modelValue", selectedOption[props.optionName]);
    }
  } else {
    // Si aucune option n'est sélectionnée, émettre un tableau vide ou une valeur vide
    emit("update:modelValue", Array.isArray(props.modelValue) ? [] : "");
  }
};
</script>

<style scoped>
.focus\:border-primary:focus {
  border-color: #6366f1;
}
</style>