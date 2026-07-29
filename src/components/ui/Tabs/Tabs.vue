<template>
  <div class="w-full">
    <div class="flex items-center gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="[
          'flex-1 min-w-0 px-2 sm:px-4 py-2.5 rounded-lg font-love font-medium transition-all duration-200',
          modelValue === tab.value
            ? 'bg-white text-primary shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        ]"
        @click="selectTab(tab.value)"
      >
        <div class="flex items-center justify-center gap-1.5 sm:gap-2">
          <IcIcons v-if="tab.icon" :name="tab.icon" :size="18" />
          <span class="truncate text-xs sm:text-sm">{{ tab.label }}</span>
          <Badge v-if="tab.badge" variant="primary" size="sm">
            {{ tab.badge }}
          </Badge>
        </div>
      </button>
    </div>
    
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import IcIcons from '@/components/icons/IcIcons.vue';
import { Badge } from '@/components/ui';

interface Tab {
  label: string;
  value: string;
  icon?: string;
  badge?: string | number;
}

interface Props {
  tabs: Tab[];
  modelValue: string;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const selectTab = (value: string) => {
  emit('update:modelValue', value);
};
</script>
