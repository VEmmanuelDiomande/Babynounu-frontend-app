<template>
  <div class="flex flex-col gap-1 w-full relative">
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

    <div class="flex w-full relative">
      <input
        :id="id"
        type="date"
        :value="modelValue"
        @input="onInput"
        :placeholder="placeholder"
        class="w-full text-sm font-semibold border-[1px] rounded-xl h-14 px-4 text-zinc-700 font-love placeholder:text-zinc-500 placeholder:font-love border-zinc-300/70 bg-white/90 font-light outline-none focus:border-2 focus:border-primary"
        :name="name"
        :min="minDate"
        :max="maxDate"
      />
    </div>

    <div class="flex items-center gap-1 text-primary" v-if="info.length">
      <IcIcons :name="'RiInformation2Line'" :size="20" />
      <span class="text-xs font-love font-bold">
        {{ info }}
      </span>
    </div>

    <span
      class="text-red-400 text-sm font-bold font-love mt-1"
      v-if="error?.path == name"
    >
      {{ error?.message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import IcIcons from "../icons/IcIcons.vue";

// Définir les props
const props = defineProps({
  modelValue: {
    type: String, // Format attendu : 'YYYY-MM-DD'
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  LabelSub: {
    type: String,
    default: "",
  },
  info: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  minDate: {
    type: String,
    default: "",
  },
  maxDate: {
    type: String,
    default: "",
  },
  error: {
    type: Object,
    default: () => ({ path: "", message: "" }),
  },
});

// Définir les emits
const emit = defineEmits(["update:modelValue"]);

// Gérer l'événement input
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>