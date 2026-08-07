<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      @click.self="close"
    >
      <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div class="flex items-center justify-between px-4 py-3 border-b border-rose-100">
          <h3 class="font-love text-base font-semibold text-gray-900">{{ title }}</h3>
          <button
            type="button"
            @click="close"
            class="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
          >
            <i class="ri ri-close-line" style="font-size: 20px;"></i>
          </button>
        </div>

        <div class="h-80 w-full bg-gray-50">
          <Cropper
            v-if="image"
            ref="cropperRef"
            class="h-full w-full"
            :src="image"
            :stencil-component="stencilType === 'circle' ? CircleStencil : RectangleStencil"
            :stencil-props="{ aspectRatio: aspectRatio }"
            image-restriction="fit-area"
          />
        </div>

        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t border-rose-100">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 rounded-xl font-love text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            @click="confirm"
            class="px-4 py-2 rounded-xl font-love text-sm font-semibold text-white bg-rose-400 hover:bg-rose-500 active:scale-[0.98] transition-all"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Cropper, CircleStencil, RectangleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

interface CropResult {
  file: File;
  dataUrl: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    image: string;
    title: string;
    fileName?: string;
    aspectRatio?: number;
    stencilType?: 'circle' | 'rectangle';
    /** Largeur maximale de sortie en pixels (défaut: 1200) */
    maxWidth?: number;
    /** Hauteur maximale de sortie en pixels (défaut: 1200) */
    maxHeight?: number;
    /** Qualité JPEG 1-100 (défaut: 80) */
    quality?: number;
  }>(),
  {
    fileName: 'image.jpg',
    aspectRatio: 1,
    stencilType: 'rectangle',
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 80,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'crop', payload: CropResult): void;
}>();

const cropperRef = ref<any>();

const close = () => {
  emit('update:modelValue', false);
};

/**
 * Redimensionne un canvas pour respecter les dimensions maximales
 * tout en conservant le ratio. Retourne un nouveau canvas.
 */
const resizeCanvas = (source: HTMLCanvasElement, maxWidth: number, maxHeight: number): HTMLCanvasElement => {
  const { width, height } = source;
  if (width <= maxWidth && height <= maxHeight) {
    return source; // Pas besoin de redimensionner
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height);
  const newWidth = Math.round(width * ratio);
  const newHeight = Math.round(height * ratio);

  const resized = document.createElement('canvas');
  resized.width = newWidth;
  resized.height = newHeight;

  const ctx = resized.getContext('2d');
  if (!ctx) return source;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, newWidth, newHeight);

  return resized;
};

const confirm = () => {
  const result = cropperRef.value?.getResult();
  const canvas = result?.canvas;
  if (!canvas) return;

  // Redimensionner le canvas avant export pour limiter la taille
  const resizedCanvas = resizeCanvas(canvas, props.maxWidth, props.maxHeight);

  resizedCanvas.toBlob(
    (blob: Blob | null) => {
      if (!blob) return;
      const file = new File([blob], props.fileName, { type: blob.type || 'image/jpeg' });
      const dataUrl = resizedCanvas.toDataURL('image/jpeg', props.quality / 100);
      emit('crop', { file, dataUrl });
    },
    'image/jpeg',
    props.quality / 100
  );
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
