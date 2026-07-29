<template>
  <div class="flex items-center gap-3 px-3 sm:px-4 py-2.5 bg-white border-b border-rose-50 flex-shrink-0 shadow-sm">
    <button @click="$emit('back')" class="h-9 w-9 rounded-full hover:bg-rose-50 flex items-center justify-center transition-colors flex-shrink-0">
      <i class="ri ri-arrow-left-line text-gray-600" style="font-size: 20px;"></i>
    </button>
    <div class="relative flex-shrink-0">
      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center overflow-hidden">
        <img v-if="avatarUrl" :src="avatarUrl" alt="" class="h-full w-full object-cover" />
        <span v-else class="font-anton text-xs text-rose-400">{{ initials }}</span>
      </div>
      <span v-if="online" class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
    </div>
    <div class="min-w-0 flex-1">
      <div class="text-sm font-love font-semibold text-gray-900 truncate">
        {{ title }}
      </div>
      <div class="text-xs font-love text-gray-400">
        {{ online ? 'En ligne' : subtitle }}
      </div>
    </div>
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
  avatarUrl?: string | null;
  initials: string;
  online?: boolean;
}>();

defineEmits<{
  back: [];
}>();
</script>
