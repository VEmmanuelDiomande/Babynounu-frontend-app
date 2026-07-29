import { ref, readonly } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
  dismissible: boolean;
}

export interface ToastOptions {
  title?: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

const toasts = ref<ToastItem[]>([]);
let toastIdCounter = 0;

function addToast(type: ToastType, options: ToastOptions | string = {}): number {
  const opts = typeof options === 'string' ? { message: options } : options;
  const id = ++toastIdCounter;

  const toast: ToastItem = {
    id,
    type,
    title: opts.title ?? getDefaultTitle(type),
    message: opts.message,
    duration: opts.duration ?? (type === 'loading' ? 0 : 4000),
    dismissible: opts.dismissible ?? true,
  };

  toasts.value.push(toast);

  if (toast.duration > 0) {
    setTimeout(() => removeToast(id), toast.duration);
  }

  return id;
}

function removeToast(id: number) {
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
}

function clearAll() {
  toasts.value = [];
}

function getDefaultTitle(type: ToastType): string {
  const titles: Record<ToastType, string> = {
    success: 'Succès',
    error: 'Erreur',
    warning: 'Attention',
    info: 'Information',
    loading: 'Chargement...',
  };
  return titles[type];
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    success: (options: ToastOptions | string = {}) => addToast('success', options),
    error: (options: ToastOptions | string = {}) => addToast('error', options),
    warning: (options: ToastOptions | string = {}) => addToast('warning', options),
    info: (options: ToastOptions | string = {}) => addToast('info', options),
    loading: (options: ToastOptions | string = {}) => addToast('loading', options),
    remove: removeToast,
    clear: clearAll,
  };
}
