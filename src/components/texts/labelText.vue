<script setup>
defineProps(['text', 'size', 'font', 'custom']);
</script>

<template>
   <p
      :class="[
         size == 'small'
            ? 'text-xs'
            : size == 'basic'
            ? 'text-sm'
            : size == 'medium'
            ? 'text-base'
            : size == 'big'
            ? 'text-lg'
            : '',
         font,
         custom,
      ]"
   >
      {{ text }}
   </p>
</template>

<style scoped></style>
