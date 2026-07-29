<template>
  <div class="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-rose-50/30 to-white w-full">
    <!-- Header -->
    <AppHeader
      mode="close"
      :title="title"
      :badge="isEditMode ? 'Mode édition' : ''"
      @close="$emit('close')"
    />

    <!-- Step indicator -->
    <div class="flex items-center justify-center gap-2 py-3 bg-white border-b border-rose-50">
      <div v-for="s in totalSteps" :key="s" :class="['h-1.5 rounded-full transition-all duration-300', s <= currentStep ? 'w-8 bg-rose-400' : 'w-4 bg-rose-100']"></div>
    </div>

    <!-- Step content -->
    <div class="flex-1 overflow-y-auto px-4 py-4 pb-24">
      <div class="w-full max-w-xl mx-auto">
        <slot />
      </div>
    </div>

    <!-- Bottom navigation -->
    <div class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-t border-rose-50 bg-white/95 backdrop-blur-md">
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

    <!-- Image Cropper -->
    <ImageCropper
      :modelValue="showCropper"
      :image="cropImageSrc || ''"
      :title="cropTitle || 'Recadrer l\'image'"
      :file-name="cropFileName || 'image.jpg'"
      :stencil-type="cropStencilType"
      @update:modelValue="onCropCancel"
      @crop="onCrop"
    />
  </div>
</template>

<script setup lang="ts">
import ImageCropper from '@/components/ui/ImageCropper.vue';
import { AppHeader } from '@/components/ui';

withDefaults(defineProps<{
  title: string;
  currentStep: number;
  totalSteps: number;
  loading?: boolean;
  isEditMode?: boolean;
  showCropper?: boolean;
  cropImageSrc?: string;
  cropTitle?: string;
  cropFileName?: string;
  cropStencilType?: 'circle' | 'rectangle';
}>(), {
  loading: false,
  isEditMode: false,
  showCropper: false,
  cropImageSrc: '',
  cropTitle: 'Recadrer l\'image',
  cropFileName: 'image.jpg',
  cropStencilType: 'rectangle',
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'back'): void;
  (e: 'next'): void;
  (e: 'crop-cancel'): void;
  (e: 'crop', payload: { file: File; dataUrl: string }): void;
}>();

const onCropCancel = () => {
  emit('crop-cancel');
};

const onCrop = (payload: { file: File; dataUrl: string }) => {
  emit('crop', payload);
};
</script>
