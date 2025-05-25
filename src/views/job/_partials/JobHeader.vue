<template>
  <div class="bg-white px-4 pb-6 animate-fade-in rounded-lg shadow-sm">
    <span class="text-2xl font-bold text-gray-900 mb-2 block pt-4">
      {{ job.titre }}
    </span>
    <div class="flex items-center gap-2 text-gray-600 mt-8 mb-4">
      <IcIcons name="RiBriefcaseFill" class="text-primary" />
      <span>{{ job.preferences?.frequence_des_services[0]?.name }}</span>
    </div>
    <div class="flex items-center gap-2 text-gray-600 mb-4">
      <IcIcons name="RiMapPinLine" class="text-primary" />
      <span>{{ job.preferences?.adress[0]?.name }}</span>
    </div>
    <div class="flex items-center gap-2 text-gray-600 mb-4">
      <IcIcons name="RiMoneyEuroCircleLine" class="text-primary" />
      <span>{{ job.tarifPropose }} Fcfa</span>
    </div>
    <div class="flex items-center gap-2 text-gray-600">
      <IcIcons name="RiTimeLine" class="text-primary" />
      <span>{{ job.preferences?.horaire_souhaites[0]?.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import IcIcons from "@/components/icons/IcIcons.vue";

defineProps({
  job: {
    type: Object,
    required: true
  }
});
</script>