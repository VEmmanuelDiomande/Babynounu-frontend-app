<template>
  <div :class="[isFullPage ? 'h-screen' : 'min-h-screen', 'bg-gradient-to-br from-primary/5 via-white to-secondary/10 flex flex-col relative']">

    <!-- Mobile Sidebar Drawer -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-200 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sidebarOpen"
        @click="sidebarOpen = false"
        class="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm"
      ></div>
    </Transition>
    <Transition
      enter-active-class="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      leave-active-class="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="sidebarOpen"
        class="fixed top-0 left-0 z-[60] h-screen bg-white w-[280px] flex-shrink-0 flex flex-col shadow-2xl"
      >
      <div class="h-16 flex items-center justify-between px-4 border-b border-primary/10">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <img src="/images/logos/bn_logo.png" alt="BabyNounu" class="h-5 w-5 object-contain" />
          </div>
          <span class="font-anton text-base text-gray-900">BabyNounu</span>
        </div>
        <button @click="sidebarOpen = false" class="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
          <i class="ri ri-close-line text-gray-600" style="font-size: 20px;"></i>
        </button>
      </div>
      <nav class="flex-1 overflow-y-auto py-3 px-3 no-scrollbar">
        <template v-for="group in navGroups" :key="group.label">
          <div class="px-3 pt-4 pb-1.5">
            <span class="text-[10px] font-love font-bold uppercase tracking-wider text-primary/60">{{ group.label }}</span>
          </div>
          <router-link
            v-for="item in group.items"
            :key="item.name"
            :to="{ name: item.route }"
            @click="sidebarOpen = false"
            :class="[
              'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-love transition-all duration-200 mb-1',
              isActive(item.route)
                ? 'bg-primary text-white shadow-md shadow-primary/25 font-semibold'
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
              v-else-if="item.badgeType === 'message' && adminStore.chatsTotalUnread > 0"
              class="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center"
            >
              {{ adminStore.chatsTotalUnread > 9 ? '9+' : adminStore.chatsTotalUnread }}
            </span>
            <span
              v-else-if="item.badgeType === 'notification' && notificationStore.state.countNotification > 0"
              class="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center"
            >
              {{ notificationStore.state.countNotification > 9 ? '9+' : notificationStore.state.countNotification }}
            </span>
          </router-link>
        </template>
      </nav>
      <div class="border-t border-primary/10 p-3">
        <button
          @click="logout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-love font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <i class="ri ri-logout-box-line" style="font-size: 18px;"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
    </Transition>

    <!-- Main content -->
    <div :class="['flex-1 flex flex-col min-w-0', isFullPage ? 'pb-0' : 'pb-20']">
      <!-- Header -->
      <header v-if="!isFullPage" class="fixed top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-xl border-b border-primary/10 h-16 flex items-center justify-between px-4 shadow-sm">
        <div class="flex items-center gap-3">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="h-10 w-10 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors"
          >
            <i class="ri ri-menu-line" style="font-size: 20px;"></i>
          </button>
          <div>
            <h1 class="font-anton text-lg text-gray-900">{{ currentPageTitle }}</h1>
          </div>
        </div>

        <div class="flex items-center gap-3">
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
          <router-link
            :to="{ name: 'ADMIN_PROFILE' }"
            class="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 flex items-center justify-center transition-colors border border-primary/20"
          >
            <span class="font-anton text-sm text-primary">A</span>
          </router-link>
        </div>
      </header>

      <!-- Page content -->
      <main data-scroll-container :class="['flex-1 overflow-y-auto', isFullPage ? 'overflow-hidden p-0 pt-0' : 'pt-20 p-4']">
        <div :class="isFullPage ? 'h-full' : 'min-h-full'">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    <nav v-if="!isFullPage" class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-primary/10 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div class="flex items-center justify-around h-16">
        <router-link
          v-for="item in bottomNavItems"
          :key="item.route"
          :to="{ name: item.route }"
          :class="[
            'flex flex-col items-center justify-center gap-1 min-w-0 flex-1 py-2 rounded-xl transition-all duration-200',
            isActive(item.route)
              ? 'text-primary'
              : 'text-gray-400 hover:text-gray-600'
          ]"
        >
          <div :class="[
            'relative flex items-center justify-center h-8 w-8 rounded-xl transition-all duration-200',
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
              v-else-if="item.badgeType === 'message' && adminStore.chatsTotalUnread > 0"
              class="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 flex items-center justify-center bg-primary text-white text-[9px] font-bold rounded-full border-2 border-white"
            >
              {{ adminStore.chatsTotalUnread > 9 ? '9+' : adminStore.chatsTotalUnread }}
            </span>
            <span
              v-else-if="item.badgeType === 'notification' && notificationStore.state.countNotification > 0"
              class="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 flex items-center justify-center bg-primary text-white text-[9px] font-bold rounded-full border-2 border-white"
            >
              {{ notificationStore.state.countNotification > 9 ? '9+' : notificationStore.state.countNotification }}
            </span>
          </div>
          <span class="text-[10px] font-love font-medium truncate max-w-full px-1">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAdminStore } from '@/stores/admin.store';
import { useNotificationStore } from '@/stores/notificationStore';
import { socketService } from '@/services/socket.services';
import { StorageUtils } from '@/utils/store.utils';
import { PullToRefresh } from '@/components/ui';
import { getRefreshHandler } from '@/composables/usePullToRefresh';

const route = useRoute();
const adminStore = useAdminStore();
const notificationStore = useNotificationStore();

const sidebarOpen = ref(false);
const isFullPage = computed(() => route.name === 'ADMIN_CHAT_DETAIL');

interface NavItem {
  name: string;
  label: string;
  route: string;
  icon: string;
  badge?: boolean;
  badgeType?: string;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Principal',
    items: [
      { name: 'dashboard', label: 'Tableau de bord', route: 'ADMIN_DASHBOARD', icon: 'dashboard-line' },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { name: 'users', label: 'Utilisateurs', route: 'ADMIN_USERS', icon: 'group-line' },
      { name: 'nounus-list', label: 'Nounus', route: 'ADMIN_NOUNUS_LIST', icon: 'user-3-line' },
      { name: 'nounus', label: 'Certifications', route: 'ADMIN_NOUNUS', icon: 'checkbox-circle-line', badge: true },
      { name: 'parents', label: 'Parents', route: 'ADMIN_PARENTS', icon: 'heart-line' },
      { name: 'jobs', label: 'Annonces', route: 'ADMIN_JOBS', icon: 'briefcase-line' },
    ],
  },
  {
    label: 'Activité',
    items: [
      { name: 'payments', label: 'Paiements', route: 'ADMIN_PAYMENTS', icon: 'bank-card-2-line' },
      { name: 'subscriptions', label: 'Abonnements', route: 'ADMIN_SUBSCRIPTIONS', icon: 'checkbox-circle-line' },
      { name: 'packs', label: 'Packs', route: 'ADMIN_PACKS', icon: 'vip-crown-line' },
      { name: 'notifications', label: 'Notifications', route: 'ADMIN_NOTIFICATIONS', icon: 'notification-3-line', badgeType: 'notification' },
      { name: 'chats', label: 'Conversations', route: 'ADMIN_CHATS', icon: 'chat-3-line', badgeType: 'message' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { name: 'type-parameters', label: 'Types de paramètres', route: 'ADMIN_TYPE_PARAMETERS', icon: 'paragraph' },
      { name: 'parameters', label: 'Paramètres', route: 'ADMIN_PARAMETERS', icon: 'settings-3-line' },
      { name: 'roles', label: 'Rôles', route: 'ADMIN_ROLES', icon: 'settings-3-line' },
      { name: 'sub-admins', label: 'Sous-admins', route: 'ADMIN_SUB_ADMINS', icon: 'group-line' },
      { name: 'permissions', label: 'Permissions', route: 'ADMIN_PERMISSIONS', icon: 'shield-line' },
      { name: 'settings', label: 'Paramètres app', route: 'ADMIN_SETTINGS', icon: 'settings-3-line' },
    ],
  },
];

const bottomNavItems: NavItem[] = [
  { name: 'dashboard', label: 'Accueil', route: 'ADMIN_DASHBOARD', icon: 'dashboard-line' },
  { name: 'nounus', label: 'Certifs', route: 'ADMIN_NOUNUS', icon: 'checkbox-circle-line', badge: true },
  { name: 'notifications', label: 'Notifs', route: 'ADMIN_NOTIFICATIONS', icon: 'notification-3-line', badgeType: 'notification' },
  { name: 'chats', label: 'Chats', route: 'ADMIN_CHATS', icon: 'chat-3-line', badgeType: 'message' },
  { name: 'profile', label: 'Profil', route: 'ADMIN_PROFILE', icon: 'user-3-line' },
];

const pendingCount = computed(() => adminStore.stats?.pendingNounus || 0);

const currentPageTitle = computed(() => {
  for (const group of navGroups) {
    const item = group.items.find((i) => isActive(i.route));
    if (item) return item.label;
  }
  if (isActive('ADMIN_PROFILE')) return 'Mon profil';
  if (isActive('ADMIN_NOTIFICATIONS')) return 'Notifications';
  if (isActive('ADMIN_USER_DETAIL')) return 'Détail utilisateur';
  if (isActive('ADMIN_CHAT_DETAIL')) return 'Conversation';
  return 'Administration';
});


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

const isActive = (routeName: string) => {
  return route.name === routeName;
};

const logout = async () => {
  const storageUtils = StorageUtils();
  await storageUtils.removeStore("nToken");
  await storageUtils.removeStore("nAdmin_Id");
  await storageUtils.removeStore("nUser_Id");
  await storageUtils.removeStore("nRole");
  location.assign("/choose-destination-to-start");
};

const onConversationsUpdated = () => {
  if (route.name !== 'ADMIN_CHATS' && !adminStore.chats.length) {
    adminStore.fetchChats(1, 20);
  }
};

onMounted(() => {
  adminStore.fetchStats();
  notificationStore.NCountChats();
  notificationStore.NCountNotification();
  socketService.on('conversationsUpdated', onConversationsUpdated);
});

onUnmounted(() => {
  socketService.off('conversationsUpdated', onConversationsUpdated);
});
</script>

<style scoped>
.shadow-soft {
  box-shadow: 4px 0 24px rgba(247, 124, 61, 0.06);
}
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
