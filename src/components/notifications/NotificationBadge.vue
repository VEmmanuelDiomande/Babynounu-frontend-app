<template>
  <div class="absolute top-1 ring-2 ring-white right-1 size-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
    {{ count }}
  </div>
</template>

<script lang="ts" setup>
defineProps({
  count: {
    type: Number,
    required: true
  }
});
</script>