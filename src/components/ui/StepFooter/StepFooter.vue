<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-t border-rose-50 bg-white/95 backdrop-blur-md pb-safe"
  >
    <button
      v-if="currentStep > 1"
      type="button"
      @click="$emit('back')"
      class="flex items-center gap-2 font-love text-sm font-medium text-gray-600 hover:text-rose-400 transition-colors px-4 py-2.5 rounded-2xl hover:bg-rose-50"
    >
      <i class="ri ri-arrow-left-line" style="font-size: 16px;"></i>
      Retour
    </button>
    <div v-else></div>

    <button
      type="button"
      @click="$emit('next')"
      :disabled="loading"
      class="relative inline-flex items-center justify-center gap-2 font-love font-semibold text-white bg-gradient-to-r from-rose-400 to-primary hover:from-rose-500 hover:to-primary/90 active:scale-[0.98] rounded-2xl shadow-lg shadow-rose-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3.5 text-sm"
    >
      <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
        <i class="ri ri-loader-4-line ri-spin" style="font-size: 20px;"></i>
      </span>
      <span :class="{ 'opacity-0': loading }">
        {{ currentStep === totalSteps ? 'Finaliser' : 'Continuer' }}
      </span>
      <i
        v-if="currentStep !== totalSteps"
        class="ri ri-arrow-right-line"
        :class="{ 'opacity-0': loading }"
        style="font-size: 16px;"
      ></i>
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  currentStep: number;
  totalSteps: number;
  loading?: boolean;
}>(), {
  loading: false,
});

defineEmits<{
  (e: 'back'): void;
  (e: 'next'): void;
}>();
</script>
