<template>
  <div class="mt-6 bg-white rounded-xl border-[1px] p-6 animate-fade-in-up shadow-sm">
    <Heading2Text title="Description" />
    <p class="text-gray-700 leading-relaxed text-sm">
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