<template>
  <!-- Overlay -->
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    leave-active-class="transition-opacity duration-200 ease-in"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      @click="$emit('close')"
      class="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm"
    ></div>
  </Transition>

  <!-- Sidebar -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
    leave-active-class="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <aside
      v-if="open"
      class="fixed top-0 left-0 z-[60] h-screen bg-white w-[280px] flex-shrink-0 flex flex-col border-r border-gray-100"
    >
      <!-- Header -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-primary/10">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <img src="/images/logos/logo_babynounu_1.png" alt="BabyNounu" class="h-5 w-5 object-contain" />
          </div>
          <span class="font-anton text-base text-gray-900">BabyNounu</span>
        </div>
        <button @click="$emit('close')" class="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
          <i class="ri ri-close-line text-gray-600" style="font-size: 20px;"></i>
        </button>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-3 px-3 no-scrollbar">
        <template v-for="group in navGroups" :key="group.label">
          <div class="px-3 pt-4 pb-1.5">
            <span class="text-[10px] font-love font-bold uppercase tracking-wider text-primary/60">{{ group.label }}</span>
          </div>
          <router-link
            v-for="item in group.items"
            :key="item.name"
            :to="{ name: item.route }"
            @click="$emit('close')"
            :class="[
              'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-love transition-colors duration-200 mb-1',
              isActive(item.route)
                ? 'bg-primary text-white font-semibold'
                : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
            ]"
          >
            <i class="ri flex-shrink-0" :class="`ri-${item.icon}`" style="font-size: 18px;"></i>
            <span class="flex-1">{{ item.label }}</span>
            <span
              v-if="item.badge && pendingCount > 0"
              class="bg-white text-primary text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center"
            >
              {{ pendingCount }}
            </span>
            <span
              v-else-if="item.badgeType === 'message' && chatsTotalUnread > 0"
              class="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center"
            >
              {{ chatsTotalUnread > 9 ? '9+' : chatsTotalUnread }}
            </span>
            <span
              v-else-if="item.badgeType === 'notification' && notificationCount > 0"
              class="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center"
            >
              {{ notificationCount > 9 ? '9+' : notificationCount }}
            </span>
          </router-link>
        </template>
      </nav>

      <!-- Logout -->
      <div class="border-t border-primary/10 p-3">
        <button
          @click="$emit('logout')"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-love font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <i class="ri ri-logout-box-line" style="font-size: 18px;"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { NavItem, NavGroup } from './admin-nav.types';

defineProps<{
  open: boolean;
  navGroups: NavGroup[];
  pendingCount: number;
  chatsTotalUnread: number;
  notificationCount: number;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'logout'): void;
}>();

const route = useRoute();
const isActive = (routeName: string) => route.name === routeName;
</script>
