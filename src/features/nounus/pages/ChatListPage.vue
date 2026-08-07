<template>
  <div class="max-w-3xl mx-auto">
    <!-- Sticky header with search -->
    <div class="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-rose-50 px-4 sm:px-6 py-3">
      <div class="flex items-center justify-between gap-4 mb-3">
        <div class="flex items-center gap-2">
          <h1 class="font-anton text-xl text-gray-900">Messages</h1>
          <span class="font-love text-xs text-gray-400">{{ chatStore.conversations.length }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 font-love text-xs font-medium">
            <i class="ri ri-mail-unread-line" style="font-size: 14px;"></i>
            {{ totalUnread }} non lu{{ totalUnread > 1 ? 's' : '' }}
          </span>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 font-love text-xs font-medium">
            <i class="ri ri-mail-open-line" style="font-size: 14px;"></i>
            {{ totalRead }} lu{{ totalRead > 1 ? 's' : '' }}
          </span>
        </div>
      </div>
      <div class="relative">
        <i class="ri ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style="font-size: 16px;"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une conversation..."
          class="w-full text-sm font-love bg-rose-50/50 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="chatStore.isLoading && !chatStore.conversations.length" class="px-4 sm:px-6 pt-4 space-y-3">
      <div v-for="i in 8" :key="i" class="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
        <div class="flex gap-3 items-center">
          <div class="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded-lg w-1/3"></div>
            <div class="h-3 bg-gray-200 rounded-lg w-2/3"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conversations list -->
    <div v-else-if="filteredConversations.length > 0" class="px-4 sm:px-6 pt-4 space-y-3">
      <div
        v-for="room in filteredConversations"
        :key="room.id"
        @click="goToConversation(room.id)"
        :class="[
          'flex items-center gap-3 p-4 rounded-2xl shadow-sm transition-all cursor-pointer',
          getUnreadCount(room) > 0 ? 'bg-white border border-rose-100 hover:border-rose-200' : 'bg-white hover:bg-rose-50/50'
        ]"
      >
        <div class="relative flex-shrink-0">
          <div class="h-12 w-12 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center overflow-hidden">
            <img v-if="getOtherUserAvatar(room)" :src="getOtherUserAvatar(room)" alt="" class="h-full w-full object-cover" />
            <span v-else class="font-anton text-sm text-rose-400">{{ getInitials(room) }}</span>
          </div>
          <span
            v-if="isOnline(room)"
            class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"
          ></span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2">
            <div class="text-sm font-love font-semibold text-gray-900 truncate">
              {{ getOtherUserName(room) }}
            </div>
            <div class="text-xs font-love flex-shrink-0" :class="getUnreadCount(room) > 0 ? 'text-rose-400 font-semibold' : 'text-gray-400'">
              {{ formatChatTime(room.messages?.[0]?.createdAt) }}
            </div>
          </div>
          <div class="flex items-center justify-between gap-2 mt-0.5">
            <div
              class="text-sm font-love truncate"
              :class="getUnreadCount(room) > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'"
            >
              {{ room.messages?.[0]?.content || 'Aucun message' }}
            </div>
            <span
              v-if="getUnreadCount(room) > 0"
              class="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[11px] font-love font-bold text-white bg-rose-400 flex-shrink-0"
            >
              {{ getUnreadCount(room) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-20 px-4">
      <div class="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
        <i class="ri ri-chat-3-line text-rose-300" style="font-size: 40px;"></i>
      </div>
      <p class="text-sm text-gray-900 font-love font-semibold">Aucune conversation</p>
      <p class="text-xs text-gray-500 font-love mt-1">Vos messages apparaîtront ici</p>
    </div>

    <!-- Error -->
    <div v-if="chatStore.error" class="mt-4 mx-4 sm:mx-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 20px;"></i>
      <p class="text-sm text-red-600 font-love">{{ chatStore.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chatStore';
import { socketService } from '@/services/socket.services';
import { StorageUtils } from '@/utils/store.utils';
import { buildImageUrl, findMediaByType } from '@/utils/media.utils';
import axios from 'axios';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';

const router = useRouter();
const chatStore = useChatStore();
const searchQuery = ref('');
const currentUserId = ref<string | null>(null);
const userRole = ref<string | null>(null);

const filteredConversations = computed(() => {
  if (!searchQuery.value) return chatStore.conversations;
  const q = searchQuery.value.toLowerCase();
  return chatStore.conversations.filter((room: any) => {
    const name = getOtherUserName(room).toLowerCase();
    const lastMsg = (room.messages?.[0]?.content || '').toLowerCase();
    return name.includes(q) || lastMsg.includes(q);
  });
});

const goToConversation = (id: number) => {
  router.push({ name: 'CHAT_MESSAGE_DETAIL', params: { id } });
};

const getCurrentUserId = () => currentUserId.value;

const getOtherUser = (room: any) => {
  const currentId = getCurrentUserId();
  if (room.sender?.id?.toString() === currentId) return room.receiver;
  if (room.receiver?.id?.toString() === currentId) return room.sender;
  return room.receiver || room.sender;
};

const getOtherUserName = (room: any) => {
  const user = getOtherUser(room);
  if (user?.nounus?.[0]?.fullname) return user.nounus[0].fullname;
  if (user?.parents?.[0]?.fullname) return user.parents[0].fullname;
  return user?.email || 'Utilisateur';
};

const getInitials = (room: any) => {
  const name = getOtherUserName(room);
  return name.substring(0, 2).toUpperCase();
};

const getUnreadCount = (room: any) => {
  if (!room.unreadCounts) return 0;
  const currentId = getCurrentUserId();
  return room.unreadCounts
    .filter((uc: any) => uc.userId === currentId)
    .reduce((sum: number, uc: any) => sum + (uc.count || 0), 0);
};

const totalUnread = computed(() => {
  return chatStore.conversations.reduce((sum: number, room: any) => sum + getUnreadCount(room), 0);
});

const totalRead = computed(() => {
  return chatStore.conversations.length - totalUnread.value;
});

const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};

const formatChatTime = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  if (isToday) {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  if (isYesterday) {
    return 'Hier';
  }
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
};

const getOtherUserAvatar = (room: any) => {
  const user = getOtherUser(room);
  const medias = (user?.medias || []).filter((m: any) => !m.deletedAt);
  const photo = findMediaByType(medias, 'photo_profil') || findMediaByType(medias, 'profil') || medias.find((m: any) => m.path || m.originalUrl);
  return buildImageUrl(photo?.path || photo?.originalUrl);
};

const isOnline = (room: any) => {
  const user = getOtherUser(room);
  return user?.status === 'online' || user?.isOnline === true;
};

const onConversationsUpdated = () => {
  chatStore.fetchConversations();
};

onMounted(async () => {
  const userIdResult = await StorageUtils().getStore('nUser_Id');
  currentUserId.value = userIdResult?.value || null;
  
  const roleResult = await StorageUtils().getStore('nRole');
  userRole.value = roleResult?.value || null;

  // Check subscription for parents
  if (userRole.value === 'parent' && currentUserId.value) {
    try {
      const nToken = await StorageUtils().getStore('nToken');
      const response = await axios.get(URL_API_ROUTE.ABONNEMENT_USER, {
        headers: { Authorization: `Bearer ${nToken?.value}` }
      });
      const subscription = response.data;
      const hasActiveSubscription = subscription &&
        subscription.status === 'active' &&
        (subscription.expiresAt === null || new Date(subscription.expiresAt) > new Date());
      if (!hasActiveSubscription) {
        router.push({ name: 'PackSubscrible' });
        return;
      }
    } catch (error) {
      // Fail closed: if subscription check fails, redirect to subscription page
      // (prevents paywall bypass via network error manipulation)
      console.error('Subscription check failed:', error);
      router.push({ name: 'PackSubscrible' });
      return;
    }
  }

  await chatStore.fetchConversations();

  socketService.on('conversationsUpdated', onConversationsUpdated);
});

onUnmounted(() => {
  socketService.off('conversationsUpdated', onConversationsUpdated);
});
</script>
