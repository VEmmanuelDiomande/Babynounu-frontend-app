<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-450 ease-out"
      leave-active-class="transition-opacity duration-300 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 bg-black/40"
        :style="maxHeight ? { opacity: backdropOpacity } : {}"
        @click="$emit('close')"
      ></div>
    </Transition>
    <Transition
      :enter-active-class="maxHeight ? 'transition-transform duration-450 ease-[cubic-bezier(0.22,1,0.36,1)]' : 'transition-transform duration-300 ease-out'"
      :leave-active-class="maxHeight ? 'transition-transform duration-450 ease-[cubic-bezier(0.22,1,0.36,1)]' : 'transition-transform duration-200 ease-in'"
      :enter-from-class="maxHeight ? 'translate-y-full' : 'translate-x-full'"
      :enter-to-class="maxHeight ? 'translate-y-0' : 'translate-x-0'"
      :leave-from-class="maxHeight ? 'translate-y-0' : 'translate-x-0'"
      :leave-to-class="maxHeight ? 'translate-y-full' : 'translate-x-full'"
    >
      <div
        v-if="show"
        ref="panelRef"
        :class="maxHeight
          ? 'fixed bottom-0 left-0 right-0 z-50 w-full bg-white shadow-2xl flex flex-col rounded-t-3xl'
          : 'fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col'"
        :style="maxHeight ? { maxHeight, ...(isDragging || isClosing ? { transform: `translateY(${dragY}px)`, transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)' } : {}) } : {}"
      >
        <div
          v-if="maxHeight"
          class="flex justify-center pt-3 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div class="h-1.5 w-10 rounded-full bg-gray-300"></div>
        </div>
        <div
          class="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0"
          :class="maxHeight ? 'touch-none' : ''"
          @touchstart="maxHeight ? onTouchStart : undefined"
          @touchmove="maxHeight ? onTouchMove : undefined"
          @touchend="maxHeight ? onTouchEnd : undefined"
        >
          <h3 class="font-anton text-base text-gray-900">{{ title }}</h3>
          <button
            @click="$emit('close')"
            class="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <i class="ri ri-close-line" style="font-size: 20px;"></i>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto px-5 py-4">
          <slot />
        </div>
        <div v-if="$slots.footer" class="px-5 py-4 border-t border-gray-100 flex-shrink-0">
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  title?: string;
  maxHeight?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const panelRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const dragY = ref(0);
const startY = ref(0);
const lastY = ref(0);
const lastTime = ref(0);
const velocity = ref(0);
const backdropOpacity = ref(1);
const isClosing = ref(false);

const onTouchStart = (e: TouchEvent) => {
  if (!props.maxHeight) return;
  isDragging.value = true;
  isClosing.value = false;
  startY.value = e.touches[0].clientY;
  lastY.value = e.touches[0].clientY;
  lastTime.value = Date.now();
  velocity.value = 0;
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || !props.maxHeight) return;
  const currentY = e.touches[0].clientY;
  const delta = currentY - startY.value;
  const now = Date.now();
  const dt = now - lastTime.value;
  if (dt > 0) {
    velocity.value = (currentY - lastY.value) / dt;
  }
  lastY.value = currentY;
  lastTime.value = now;
  if (delta > 0) {
    const resistance = 1 - delta / 1200;
    dragY.value = delta * Math.max(0.7, resistance);
    backdropOpacity.value = Math.max(0.1, 1 - delta / 500);
  }
};

const onTouchEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  const panelHeight = panelRef.value?.offsetHeight ?? 300;
  const threshold = panelHeight * 0.4;
  const shouldClose = dragY.value > threshold || velocity.value > 0.5;
  if (shouldClose) {
    isClosing.value = true;
    dragY.value = panelHeight + 50;
    backdropOpacity.value = 0;
    setTimeout(() => {
      emit('close');
      isClosing.value = false;
    }, 450);
  } else {
    dragY.value = 0;
    backdropOpacity.value = 1;
  }
};

watch(() => props.show, (val) => {
  if (!val) {
    isDragging.value = false;
    isClosing.value = false;
    dragY.value = 0;
    velocity.value = 0;
    backdropOpacity.value = 1;
  }
});
</script>
