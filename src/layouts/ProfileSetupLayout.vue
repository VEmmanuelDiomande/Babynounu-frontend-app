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
    <div class="flex items-center justify-center mt-8 gap-2 py-3 bg-white border-b border-rose-50">
      <div v-for="s in totalSteps" :key="s" :class="['h-1.5 rounded-full transition-all duration-300', s <= currentStep ? 'w-8 bg-rose-400' : 'w-4 bg-rose-100']"></div>
    </div>

    <!-- Step content -->
    <div class="flex-1 overflow-y-auto px-4 py-4 pb-[calc(6rem+var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]">
      <div class="w-full max-w-xl mx-auto">
        <slot />
      </div>
    </div>

    <!-- Bottom navigation -->
    <StepFooter
      :current-step="currentStep"
      :total-steps="totalSteps"
      :loading="loading"
      @back="$emit('back')"
      @next="$emit('next')"
    />

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
import { AppHeader, StepFooter } from '@/components/ui';

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
