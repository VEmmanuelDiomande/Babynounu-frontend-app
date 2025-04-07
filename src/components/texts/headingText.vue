<script setup lang="ts" >
defineProps(['text', 'size', 'font', 'custom']);
</script>

<template>
   <p class="mb-8"
      :class="[
         'font-anton',
         size == 'small'
            ? 'text-base'
            : size == 'basic'
            ? 'text-lg'
            : size == 'medium'
            ? 'text-xl'
            : size == 'big'
            ? 'text-2xl'
            : '',
         font,
         custom,
      ]"
   >
      {{ text }}
   </p>
</template>

<style scoped></style>
