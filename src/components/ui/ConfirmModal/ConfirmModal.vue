<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="onCancel">
    <div class="bg-white rounded-3xl border border-primary/10 w-full max-w-sm p-6 space-y-4 m-4 shadow-xl">
      <div class="flex items-center gap-3">
        <div :class="['h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0', iconBgClass]">
          <i class="ri" :class="[`ri-${icon}`, iconClass]" style="font-size: 20px;"></i>
        </div>
        <h3 class="font-anton text-lg text-gray-900">{{ title }}</h3>
      </div>
      <p class="text-sm text-gray-600 font-love" v-html="message"></p>
      <div class="flex items-center gap-3 pt-2">
        <button
          @click="onCancel"
          class="flex-1 px-4 py-2.5 rounded-xl text-sm font-love font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
        >
          {{ cancelLabel }}
        </button>
        <button
          @click="onConfirm"
          :class="['flex-1 px-4 py-2.5 rounded-xl text-sm font-love font-medium text-white active:scale-95 transition-all shadow-sm', confirmBgClass]"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    show: boolean;
    title?: string;
    message: string;
    icon?: string;
    iconBgClass?: string;
    iconClass?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmBgClass?: string;
  }>(),
  {
    title: 'Confirmation',
    icon: 'shield-line',
    iconBgClass: 'bg-orange-50',
    iconClass: 'text-orange-500',
    confirmLabel: 'Confirmer',
    cancelLabel: 'Annuler',
    confirmBgClass: 'bg-orange-500 hover:bg-orange-600 shadow-orange-200',
  }
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const onConfirm = () => emit('confirm');
const onCancel = () => emit('cancel');
</script>
