<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
    @click.self="close"
  >
    <button
      @click="close"
      class="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
      aria-label="Fermer"
    >
      <i class="ri ri-close-line" style="font-size: 24px;"></i>
    </button>

    <div class="relative max-w-full max-h-full rounded-2xl overflow-hidden shadow-2xl">
      <img
        v-if="src"
        :src="src"
        :alt="alt || 'Aperçu de l\'image'"
        class="max-w-full max-h-[85vh] object-contain"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    show: boolean;
    src: string;
    alt?: string;
  }>(),
  {
    alt: '',
  }
);

const emit = defineEmits<{
  close: [];
}>();

const close = () => emit('close');
</script>
