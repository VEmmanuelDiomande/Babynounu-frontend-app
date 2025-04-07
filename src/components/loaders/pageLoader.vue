<script setup lang="ts">
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";

defineProps(["name", "size", "custom", "classCustom"]);
</script>
<template>
  <div :class="classCustom ? classCustom : 'w-screen h-screen'" class="flex justify-center items-center">
    <div class=" inset-0  flex justify-center items-center z-50">
    <SpinnerLoader custom="h-16 w-16 absolute" />
  </div>
  </div>
</template>
<style scoped></style>
