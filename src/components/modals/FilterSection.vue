<template>
  <div class="filter-section">
 
    <div v-for="(option, index) in options" :key="index" :class="{ 'z-50': index === 0 }">
      <SelectTagForm
        :label="option.label"
        :optionName="option.optionName"
        :options="option.options"
        :name="option.name"
        v-model="option.modelValue"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectTagForm from "../forms/selectTagForm.vue";

const props = defineProps({
  options: {
    type: Array<any>,
    required: true
  },
  dataLocalizations: {
    type: Object,
    default: () => ({})
  },
  searchPreferences: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:searchPreferences']);

// Fonction pour obtenir et mettre à jour les valeurs du modèle
const getModelValue = (option:any) => ({
  get: () => {
    return option.modelValue;
  },
  set: (newValue:any) => {
    // Mettre à jour la valeur dans searchPreferences
    props.searchPreferences[option.name] = newValue;
    // Émettre l'événement pour informer le parent
    emit('update:searchPreferences', props.searchPreferences);
  }
});
</script>

<style scoped>
.filter-section > div {
  margin-bottom: 1rem;
}
</style>