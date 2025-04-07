<template>
      <div class="flex flex-col gap-2 z-50 font-love">
    

    <div class="flex flex-col gap-1 w-full">
      <label
        class="text-label font-love font-semibold text-zinc-800 rounded-md z-50"
        :for="'id_input_' + name"
        >{{ label }}</label
      >
      <span class="text-sm font-love font-normal text-zinc-500" v-if="LabelSub">
        {{ LabelSub }}
      </span>
    </div>
      <input
        :id="id"
        ref="inputRef"
        type="text"
        :name="name"
        :value="displayValue"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        :placeholder="'Entrez le montant en ' + props.currency"
       class="w-full border-[1px] rounded-xl h-14 px-4 text-zinc-700 font-love placeholder:text-zinc-500 placeholder:font-love text-base border-zinc-300/70 bg-white/90  font-ligth outline-none focus:border-2 focus:border-primary"
      />
      <div >
        <span
      class="text-red-400 text-sm font-bold font-love mt-1"
      v-if="error?.path == name"
    >
      {{ error?.message }}
    </span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, watch, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD'
    },
    locale: {
      type: String,
      default: 'en-US'
    },
    precision: {
      type: Number,
      default: 0
    },
    error: {
      type: Object,
      default: {path: '', message: ''}
    },
    id: String,
    label: String,
    placeholder: String,
    name: String,
    LabelSub: String
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const inputRef = ref<HTMLInputElement | null>(null);
  const isFocused = ref(false);
  
  // Formatter configuration
  const formatter = computed(() => new Intl.NumberFormat(props.locale, {
    style: 'currency',
    currency: props.currency,
    minimumFractionDigits: props.precision,
    maximumFractionDigits: props.precision
  }));
  
  // Get decimal separator for current locale
  const decimalSeparator = computed(() => {
    return formatter.value.formatToParts(1.1)
      .find(part => part.type === 'decimal')?.value || '.'
  });
  
  // Display value management
  const displayValue = computed(() => {
    return isFocused.value 
      ? props.modelValue
      : formatter.value.format(props.modelValue);
  });
  
  // Input handling
  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value;
    
    // Remove all non-numeric characters except decimal separator
    const cleanedValue = rawValue
      .replace(new RegExp(`[^0-9${decimalSeparator.value}]`, 'g'), '')
      .replace(new RegExp(`\\${decimalSeparator.value}`, 'g'), '.');
  
    const newValue = parseFloat(cleanedValue) || 0;
    emit('update:modelValue', newValue.toString());
  };
  
  // Focus/blur handlers
  const onFocus = () => {
    isFocused.value = true;
  };
  
  const onBlur = () => {
    isFocused.value = false;
  };
  </script>
  
  <style scoped>
  
  </style>