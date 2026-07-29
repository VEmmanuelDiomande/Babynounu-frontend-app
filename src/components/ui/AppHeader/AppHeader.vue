<template>
  <header
    v-if="mode !== 'hidden'"
    class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-rose-100"
  >
    <div :class="[
      'flex items-center justify-between h-16',
      embedded ? '-mx-4 sm:-mx-6 px-4 sm:px-6' : 'max-w-5xl mx-auto px-4 sm:px-6'
    ]">
      <!-- Left side -->
      <div class="flex items-center gap-3 min-w-0">
        <!-- Back button (back mode) -->
        <button
          v-if="mode === 'back'"
          @click="$emit('back')"
          class="h-9 w-9 rounded-xl bg-rose-50 text-gray-600 hover:bg-rose-100 hover:text-rose-500 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <i class="ri ri-arrow-left-line" style="font-size: 20px;"></i>
        </button>

        <!-- Logo (logo mode) -->
        <template v-if="mode === 'logo'">
          <img src="/images/logos/bn_logo.png" alt="BabyNounu" class="h-8 w-8 object-contain flex-shrink-0" />
          <span class="font-anton text-lg text-gray-900">BabyNounu</span>
          <nav class="hidden sm:flex items-center gap-1 ml-2">
            <router-link
              :to="{ name: 'HOME_JOBS' }"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="isActiveLink('HOME_JOBS') ? 'text-rose-500 bg-rose-50' : 'text-gray-600 hover:text-rose-500 hover:bg-rose-50'"
            >
              Jobs
            </router-link>
            <router-link
              :to="{ name: 'HOME' }"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="isActiveLink('HOME') ? 'text-rose-500 bg-rose-50' : 'text-gray-600 hover:text-rose-500 hover:bg-rose-50'"
            >
              Nounus
            </router-link>
          </nav>
        </template>

        <!-- Logo + title (close mode) -->
        <template v-if="mode === 'close'">
          <img src="/images/logos/bn_logo.png" alt="BabyNounu" class="h-8 w-8 object-contain flex-shrink-0" />
          <span class="font-anton text-lg text-gray-900">{{ title }}</span>
        </template>

        <!-- Icon (title mode) -->
        <div
          v-if="mode === 'title' && icon"
          class="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0"
        >
          <i class="ri" :class="`ri-${icon}`" style="font-size: 18px; color: #f43f5e;"></i>
        </div>

        <!-- Title + subtitle (title & back modes) -->
        <div v-if="mode === 'title' || mode === 'back'" class="min-w-0">
          <h1 class="font-anton text-lg text-gray-900 leading-tight truncate">{{ title }}</h1>
          <p v-if="subtitle" class="text-xs text-gray-500 font-love truncate">{{ subtitle }}</p>
        </div>

        <!-- Badge (close mode) -->
        <span
          v-if="mode === 'close' && badge"
          class="px-3 py-1 rounded-full bg-rose-50 text-rose-400 font-love text-xs font-medium flex items-center gap-1.5"
        >
          <i class="ri ri-pencil-line" style="font-size: 12px;"></i>
          {{ badge }}
        </span>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <!-- Close button (close mode) -->
        <button
          v-if="mode === 'close'"
          @click="$emit('close')"
          class="h-9 w-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors"
        >
          <i class="ri ri-close-line" style="font-size: 20px;"></i>
        </button>

        <!-- Actions slot -->
        <slot name="actions" />
      </div>
    </div>

    <!-- Extra slot (for search bars, filters, etc.) -->
    <slot name="extra" />
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

withDefaults(defineProps<{
  mode?: 'logo' | 'title' | 'back' | 'close' | 'hidden';
  title?: string;
  subtitle?: string;
  icon?: string;
  badge?: string;
  embedded?: boolean;
}>(), {
  mode: 'logo',
  title: '',
  subtitle: '',
  icon: '',
  badge: '',
  embedded: false,
});

defineEmits<{
  (e: 'back'): void;
  (e: 'close'): void;
}>();

const route = useRoute();
const isActiveLink = (routeName: string) => route.name === routeName;
</script>
