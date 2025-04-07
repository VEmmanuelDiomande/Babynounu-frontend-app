<template>
  <div class="flex flex-row items-center gap-2 text-sm font-love text-zinc-600">
    <IcIcons v-if="icon" :name="icon" class="text-zinc-600 relative -left-2 -top-1" />
    <div class="flex flex-col gap-1">
    <label class="text-base font-anton text-zinc-700 uppercase"
      > {{ title }} </label
    >
    <span class=""
      >  {{ desc }}</span
    >
  </div>
  </div>
</template>

<script lang="ts" setup>
import IcIcons from '../icons/IcIcons.vue';

//   import IcIcons from "@/components/icons/IcIcons.vue";

defineProps(["title", 'desc', 'icon']);
</script>
<style scoped></style>
