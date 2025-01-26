<template>
  <div
    class="flex flex-col border-[1px] rounded-xl p-3 w-[150px] h-[120px] gap-2"
  >
    <div class="">
      <IcIcons :name="Type.icon" :size="20" class="text-zinc-800" />
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-lg font-anton uppercase">{{ Type.name }}</span>
      <span class="text-sm font-love">{{ Type.describe }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IcIcons from "@/components/icons/IcIcons.vue";

defineProps(["Type"]);
</script>
<style scoped></style>
