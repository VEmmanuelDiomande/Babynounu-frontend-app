template

<template>
  <div
    class="flex flex-col font-love h-12 min-w-24 max-w-64 px-4 bg-zinc-100 rounded-xl items-center justify-center"
  >
    <span class="text-sm"> {{ data.name }} </span>
    <span class="text-sm text-start font-bold"> {{ data.price }} CFA </span>
  </div>
</template>

<script lang="ts" setup>
//   import IcIcons from "@/components/icons/IcIcons.vue";
defineProps(["Type", "data"]);
</script>
<style scoped></style>
