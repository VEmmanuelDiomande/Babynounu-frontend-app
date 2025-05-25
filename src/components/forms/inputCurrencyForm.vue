<template>
  <div class="flex flex-col gap-2 z-50 font-love">
    <!-- En-tête du champ -->
    <div class="flex flex-col gap-1 w-full">
      <label
        class="text-label font-love font-semibold text-zinc-800 rounded-md z-50"
        :for="'id_input_' + name"
      >
        {{ label }}
      </label>
      <span 
        v-if="LabelSub" 
        class="text-sm font-love font-normal text-zinc-500"
      >
        {{ LabelSub }}
      </span>
    </div>
    
    <!-- Champ de saisie -->
    <input
      :id="id"
      ref="inputRef"
      type="text"
      :name="name"
      :value="displayValue"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      :placeholder="placeholder || 'Entrez le montant en ' + currency"
      class="w-full border-[1px] rounded-xl h-14 px-4 text-zinc-700 font-love placeholder:text-zinc-500 placeholder:font-love text-base border-zinc-300/70 bg-white/90 font-light outline-none focus:border-2 focus:border-primary"
    />
    
    <!-- Message d'erreur -->
    <div v-if="error?.path === name" class="mt-1">
      <span class="text-red-400 text-sm font-bold font-love">
        {{ error?.message }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface ErrorType {
  path: string;
  message: string;
}

// Définition des props avec types appropriés
const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'XOF'
  },
  locale: {
    type: String,
    default: 'fr-FR'
  },
  precision: {
    type: Number,
    default: 0
  },
  error: {
    type: Object as () => ErrorType | null,
    default: null
  },
  id: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  name: {
    type: String
  },
  LabelSub: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

// Références et états
const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);

// Configuration du formateur de devise
const formatter = computed(() => new Intl.NumberFormat(props.locale, {
  style: 'currency',
  currency: props.currency,
  minimumFractionDigits: props.precision,
  maximumFractionDigits: props.precision
}));

// Récupération du séparateur décimal pour la locale actuelle
const decimalSeparator = computed(() => {
  return formatter.value.formatToParts(1.1)
    .find(part => part.type === 'decimal')?.value || '.';
});

// Gestion de l'affichage de la valeur
const displayValue = computed(() => {
  if (isFocused.value) {
    // Afficher la valeur brute pendant la saisie
    return props.modelValue.toString();
  } else {
    // Afficher la valeur formatée lorsque le champ n'est pas en focus
    return formatter.value.format(props.modelValue);
  }
});

// Gestion de la saisie
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const rawValue = target.value;
  
  // Supprimer tous les caractères non numériques sauf le séparateur décimal
  const cleanedValue = rawValue
    .replace(new RegExp(`[^0-9${decimalSeparator.value}]`, 'g'), '')
    .replace(new RegExp(`\\${decimalSeparator.value}`, 'g'), '.');

  // Convertir en nombre et émettre la mise à jour
  const newValue = parseFloat(cleanedValue) || 0;
  emit('update:modelValue', newValue.toString());
};

// Gestionnaires de focus/blur
const onFocus = () => {
  isFocused.value = true;
};

const onBlur = () => {
  isFocused.value = false;
};

// Observer les changements de modelValue pour mettre à jour l'affichage si nécessaire
watch(() => props.modelValue, (newValue) => {
  // Logique supplémentaire si nécessaire lors du changement de valeur
}, { immediate: true });
</script>

<style scoped>
/* Styles spécifiques au composant */
.font-light {
  font-weight: 300;
}

/* Animation de focus */
input:focus {
  transition: all 0.2s ease-in-out;
}
</style>