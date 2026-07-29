<template>
  <Teleport to="body">
    <div class="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center px-4 pt-4 pointer-events-none gap-2.5">
      <TransitionGroup name="toast" tag="div" class="flex flex-col items-center gap-2.5 w-full">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto w-full max-w-sm rounded-2xl shadow-lg border bg-white overflow-hidden"
          :class="toastBorderClass(toast.type)"
        >
          <div class="flex items-start gap-3 p-3.5">
            <div
              class="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="toastIconBgClass(toast.type)"
            >
              <i
                v-if="toast.type === 'loading'"
                class="ri ri-loader-4-line ri-spin"
                :class="toastIconTextClass(toast.type)"
                style="font-size: 18px;"
              ></i>
              <i
                v-else
                class="ri"
                :class="[toastIconClass(toast.type), toastIconTextClass(toast.type)]"
                style="font-size: 18px;"
              ></i>
            </div>

            <div class="flex-1 min-w-0 pt-0.5">
              <p class="font-love font-semibold text-sm text-gray-900 leading-tight">
                {{ toast.title }}
              </p>
              <p v-if="toast.message" class="font-love text-xs text-gray-500 mt-0.5 leading-snug">
                {{ toast.message }}
              </p>
            </div>

            <button
              v-if="toast.dismissible && toast.type !== 'loading'"
              @click="remove(toast.id)"
              class="flex-shrink-0 h-6 w-6 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <i class="ri ri-close-line" style="font-size: 16px;"></i>
            </button>
          </div>

          <div
            v-if="toast.duration > 0"
            class="h-0.5 bg-gray-100 origin-left"
            :class="toastProgressClass(toast.type)"
            :style="{ animation: `toast-progress ${toast.duration}ms linear forwards` }"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toasts, remove } = useToast();

function toastIconClass(type: string): string {
  const icons: Record<string, string> = {
    success: 'ri-checkbox-circle-line',
    error: 'ri-close-circle-line',
    warning: 'ri-alert-line',
    info: 'ri-information-line',
    loading: 'ri-loader-4-line',
  };
  return icons[type] ?? 'ri-information-line';
}

function toastIconBgClass(type: string): string {
  const bgs: Record<string, string> = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    warning: 'bg-amber-50',
    info: 'bg-blue-50',
    loading: 'bg-gray-100',
  };
  return bgs[type] ?? 'bg-blue-50';
}

function toastIconTextClass(type: string): string {
  const texts: Record<string, string> = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
    loading: 'text-gray-500',
  };
  return texts[type] ?? 'text-blue-500';
}

function toastBorderClass(type: string): string {
  const borders: Record<string, string> = {
    success: 'border-green-100',
    error: 'border-red-100',
    warning: 'border-amber-100',
    info: 'border-blue-100',
    loading: 'border-gray-100',
  };
  return borders[type] ?? 'border-blue-100';
}

function toastProgressClass(type: string): string {
  const colors: Record<string, string> = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    warning: 'bg-amber-400',
    info: 'bg-blue-400',
    loading: 'bg-gray-300',
  };
  return colors[type] ?? 'bg-blue-400';
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}
.toast-leave-active {
  transition: all 0.25s cubic-bezier(0.06, 0.71, 0.55, 1);
  position: absolute;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-100%) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.toast-move {
  transition: transform 0.3s ease;
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}
</style>
