<template>
  <div class="min-h-screen py-8 bg-rose-50 flex flex-col">
    <!-- Shared header (never animated) -->
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center gap-2">
        <img src="/images/logos/logo_babynounu_1.png" alt="BabyNounu" class="h-8 w-8 object-contain" />
        <span class="font-anton text-lg text-gray-900">BabyNounu</span>
      </div>
    </div>

    <!-- Animated content area only -->
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </Transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
