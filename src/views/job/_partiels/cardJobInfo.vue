<template>
  <!-- Informations complémentaires -->
  <div class="grid grid-cols-2 gap-1 mt-2">
    <!-- Informations -->

    <div v-for="info in seedDataInfo">
      <div class="flex items-center gap-1">
        <IcIcons :name="info.icon" class="text-primary" :size="20" />
        <span class="text-[15px] opacity-70 font-semibold truncate w-full ">
          {{ info.name }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import IcIcons from '@/components/icons/IcIcons.vue';

defineProps(["seedDataInfo"]);
</script>
