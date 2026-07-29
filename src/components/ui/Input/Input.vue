<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-love font-medium text-gray-700 mb-1.5"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <div
        v-if="$slots.prefix"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      >
        <slot name="prefix" />
      </div>
      
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <div
        v-if="$slots.suffix"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      >
        <slot name="suffix" />
      </div>
    </div>
    
    <p
      v-if="error"
      class="mt-1.5 text-sm text-red-600 font-love"
    >
      {{ error }}
    </p>
    
    <p
      v-else-if="hint"
      class="mt-1.5 text-sm text-gray-500 font-love"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

interface Props {
  id?: string;
  modelValue: string | number;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  placeholder?: string;
  autocomplete?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const slots = useSlots();

const inputClasses = computed(() => {
  const baseClasses = 'w-full font-love text-gray-900 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const stateClasses = props.error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-primary focus:ring-primary/20';

  const disabledClasses = props.disabled
    ? 'bg-gray-100 cursor-not-allowed opacity-60'
    : 'bg-white';

  const paddingClasses = [];
  if (slots.prefix) paddingClasses.push('pl-10');
  if (slots.suffix) paddingClasses.push('pr-10');

  return [
    baseClasses,
    sizeClasses[props.size],
    stateClasses,
    disabledClasses,
    ...paddingClasses,
  ].join(' ');
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};
</script>
