<template>
  <nav
    v-if="visible"
    class="fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-t border-primary/10 pb-safe"
  >
    <div class="max-w-5xl mx-auto flex items-center justify-around h-16 px-2">
      <router-link
        v-for="item in items"
        :key="item.route"
        :to="{ name: item.route }"
        :class="[
          'flex flex-col items-center justify-center gap-1 min-w-0 flex-1 py-2 rounded-xl transition-colors duration-200',
          isActive(item.route) ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
        ]"
      >
        <div :class="[
          'relative flex items-center justify-center h-8 w-8 rounded-xl transition-colors duration-200',
          isActive(item.route) ? 'bg-primary/10' : ''
        ]">
          <i class="ri" :class="`ri-${item.icon}`" style="font-size: 20px;"></i>
          <span
            v-if="item.badge && pendingCount > 0"
            class="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 flex items-center justify-center bg-primary text-white text-[9px] font-bold rounded-full border-2 border-white"
          >
            {{ pendingCount > 9 ? '9+' : pendingCount }}
          </span>
          <span
            v-else-if="item.badgeType === 'message' && chatsTotalUnread > 0"
            class="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 flex items-center justify-center bg-primary text-white text-[9px] font-bold rounded-full border-2 border-white"
          >
            {{ chatsTotalUnread > 9 ? '9+' : chatsTotalUnread }}
          </span>
          <span
            v-else-if="item.badgeType === 'notification' && notificationCount > 0"
            class="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 flex items-center justify-center bg-primary text-white text-[9px] font-bold rounded-full border-2 border-white"
          >
            {{ notificationCount > 9 ? '9+' : notificationCount }}
          </span>
        </div>
        <span class="text-[10px] font-love font-medium truncate max-w-full px-1">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { NavItem } from '../AdminSidebar/admin-nav.types';

withDefaults(defineProps<{
  items: NavItem[];
  pendingCount?: number;
  chatsTotalUnread?: number;
  notificationCount?: number;
  visible?: boolean;
}>(), {
  pendingCount: 0,
  chatsTotalUnread: 0,
  notificationCount: 0,
  visible: true,
});

const route = useRoute();
const isActive = (routeName: string) => route.name === routeName;
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
