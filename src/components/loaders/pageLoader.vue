<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: 'Chargement',
  }
);
</script>

<template>
  <div class="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center">
    <i class="ri ri-loader-4-line ri-spin text-4xl text-primary" aria-hidden="true"></i>
    <p class="font-love text-sm text-gray-500">{{ label }}</p>
  </div>
</template>
