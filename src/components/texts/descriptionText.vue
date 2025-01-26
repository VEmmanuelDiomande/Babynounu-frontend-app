<script setup>
defineProps(['text', 'size', 'font', 'custom']);
</script>

<template>
   <p
      :class="[
         size == 'small'
            ? 'text-base'
            : size == 'basic'
            ? 'text-lg'
            : size == 'medium'
            ? 'text-xl'
            : size == 'big'
            ? 'text-xl'
            : '',
         font,
         custom,
      ]"
   >
      {{ text }}
   </p>
</template>

<style scoped></style>
