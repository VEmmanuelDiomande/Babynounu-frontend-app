<template>
      <div class="flex flex-col gap-1 w-full relative font-love">
    <div class="flex flex-col gap-1 w-full">
      <label
        class="text-label font-love font-semibold text-zinc-800 rounded-md z-50"
        :for="'id_input_' + name"
        >{{ label }}</label
      >
   
    </div>
      <input
        :id="id"
        type="tel"
        :value="formattedPhoneNumber"
        @input="onInput"
        @blur="onBlur"
        class="w-full border-[1px] rounded-xl h-14 px-4 text-zinc-700 font-love placeholder:text-zinc-500 placeholder:font-normal text-base border-zinc-300/70 bg-white/90  font-ligth outline-none focus:border-2 focus:border-primary"
        :placeholder="placeholder"
        :class="{ 'is-invalid': error }"
      />

      <span
      class="text-red-400 text-sm font-bold mt-1"
      v-if="error?.path == name"
    >
      {{ error?.message }}
    </span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
  
  // Définir les props
  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Entrez votre numéro de téléphone',
    },
    error: {
      type: Object,
      default: {path: '', message: ''},
    },
  });
  
  // Définir les emits
  const emit = defineEmits(['update:modelValue']);
  
  // Formater le numéro de téléphone en temps réel
  const formattedPhoneNumber = computed(() => {
    const phoneNumber = parsePhoneNumberFromString(props.modelValue, 'FR'); // 'FR' pour la France
    return phoneNumber ? phoneNumber.formatInternational() : props.modelValue;
  });
  
  // Gérer l'événement input
  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const asYouType = new AsYouType('FR'); // 'FR' pour la France
    asYouType.input(target.value);
    emit('update:modelValue', asYouType.getNumber()?.number || target.value);
  };
  
  // Valider le numéro de téléphone lors du blur
  const onBlur = () => {
    const phoneNumber = parsePhoneNumberFromString(props.modelValue, 'FR');
    if (!phoneNumber || !phoneNumber.isValid()) {
      emit('update:modelValue', ''); // Réinitialiser si le numéro est invalide
    }
  };
  </script>
