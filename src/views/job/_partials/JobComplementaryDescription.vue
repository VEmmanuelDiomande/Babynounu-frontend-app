<template>
  <div class="mt-6 bg-white rounded-xl border-[1px] p-6 animate-fade-in-up shadow-sm">
    <Heading2Text title="Description complementaire" />
    <p class="text-gray-700 text-sm leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import Heading2Text from "@/components/texts/heading2Text.vue";

defineProps({
  description: {
    type: String,
    required: true
  }
});
</script>