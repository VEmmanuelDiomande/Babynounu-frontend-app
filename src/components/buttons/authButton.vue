<script lang="ts" setup>
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";
import TitleText from "@/components/texts/titleText.vue";
import IcIcons from "../icons/IcIcons.vue";
import { computed } from "vue";

interface ButtonProps {
  title: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  setcolor?: string;
  actions?: (...args: any[]) => void; // Modification ici pour accepter des paramètres
  id?: string;
  textcolor?: string;
  classCustom?: string;
  icon?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: "button",
  loading: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: "click"): void;
}>();

const handleClick = (...args: any[]) => { // Modification ici pour passer les paramètres
  if (!props.loading && !props.disabled && props.actions) {
    props.actions(...args); // Passage des paramètres à la fonction actions
    emit("click");
  }
};

const buttonClasses = computed(() => [
  "py-4 rounded-xl w-full font-love flex gap-1 justify-center items-center",
  {
    "cursor-pointer": !props.disabled && !props.loading,
    "cursor-not-allowed opacity-50": props.disabled || props.loading,
    [props.setcolor || "bg-primary ring-1 ring-primary"]: true,
    [props.classCustom || ""]: !!props.classCustom,
  },
]);

const textColorClass = computed(() => props.textcolor || "text-white");
</script>

<template>
  <button
    :disabled="disabled || loading"
    :type="type"
    :class="buttonClasses"
    @click="handleClick" 
    :id="id"
    :aria-busy="loading"
    :aria-disabled="disabled"
  >
    <IcIcons
      v-if="icon"
      :name="icon"
      :size="24"
      :class="textColorClass"
      aria-hidden="true"
    />
    <TitleText
      v-show="!loading"
      :text="title"
      size="medium"
      class="font-bold text-center"
      :class="textColorClass"
    />
    <SpinnerLoader
      v-show="loading"
      size="medium"
      :classCustom="textColorClass"
      aria-label="Chargement en cours"
    />
  </button>
</template>

<style scoped>
button {
  transition: opacity 0.2s ease, transform 0.1s ease;
}

button:active:not(:disabled) {
  transform: scale(0.98);
}

button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>