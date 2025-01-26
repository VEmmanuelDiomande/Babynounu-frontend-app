<script setup lang="ts" >
defineProps(["name", "size", "custom", "classCustom"]);
</script>
<template>
  <div
    class="animate-spin inline-block border-[1px] border-current border-t-transparent text-primary rounded-full"
    role="status"
    :class="[
      size == 'small'
        ? 'w-4 h-4'
        : size == 'medium'
        ? 'w-6 h-6'
        : size == 'large'
        ? 'w-8 h-8'
        : custom,
      classCustom,
    ]"
    aria-label="loading"
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>
<style scoped></style>
