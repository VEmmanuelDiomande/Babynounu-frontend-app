<template>
  <div class="flex flex-col w-full gap-1 h-full">
    <div v-for="(item, index) in state.OptionAgency" :key="index">
      <div
        class="inline-flex gap-2 bg-blue-100 rounded-xl p-4 relative w-full h-full"
      >
        <div
          class="bg-blue-200 flex justify-center items-center rounded-lg w-14 h-12"
        >
          <IcIcons :name="item.icon" :size="22" />
        </div>
        <div class="flex flex-col w-11/12">
          <span class="text-ng font-love font-bold">{{ item.name }}</span>
          <span class="text-xs">{{ item.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IcIcons from "@/components/icons/IcIcons.vue";
import { useHomeAgencyHook } from "@/hooks/agencyHooks/homeAgencyHook";
const { state } = useHomeAgencyHook();
</script>
<style scoped></style>
