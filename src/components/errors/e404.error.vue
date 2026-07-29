<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    message?: string;
  }>(),
  {
    title: 'Contenu introuvable',
    message: "L'element demande n'est pas disponible.",
  }
);
</script>

<template>
  <div class="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
    <i class="ri ri-search-line mb-4 text-6xl text-gray-300" aria-hidden="true"></i>
    <h2 class="font-anton text-2xl text-gray-900">{{ title }}</h2>
    <p class="mt-2 font-love text-sm text-gray-500">{{ message }}</p>
  </div>
</template>
