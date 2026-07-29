import { onMounted, onUnmounted, ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { socketService } from '@/services/socket.services';
import { pushNotificationService } from '@/services/pushNotification.services';
import { useNotificationStore } from '@/stores/notificationStore';
import { StorageUtils } from '@/utils/store.utils';

export interface RealtimeNotification {
  id: number;
  type: string;
  message: string;
  tolinkId?: string;
  isRead?: boolean;
  createdAt?: string;
  [key: string]: any;
}

export interface RealtimeMessage {
  id: number;
  roomId: number;
  senderId: string;
  content: string;
  [key: string]: any;
}

export function useRealtimeNotifications() {
  const router = useRouter();
  const notificationStore = useNotificationStore();

  const unreadMessages = ref(0);
  const unreadNotifications = ref(0);
  const lastNotification = ref<RealtimeNotification | null>(null);
  const lastMessage = ref<RealtimeMessage | null>(null);

  let initialized = false;

  let onNewNotification: (data: RealtimeNotification) => void;
  let onAllCountNotifications: (count: number) => void;
  let onUnreadCountsNotification: (count: number) => void;
  let onNewMessage: (data: RealtimeMessage) => void;
  let onNewMessageNotify: (data: RealtimeMessage) => void;
  let onUnreadCounts: (count: number) => void;
  let onUnreadUpdated: (data: { roomId: number; unreadCount: number; totalUnread: number }) => void;
  let onConversationsUpdated: () => void;

  const handleNotificationNavigation = (data: { type: string; screen?: string; [key: string]: any }) => {
    if (data.screen === 'NOTIFICATIONS') {
      router.push({ name: 'NOTIFICATIONS' });
    } else if (data.screen === 'CHAT_MESSAGE_DETAIL' && data.roomId) {
      router.push({ name: 'CHAT_MESSAGE_DETAIL', params: { id: data.roomId } });
    }
  };

  const setupSocketListeners = async () => {
    const userId = (await StorageUtils().getStore('nUser_Id'))?.value;
    if (!userId) return;

    onNewNotification = (data: RealtimeNotification) => {
      lastNotification.value = data;
      unreadNotifications.value += 1;
      notificationStore.state.countNotification = unreadNotifications.value;

      if (!socketService.isConnected()) {
        pushNotificationService.showLocalNotification('BabyNounu', data.message, {
          type: data.type,
          screen: 'NOTIFICATIONS',
          notificationId: data.id,
        });
      }
    };

    onAllCountNotifications = (count: number) => {
      unreadNotifications.value = count;
      notificationStore.state.countNotification = count;
    };

    onUnreadCountsNotification = (count: number) => {
      unreadNotifications.value = count;
      notificationStore.state.countNotification = count;
    };

    onNewMessage = (data: RealtimeMessage) => {
      lastMessage.value = data;
    };

    onNewMessageNotify = (data: RealtimeMessage) => {
      lastMessage.value = data;
    };

    onUnreadCounts = (count: number) => {
      unreadMessages.value = count;
      notificationStore.state.countMessage = count;
    };

    onUnreadUpdated = (data: { roomId: number; unreadCount: number; totalUnread: number }) => {
      unreadMessages.value = data.totalUnread;
      notificationStore.state.countMessage = data.totalUnread;
    };

    onConversationsUpdated = () => {
      notificationStore.NCountChats();
    };

    await socketService.on('newNotification', onNewNotification);
    await socketService.on('allCountNotificationsByReceiverId', onAllCountNotifications);
    await socketService.on('unreadCountsNotification', onUnreadCountsNotification);
    await socketService.on('newMessage', onNewMessage);
    await socketService.on('newMessageNotify', onNewMessageNotify);
    await socketService.on('unreadCounts', onUnreadCounts);
    await socketService.on('unreadUpdated', onUnreadUpdated);
    await socketService.on('conversationsUpdated', onConversationsUpdated);

    socketService.emit('getUnreadCounts', userId);
    socketService.emit('getAllCountNotificationsByReceiverId', userId);
  };

  const init = async () => {
    if (initialized) return;
    initialized = true;

    const token = (await StorageUtils().getStore('nToken'))?.value;
    if (!token) return;

    await pushNotificationService.init();
    pushNotificationService.onNotification(handleNotificationNavigation);

    await setupSocketListeners();

    notificationStore.NCountChats();
    notificationStore.NCountNotification();
  };

  const cleanup = () => {
    socketService.off('newNotification', onNewNotification);
    socketService.off('allCountNotificationsByReceiverId', onAllCountNotifications);
    socketService.off('unreadCountsNotification', onUnreadCountsNotification);
    socketService.off('newMessage', onNewMessage);
    socketService.off('newMessageNotify', onNewMessageNotify);
    socketService.off('unreadCounts', onUnreadCounts);
    socketService.off('unreadUpdated', onUnreadUpdated);
    socketService.off('conversationsUpdated', onConversationsUpdated);
    pushNotificationService.clearHandlers();
  };

  onMounted(() => {
    init();
  });

  onUnmounted(() => {
    cleanup();
  });

  return {
    unreadMessages,
    unreadNotifications,
    lastNotification,
    lastMessage,
    init,
    cleanup,
  };
}
