<script setup lang="ts">
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";

defineProps(["name", "size", "custom", "classCustom"]);
</script>
<template>
  <div  class="flex justify-center items-center  w-full h-[20em]">
    <div class=" inset-0  flex justify-center items-center z-50">
    <SpinnerLoader custom="h-16 w-16 " />
  </div>
  </div>
</template>
<style scoped></style>
