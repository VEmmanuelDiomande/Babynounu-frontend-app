<template>
  <div class="min-h-screen bg-rose-50 flex flex-col">
    <!-- Top bar -->
    <div class="flex items-center justify-between px-6 py-5 hidden">
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
          <i class="ri ri-global-line text-rose-400" style="font-size: 20px;"></i>
        </div>
        <span class="font-love text-lg font-bold text-rose-400">BabyNounu</span>
      </div>
      <button
        class="font-love text-sm font-medium text-rose-400 hover:text-rose-500 transition-colors"
      >
        Passer
      </button>
    </div>

    <!-- Back button -->
    <div class="flex items-start px-6 pt-4">
      <router-link :to="{ name: 'STARTER_DESTINATION' }" class="inline-flex items-center gap-2 text-gray-500 hover:text-rose-400 transition-colors font-love text-sm font-medium">
        <i class="ri ri-arrow-left-line" style="font-size: 18px;"></i>
        <span>Retour</span>
      </router-link>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col px-6 sm:px-0 mx-auto w-full pt-16">
      <PullToRefresh :refreshing="isRefreshing" @refresh="handleRefresh">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </PullToRefresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { PullToRefresh } from '@/components/ui';
import { getRefreshHandler } from '@/composables/usePullToRefresh';

const route = useRoute();
const isRefreshing = ref(false);

async function handleRefresh() {
  const handler = getRefreshHandler(route.name as string);
  if (handler) {
    isRefreshing.value = true;
    try {
      await handler();
    } finally {
      isRefreshing.value = false;
    }
  }
}
</script>
