<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6">
    <!-- Mark all as read -->
    <div v-if="notifications.length > 0 && hasUnreadNotifications()" class="flex justify-end mb-3">
      <button
        @click="markAllAsRead"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 font-love text-xs font-medium transition-colors"
      >
        <i class="ri ri-check-double-line" style="font-size: 16px;"></i>
        Tout marquer comme lu
      </button>
    </div>
    <!-- Loading -->
    <div v-if="loading && !notifications.length" class="space-y-3">
      <div v-for="i in 5" :key="i" class="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
        <div class="flex gap-3">
          <div class="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded-lg w-1/2"></div>
            <div class="h-3 bg-gray-200 rounded-lg w-3/4"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications list -->
    <div v-else-if="notifications.length > 0" class="space-y-3">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        :class="[
          'bg-white rounded-2xl border p-4 shadow-sm transition-all cursor-pointer hover:shadow-md',
          notif.isRead ? 'border-rose-50' : 'border-rose-200 bg-rose-50/30'
        ]"
        @click="handleNotificationClick(notif)"
      >
        <div class="flex items-start gap-3">
          <div class="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
            <i class="ri" :class="getNotificationIcon(notif.type)" style="font-size: 18px; color: #f43f5e;"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <div class="text-sm font-semibold text-gray-900 font-love">
                {{ notif.title || getNotificationTitle(notif.type) }}
              </div>
              <div class="text-xs text-gray-400 font-love flex-shrink-0">
                {{ formatDate(notif.createdAt) }}
              </div>
            </div>
            <p class="text-sm text-gray-600 font-love mt-0.5">{{ notif.message }}</p>
            <div v-if="getSenderName(notif)" class="text-xs text-gray-400 font-love mt-1">
              par {{ getSenderName(notif) }}
            </div>
          </div>
          <span v-if="!notif.isRead" class="h-2 w-2 rounded-full bg-rose-400 flex-shrink-0 mt-1"></span>
        </div>
      </div>

      <!-- Load more button -->
      <div v-if="hasNextPage" class="flex justify-center mt-6">
        <button
          @click="loadMore"
          :disabled="isFetchingNextPage"
          class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-500 font-love text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="isFetchingNextPage" class="ri ri-loader-4-line animate-spin" style="font-size: 18px;"></i>
          <i v-else class="ri ri-add-line" style="font-size: 18px;"></i>
          {{ isFetchingNextPage ? 'Chargement...' : 'Charger plus' }}
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl">
      <div class="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
        <i class="ri ri-notification-3-line text-rose-300" style="font-size: 32px;"></i>
      </div>
      <p class="text-sm text-gray-900 font-love font-semibold">Aucune notification</p>
      <p class="text-xs text-gray-500 font-love mt-1">Vos notifications apparaîtront ici</p>
    </div>

    <!-- Error -->
    <div v-if="error" class="mt-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 20px;"></i>
      <p class="text-sm text-red-600 font-love">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { StorageUtils } from '@/utils/store.utils';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { useNotificationStore } from '@/stores/notificationStore';
import axios from 'axios';
import { usePullToRefresh } from '@/composables/usePullToRefresh';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/features/notifications/hooks/useNotifications';
import { getUserId } from '@/utils/helpers.utils';

const router = useRouter();
const notificationStore = useNotificationStore();

// TanStack Query for notifications
const params = ref({ page: 1, limit: 20, userId: undefined as string | undefined });
const { 
  data: notificationsData, 
  isLoading: notificationsLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage
} = useNotifications(params);
const { mutate: markAsReadMutation } = useMarkAsRead();
const { mutate: markAllAsReadMutation } = useMarkAllAsRead();

const notifications = computed(() => {
  const pages = notificationsData.value?.pages || [];
  return pages.flatMap((page: any) => Array.isArray(page) ? page : (page?.data || []));
});

const loading = computed(() => notificationsLoading.value);
const error = ref<string | null>(null);

const loadMore = () => {
  if (hasNextPage.value && !isFetchingNextPage.value) {
    fetchNextPage();
  }
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'JOBS': return 'ri-briefcase-line';
    case 'CANDIDATURE': return 'ri-file-list-2-line';
    case 'ABONNEMENT': return 'ri-checkbox-circle-line';
    case 'PAIEMENT': return 'ri-wallet-line';
    case 'CONTRAT': return 'ri-file-lines-1';
    case 'PROPOSITION': return 'ri-hand-heart-line';
    case 'MESSAGE': return 'ri-chat-3-line';
    case 'CERTIFICATION': return 'ri-verified-badge-line';
    case 'RESTRICTION': return 'ri-error-warning-line';
    default: return 'ri-notification-3-line';
  }
};

const getNotificationTitle = (type: string) => {
  switch (type) {
    case 'JOBS': return 'Nouvelle offre';
    case 'CANDIDATURE': return 'Nouvelle candidature';
    case 'ABONNEMENT': return 'Abonnement';
    case 'PAIEMENT': return 'Paiement';
    case 'CONTRAT': return 'Contrat';
    case 'PROPOSITION': return 'Proposition';
    case 'MESSAGE': return 'Message';
    case 'CERTIFICATION': return 'Certification';
    case 'RESTRICTION': return 'Restriction';
    default: return 'Notification';
  }
};

const getNotificationRoute = (notif: any): string => {
  const tolinkId = notif.tolinkId || notif.tolink_id;
  switch (notif.type) {
    case 'JOBS':
      return tolinkId ? `/jobs/${tolinkId}` : '/jobs';
    case 'CANDIDATURE':
      return tolinkId ? `/jobs/${tolinkId}` : '/jobs/my-jobs';
    case 'ABONNEMENT':
      return '/subscription';
    case 'PAIEMENT':
      return '/subscription';
    case 'CONTRAT':
      return '/contracts';
    case 'PROPOSITION':
      return tolinkId ? `/chats/${tolinkId}` : '/chats';
    case 'MESSAGE':
      return tolinkId ? `/chats/${tolinkId}` : '/chats';
    case 'CERTIFICATION':
      return tolinkId ? `/profil/${tolinkId}` : '/profil';
    case 'RESTRICTION':
      return '/settings';
    default:
      return '/notifications';
  }
};

const markAsRead = async (notifId: number) => {
  try {
    markAsReadMutation(notifId, {
      onSuccess: () => {
        if (notificationStore.state.countNotification > 0) {
          notificationStore.state.countNotification -= 1;
        }
      },
    });
  } catch (e) {
    // silent fail
  }
};

const markAllAsRead = async () => {
  try {
    markAllAsReadMutation(undefined, {
      onSuccess: () => {
        notificationStore.state.countNotification = 0;
      },
    });
  } catch (e) {
    // silent fail
  }
};

const handleNotificationClick = async (notif: any) => {
  if (!notif.isRead) {
    await markAsRead(notif.id);
  }
  const route = getNotificationRoute(notif);
  router.push(route);
};

const hasUnreadNotifications = () => notifications.value.some(n => !n.isRead);

const getSenderName = (notif: any) => {
  const sender = notif.sender || notif.profil;
  if (!sender) return '';
  if (sender.fullname) return sender.fullname;
  if (sender.nounus?.[0]?.fullname) return sender.nounus[0].fullname;
  if (sender.parents?.[0]?.fullname) return sender.parents[0].fullname;
  return sender.email?.split('@')[0] || '';
};

const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

onMounted(async () => {
  const userId = await getUserId();
  if (userId) {
    params.value.userId = userId;
  }
});

onUnmounted(() => {
  notificationStore.NCountNotification();
});
</script>
