<script setup lang="ts">
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";

defineProps(["name", "size", "custom", "classCustom"]);
</script>
<template>
  <div class="fixed inset-0 w-screen h-screen flex justify-center items-center z-50">
    <SpinnerLoader custom="h-16 w-16" />
  </div>
</template>
<style scoped></style>
