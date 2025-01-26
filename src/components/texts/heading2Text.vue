<template>
  <div class="flex flex-col gap-1">
    <label class="text-base font-anton text-zinc-700 uppercase"
      > {{ title }} </label
    >
    <span class="text-sm font-love text-zinc-500"
      >  {{ desc }}</span
    >
  </div>
</template>

<script lang="ts" setup>
//   import IcIcons from "@/components/icons/IcIcons.vue";

defineProps(["title", 'desc']);
</script>
<style scoped></style>
