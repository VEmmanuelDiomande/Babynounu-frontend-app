<template>
  <AppHeader
    mode="back"
    :title="title"
    embedded
    @back="$emit('back')"
  >
    <template #actions>
      <slot name="actions" />
    </template>
  </AppHeader>
</template>

<script setup lang="ts">
import AppHeader from '@/components/ui/AppHeader/AppHeader.vue';

defineProps<{
  title?: string;
}>();

defineEmits<{
  back: [];
}>();
</script>
