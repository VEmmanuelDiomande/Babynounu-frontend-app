<template>
  <header
    v-if="!hidden"
    class="fixed w-full pt-8 top-0 z-30 bg-white/80 backdrop-blur-md border-b border-primary/10"
  >
    <div class="flex items-center justify-between h-16 max-w-5xl mx-auto px-4 sm:px-6">
      <!-- Left side -->
      <div class="flex items-center gap-3 min-w-0">
        <!-- Menu button -->
        <button
          @click="$emit('menu')"
          class="h-9 w-9 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <i class="ri ri-menu-line" style="font-size: 20px;"></i>
        </button>

        <!-- Title -->
        <div class="min-w-0">
          <h1 class="font-anton text-lg text-gray-900 leading-tight truncate">{{ title }}</h1>
        </div>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <!-- Pending badge -->
        <router-link
          v-if="pendingCount > 0"
          :to="{ name: 'ADMIN_NOUNUS' }"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-love font-semibold hover:bg-primary/20 transition-colors"
        >
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {{ pendingCount }} en attente
        </router-link>

        <!-- Profile link -->
        <router-link
          :to="{ name: 'ADMIN_PROFILE' }"
          class="h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
        >
          <span class="font-anton text-sm text-primary">A</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string;
  pendingCount?: number;
  hidden?: boolean;
}>(), {
  title: '',
  pendingCount: 0,
  hidden: false,
});

defineEmits<{
  (e: 'menu'): void;
}>();
</script>
