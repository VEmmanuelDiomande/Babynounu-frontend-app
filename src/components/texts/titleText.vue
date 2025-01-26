<script lang="ts" setup>
defineProps(['text', 'size', 'font', 'custom']);
</script>

<template>
   <p
   class="flex items-center"
      :class="[
         size == 'small'
            ? 'text-xs'
            : size == 'basic'
            ? 'text-sm'
            : size == 'medium'
            ? 'text-ng'
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
