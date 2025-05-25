<template>
  <div class="flex justify-center font-love items-center w-[100px] h-8 text-xs mt-1 bg-red-500 text-white py-1 px-2 rounded-xl opacity-70 font-medium">
    <IcIcons name="RiAlarmWarningLine" :size="16" class="mr-1" />
    <span class="text-xs font-bold">Urgent</span>
  </div>
</template>

<script setup lang="ts">
import IcIcons from "@/components/icons/IcIcons.vue";
</script>

<style scoped>
.bg-red-500 {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}
</style>