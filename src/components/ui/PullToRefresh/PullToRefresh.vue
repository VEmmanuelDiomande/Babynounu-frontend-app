<template>
  <div ref="wrapperRef" class="relative">
    <!-- Pull indicator -->
    <div
      class="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden pointer-events-none z-10"
      :style="{ height: `${pullDistance}px` }"
    >
      <div
        class="flex items-center justify-center rounded-full bg-white shadow-md"
        :style="{
          width: '36px',
          height: '36px',
          transform: `scale(${indicatorScale})`,
          opacity: pullOpacity,
          transition: pulling ? 'none' : 'transform 0.2s, opacity 0.2s',
        }"
      >
        <i
          class="ri"
          :class="iconClass"
          :style="{
            fontSize: '20px',
            color: '#f43f5e',
            transform: isRefreshing ? undefined : `rotate(${iconRotation}deg)`,
            transition: pulling ? 'none' : 'transform 0.2s',
          }"
        ></i>
      </div>
    </div>

    <!-- Content -->
    <div
      :style="{
        transform: `translateY(${pullDistance}px)`,
        transition: pulling ? 'none' : 'transform 0.3s ease',
      }"
      class="will-change-transform"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

const props = withDefaults(defineProps<{
  threshold?: number;
  maxPull?: number;
  refreshing?: boolean;
}>(), {
  threshold: 70,
  maxPull: 120,
  refreshing: false,
});

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const wrapperRef = ref<HTMLElement | null>(null);
const pullDistance = ref(0);
const pulling = ref(false);
const internalRefreshing = ref(false);

let startY = 0;
let startX = 0;
let active = false;

const isRefreshing = computed(() => props.refreshing || internalRefreshing.value);

const pullOpacity = computed(() => Math.min(pullDistance.value / props.threshold, 1));
const indicatorScale = computed(() => 0.5 + Math.min(pullDistance.value / props.threshold, 1) * 0.5);

const iconClass = computed(() => {
  if (isRefreshing.value) return 'ri-loader-4-line ptr-spin';
  return pullDistance.value >= props.threshold ? 'ri-arrow-down-line' : 'ri-arrow-down-s-line';
});

const iconRotation = computed(() => {
  if (isRefreshing.value) return 0;
  const progress = Math.min(pullDistance.value / props.threshold, 1);
  return progress * 360;
});

function getScrollTop(): number {
  let el: HTMLElement | null = wrapperRef.value?.parentElement ?? null;
  while (el) {
    const style = getComputedStyle(el);
    if (
      el.hasAttribute('data-scroll-container') ||
      style.overflowY === 'auto' ||
      style.overflowY === 'scroll'
    ) {
      return el.scrollTop;
    }
    el = el.parentElement;
  }
  return window.scrollY;
}

function onTouchStart(e: TouchEvent) {
  if (isRefreshing.value) return;
  if (getScrollTop() > 0) {
    active = false;
    return;
  }
  startY = e.touches[0].clientY;
  startX = e.touches[0].clientX;
  active = true;
  pulling.value = true;
}

function onTouchMove(e: TouchEvent) {
  if (!active || isRefreshing.value) return;

  const deltaY = e.touches[0].clientY - startY;
  const deltaX = e.touches[0].clientX - startX;

  if (deltaY <= 0 || Math.abs(deltaX) > Math.abs(deltaY)) {
    if (pullDistance.value > 0) {
      pullDistance.value = 0;
      pulling.value = false;
    }
    active = false;
    return;
  }

  if (getScrollTop() > 0) {
    if (pullDistance.value > 0) {
      pullDistance.value = 0;
      pulling.value = false;
    }
    active = false;
    return;
  }

  e.preventDefault();
  const distance = Math.min(deltaY * 0.5, props.maxPull);
  pullDistance.value = distance;
}

function onTouchEnd() {
  if (!active && pullDistance.value === 0) {
    pulling.value = false;
    return;
  }
  active = false;
  pulling.value = false;

  if (pullDistance.value >= props.threshold) {
    internalRefreshing.value = true;
    pullDistance.value = props.threshold;
    emit('refresh');
    nextTick(() => {
      setTimeout(() => {
        if (!props.refreshing && internalRefreshing.value) {
          internalRefreshing.value = false;
          pullDistance.value = 0;
        }
      }, 1500);
    });
  } else {
    pullDistance.value = 0;
  }
}

watch(() => props.refreshing, (val) => {
  if (!val && internalRefreshing.value) {
    internalRefreshing.value = false;
    pullDistance.value = 0;
  }
});

onMounted(() => {
  const el = wrapperRef.value;
  if (!el) return;
  el.addEventListener('touchstart', onTouchStart, { passive: true });
  el.addEventListener('touchmove', onTouchMove, { passive: false });
  el.addEventListener('touchend', onTouchEnd, { passive: true });
  el.addEventListener('touchcancel', onTouchEnd, { passive: true });
});

onUnmounted(() => {
  const el = wrapperRef.value;
  if (!el) return;
  el.removeEventListener('touchstart', onTouchStart);
  el.removeEventListener('touchmove', onTouchMove);
  el.removeEventListener('touchend', onTouchEnd);
  el.removeEventListener('touchcancel', onTouchEnd);
});
</script>

<style scoped>
@keyframes ptr-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.ptr-spin {
  animation: ptr-spin 0.8s linear infinite;
}
</style>
