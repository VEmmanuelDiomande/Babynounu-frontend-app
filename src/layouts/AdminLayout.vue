<template>
  <div class="h-screen overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/10 flex flex-col relative">

    <!-- Sidebar drawer -->
    <AdminSidebar
      :open="sidebarOpen"
      :nav-groups="navGroups"
      :pending-count="pendingCount"
      :chats-total-unread="adminStore.chatsTotalUnread"
      :notification-count="notificationStore.state.countNotification"
      @close="sidebarOpen = false"
      @logout="logout"
    />

    <!-- Main content -->
    <div :class="['flex-1 flex flex-col min-w-0 min-h-0', isFullPage ? 'pb-0' : 'pb-20']">
      <!-- Header -->
      <AdminHeader
        :title="currentPageTitle"
        :pending-count="pendingCount"
        :hidden="isFullPage"
        @menu="sidebarOpen = !sidebarOpen"
      />

      <!-- Page content -->
      <main data-scroll-container :class="['flex-1 min-h-0', isFullPage ? 'overflow-hidden p-0 pt-0' : 'overflow-y-auto pt-20 p-4']">
        <div :class="isFullPage ? 'h-full' : 'min-h-full pt-10'">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </main>
    </div>

    <!-- Bottom navigation -->
    <AdminBottomNav
      :items="bottomNavItems"
      :pending-count="pendingCount"
      :chats-total-unread="adminStore.chatsTotalUnread"
      :notification-count="notificationStore.state.countNotification"
      :visible="!isFullPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAdminStore } from '@/stores/admin.store';
import { useNotificationStore } from '@/stores/notificationStore';
import { socketService } from '@/services/socket.services';
import { StorageUtils } from '@/utils/store.utils';
import { AdminHeader, AdminSidebar, AdminBottomNav } from '@/components/ui';
import type { NavItem, NavGroup } from '@/components/ui/AdminSidebar/admin-nav.types';

const route = useRoute();
const adminStore = useAdminStore();
const notificationStore = useNotificationStore();

const sidebarOpen = ref(false);
const isFullPage = computed(() => route.name === 'ADMIN_CHAT_DETAIL');

const navGroups: NavGroup[] = [
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

const isActive = (routeName: string) => route.name === routeName;

const logout = async () => {
  const storageUtils = StorageUtils();
  await storageUtils.removeStore("nToken");
  await storageUtils.removeStore("nAdmin_Id");
  await storageUtils.removeStore("nUser_Id");
  await storageUtils.removeStore("nRole");
  location.assign("/choose-destination-to-start");
};

let conversationsUpdateTimer: ReturnType<typeof setTimeout> | null = null;
const onConversationsUpdated = () => {
  if (route.name === 'ADMIN_CHATS' || adminStore.chats.length) return;
  if (conversationsUpdateTimer) clearTimeout(conversationsUpdateTimer);
  conversationsUpdateTimer = setTimeout(() => {
    adminStore.fetchChats(1, 20);
    conversationsUpdateTimer = null;
  }, 3000);
};

onMounted(async () => {
  adminStore.fetchStats();
  const nToken = (await StorageUtils().getStore('nToken'))?.value;
  if (nToken) {
    notificationStore.NCountChats();
    notificationStore.NCountNotification();
  }
  socketService.on('conversationsUpdated', onConversationsUpdated);
});

onUnmounted(() => {
  if (conversationsUpdateTimer) clearTimeout(conversationsUpdateTimer);
  socketService.off('conversationsUpdated', onConversationsUpdated);
});
</script>
