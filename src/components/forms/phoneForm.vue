<template>
  <div class="flex flex-col gap-2 w-full relative font-love">
    <!-- En-tête du champ -->
    <div class="flex flex-col gap-1 w-full">
      <label
        class="text-label font-love font-semibold text-zinc-800 rounded-md z-50"
        :for="'id_input_' + name"
      >
        {{ label }}
      </label>
    </div>
    
    <!-- Conteneur pour le préfixe et le champ de téléphone -->
    <div class="flex w-full">
      <!-- Sélecteur de préfixe de pays -->
      <div class="relative">
        <select
          v-model="selectedCountry"
          class="h-14 border-[1px] border-r-0 rounded-l-xl px-2 text-zinc-700 font-love bg-white/90 outline-none focus:border-2 focus:border-primary"
          @change="updatePhoneWithPrefix"
        >
          <option v-for="country in countries" :key="country.code" :value="country">
            {{ country.flag }} {{ country.code }}
          </option>
        </select>
      </div>
      
      <!-- Champ de saisie du numéro -->
      <input
        :id="id"
        type="tel"
        :value="phoneWithoutPrefix"
        @input="onInput"
        @blur="onBlur"
        class="flex-1 border-[1px] border-l-0 rounded-r-xl h-14 px-4 text-zinc-700 font-love placeholder:text-zinc-500 placeholder:font-normal text-base border-zinc-300/70 bg-white/90 font-light outline-none focus:border-2 focus:border-primary"
        :placeholder="placeholder"
        :class="{ 'is-invalid': error }"
      />
    </div>

    <!-- Message d'erreur -->
    <span
      class="text-red-400 text-sm font-bold mt-1"
      v-if="error?.path === name"
    >
      {{ error?.message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';

// Interface pour les pays
interface Country {
  name: string;
  code: string;
  prefix: string;
  flag: string;
  region: string;
}

// Définition des pays d'Afrique de l'Ouest
const countries = ref<Country[]>([
  { name: 'Burkina Faso', code: 'BF', prefix: '+226', flag: '🇧🇫', region: 'West Africa' },
  { name: 'Mali', code: 'ML', prefix: '+223', flag: '🇲🇱', region: 'West Africa' },
  { name: 'Côte d\'Ivoire', code: 'CI', prefix: '+225', flag: '🇨🇮', region: 'West Africa' },
  { name: 'Sénégal', code: 'SN', prefix: '+221', flag: '🇸🇳', region: 'West Africa' },
]);

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
    default: 'Entrez votre numéro',
  },
  error: {
    type: Object,
    default: () => ({ path: '', message: '' }),
  },
  defaultCountry: {
    type: String,
    default: 'CI', // Côte d'Ivoire par défaut
  },
});

// Définir les emits
const emit = defineEmits(['update:modelValue']);

// Pays sélectionné
const selectedCountry = ref(countries.value.find(c => c.code === props.defaultCountry) || countries.value[0]);

// Détecter le pays à partir du numéro de téléphone
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // Si le numéro commence par un préfixe connu, sélectionner le pays correspondant
    for (const country of countries.value) {
      if (newValue.startsWith(country.prefix)) {
        selectedCountry.value = country;
        break;
      }
    }
  }
}, { immediate: true });

// Numéro de téléphone sans le préfixe (pour l'affichage dans l'input)
const phoneWithoutPrefix = computed(() => {
  if (!props.modelValue) return '';
  
  // Supprimer le préfixe du pays s'il est présent
  if (props.modelValue.startsWith(selectedCountry.value.prefix)) {
    return props.modelValue.substring(selectedCountry.value.prefix.length);
  }
  
  return props.modelValue;
});

// Formater le numéro de téléphone en temps réel
const formattedPhoneNumber = computed(() => {
  const phoneNumber = parsePhoneNumberFromString(props.modelValue, selectedCountry.value.code as any);
  return phoneNumber ? phoneNumber.formatInternational() : props.modelValue;
});

// Mettre à jour le numéro avec le nouveau préfixe lors du changement de pays
const updatePhoneWithPrefix = () => {
  const phoneWithoutPrefix = props.modelValue.replace(/^\+\d+/, '');
  emit('update:modelValue', selectedCountry.value.prefix + phoneWithoutPrefix);
};

type CountryCode = 'BF' | 'ML' | 'CI' | 'SN';

// Gérer l'événement input
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const rawInput = target.value.replace(/\D/g, ''); // Garder uniquement les chiffres
  
  // Utiliser AsYouType avec le code du pays sélectionné
  const asYouType = new AsYouType(selectedCountry.value.code as CountryCode);
  asYouType.input(rawInput);
  
  // Émettre le numéro complet avec le préfixe
  emit('update:modelValue', selectedCountry.value.prefix + rawInput);
};

// Valider le numéro de téléphone lors du blur
const onBlur = () => {
  if (!props.modelValue) return;
  
  const phoneNumber = parsePhoneNumberFromString(
    props.modelValue,
selectedCountry.value.code as CountryCode
  );
  
  if (!phoneNumber || !phoneNumber.isValid()) {
    // Option 1: Réinitialiser si le numéro est invalide
    // emit('update:modelValue', '');
    
    // Option 2: Conserver le numéro même s'il est invalide (pour permettre une correction)
    // Ne rien faire
  }
};
</script>

<style scoped>
/* Correction de la faute d'orthographe */
.font-light {
  font-weight: 300;
}

/* Style pour le sélecteur de pays */
select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;
  padding-right: 2rem;
}

/* Animation de focus */
input:focus, select:focus {
  transition: all 0.2s ease-in-out;
}
</style>
