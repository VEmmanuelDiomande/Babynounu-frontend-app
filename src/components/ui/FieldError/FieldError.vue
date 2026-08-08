<template>
  <Transition name="field-error">
    <p
      v-if="message"
      class="flex items-center gap-1.5 mt-1.5 font-love text-xs text-red-500"
    >
      <i class="ri ri-error-warning-line" style="font-size: 12px;"></i>
      {{ message }}
    </p>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  message?: string | null;
}>();
</script>

<style scoped>
.field-error-enter-active,
.field-error-leave-active {
  transition: all 0.2s ease;
}
.field-error-enter-from,
.field-error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
