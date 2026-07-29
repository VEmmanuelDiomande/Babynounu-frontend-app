<template>
  <div
    :class="[
      'rounded-3xl overflow-hidden transition-all duration-300',
      variant === 'elevated' && 'shadow-lg hover:shadow-xl',
      variant === 'outlined' && 'border border-gray-200',
      variant === 'filled' && 'bg-gray-50',
      className
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'elevated' | 'outlined' | 'filled';
  className?: string;
}

withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  className: '',
});
</script>
