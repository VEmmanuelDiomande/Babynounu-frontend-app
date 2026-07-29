<template>
  <div
    :class="[
      'relative inline-flex items-center justify-center overflow-hidden bg-gray-200 font-love',
      sizeClasses[size],
      rounded ? 'rounded-full' : 'rounded-xl',
      className
    ]"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="h-full w-full object-cover"
      @error="handleImageError"
    />
    <span
      v-else
      :class="[
        'font-semibold text-gray-600',
        textSizeClasses[size]
      ]"
    >
      {{ initials }}
    </span>
    
    <div
      v-if="status"
      :class="[
        'absolute bottom-0 right-0 rounded-full border-2 border-white',
        statusSizeClasses[size],
        statusColorClasses[status]
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  rounded?: boolean;
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  name: '',
  size: 'md',
  rounded: true,
  className: '',
});

const imageError = ref(false);

const initials = computed(() => {
  if (!props.name) return '?';
  const names = props.name.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return names[0][0].toUpperCase();
});

const sizeClasses = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
  '2xl': 'h-20 w-20',
};

const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

const statusSizeClasses = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4',
  '2xl': 'h-5 w-5',
};

const statusColorClasses = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
};

const handleImageError = () => {
  imageError.value = true;
};
</script>
