<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-anton text-xl text-gray-900">Conversations</h2>
        <p class="text-sm text-gray-500 font-love mt-1">
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-secondary"></span>
            {{ adminStore.chatsTotal }} conversation(s) — Répondez en tant que nounu
          </span>
        </p>
      </div>
      <div class="relative">
        <i class="ri ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style="font-size: 16px;"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une conversation..."
          class="text-sm font-love border border-primary/10 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all w-full sm:w-64"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading && !adminStore.chats.length" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-secondary border-t-transparent"></div>
    </div>

    <!-- Conversations as cards -->
    <div v-else-if="filteredChats.length > 0" class="space-y-3">
      <div
        v-for="room in filteredChats"
        :key="room.id"
        class="bg-white rounded-2xl border border-primary/10 overflow-hidden hover:border-secondary/30 transition-all shadow-sm"
      >
        <button
          @click="goToDetail(room.id)"
          class="w-full flex items-center gap-4 px-4 sm:px-5 py-4 text-left hover:bg-secondary/5 transition-colors"
        >
          <div class="flex -space-x-2 flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center border-2 border-white overflow-hidden">
              <img v-if="getNounuAvatar(room)" :src="getNounuAvatar(room)" alt="" class="h-full w-full object-cover" />
              <span v-else class="font-anton text-xs text-secondary">{{ getInitials(getNounuUser(room)) }}</span>
            </div>
            <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-white overflow-hidden">
              <img v-if="getParentAvatar(room)" :src="getParentAvatar(room)" alt="" class="h-full w-full object-cover" />
              <span v-else class="font-anton text-xs text-primary">{{ getInitials(getParentUser(room)) }}</span>
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <div class="text-sm font-semibold text-gray-900 font-love truncate">
                {{ getNounuName(room) }} & {{ getParentName(room) }}
              </div>
              <div class="text-xs text-gray-400 font-love flex-shrink-0">{{ formatDate(room.messages?.[0]?.createdAt) }}</div>
            </div>
            <div class="flex items-center justify-between gap-2 mt-0.5">
              <div
                class="text-sm text-gray-500 font-love truncate"
                :class="{ 'font-semibold text-gray-900': getUnreadCount(room) > 0 }"
              >
                {{ room.messages?.[0]?.content || 'Aucun message' }}
              </div>
              <span
                v-if="getUnreadCount(room) > 0"
                class="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[11px] font-love font-bold text-white bg-primary"
              >
                {{ getUnreadCount(room) }}
              </span>
            </div>
          </div>
        </button>
      </div>

      <!-- Load more -->
      <div v-if="adminStore.chats.length < adminStore.chatsTotal" class="flex items-center justify-center pt-2">
        <button @click="loadMore" :disabled="adminStore.isLoading" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-secondary bg-white border border-primary/10 hover:bg-secondary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <i class="ri ri-add-line" style="font-size: 16px;"></i>
          Voir plus
        </button>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-3xl">
      <div class="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
        <i class="ri ri-chat-3-line text-secondary/50" style="font-size: 32px;"></i>
      </div>
      <p class="text-sm text-gray-900 font-love font-semibold">Aucune conversation trouvée</p>
      <p class="text-xs text-gray-500 font-love mt-1">Les messages apparaîtront ici</p>
    </div>

    <div v-if="adminStore.error" class="bg-red-50 border border-red-200 rounded-3xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 24px;"></i>
      <p class="text-sm text-red-600 font-love">{{ adminStore.error }}</p>
    </div>
  </div>

  <ConfirmModal
    :show="showConfirm"
    :title="confirmTitle"
    :message="confirmMessage"
    :icon="confirmIcon"
    :iconBgClass="confirmIconBg"
    :iconClass="confirmIconClass"
    :confirmLabel="confirmLabel"
    :confirmBgClass="confirmBgClass"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/admin.store';
import { socketService } from '@/services/socket.services';
import { ConfirmModal } from '@/components/ui';
import { useConfirmModal } from '@/composables/useConfirmModal';
import { buildImageUrl, findMediaByType } from '@/utils/media.utils';

const router = useRouter();
const adminStore = useAdminStore();
const { showConfirm, confirmTitle, confirmMessage, confirmIcon, confirmIconBg, confirmIconClass, confirmLabel, confirmBgClass, requestConfirm, onConfirm, onCancel } = useConfirmModal();
const currentPage = ref(1);
const limit = 20;
const expandedRoomId = ref<number | null>(null);
const searchQuery = ref('');
const messageInput = ref('');
const isProposition = ref(false);
const propositionExpired = ref('');

const goToDetail = (id: number) => {
  router.push({ name: 'ADMIN_CHAT_DETAIL', params: { id } });
};

const getNounuUser = (room: any) => {
  if (room.sender?.nounus?.length > 0) return room.sender;
  return room.receiver;
};

const getNounuName = (room: any) => {
  const nounu = getNounuUser(room);
  return getUserName(nounu);
};

const getParentUser = (room: any) => {
  if (room.sender?.parents?.length > 0) return room.sender;
  return room.receiver;
};

const getParentName = (room: any) => {
  const parent = getParentUser(room);
  return getUserName(parent);
};

const filteredChats = computed(() => {
  if (!searchQuery.value) return adminStore.chats;
  const q = searchQuery.value.toLowerCase();
  return adminStore.chats.filter((room: any) => {
    const nounuName = getNounuName(room).toLowerCase();
    const parentName = getParentName(room).toLowerCase();
    const lastMsg = (room.messages?.[0]?.content || '').toLowerCase();
    return nounuName.includes(q) || parentName.includes(q) || lastMsg.includes(q);
  });
});

const toggleRoom = (id: number) => {
  if (expandedRoomId.value === id) {
    expandedRoomId.value = null;
  } else {
    expandedRoomId.value = id;
    adminStore.fetchChat(id);
  }
};

const handleDeleteChat = (id: number) => {
  requestConfirm('Voulez-vous vraiment supprimer cette conversation ?', async () => {
    try {
      await adminStore.removeChat(id);
      expandedRoomId.value = null;
      adminStore.currentChat = null;
      adminStore.fetchChats(currentPage.value, limit);
    } catch { /* error in store */ }
  }, { icon: 'delete-bin-line', iconBgClass: 'bg-red-50', iconClass: 'text-red-500', confirmBgClass: 'bg-red-500 hover:bg-red-600 shadow-red-200' });
};

const handleSendMessage = async (roomId: number) => {
  const content = messageInput.value.trim();
  if (!content) return;
  try {
    await adminStore.sendMessageAsNounu(roomId, content, isProposition.value || undefined, propositionExpired.value || undefined);
    messageInput.value = '';
    isProposition.value = false;
    propositionExpired.value = '';
  } catch { /* error in store */ }
};

const handleProposalResponse = async (roomId: number, messageId: number, status: 'Accepted' | 'Refused') => {
  try {
    await adminStore.updateProposalStatus(roomId, messageId, status);
  } catch { /* error in store */ }
};

const getInitials = (user: any) => {
  const name = user?.email || user?.slug || '';
  return name.substring(0, 2).toUpperCase();
};

const getUserAvatar = (user: any): string => {
  const medias = (user?.medias || []).filter((m: any) => !m.deletedAt);
  const photo = findMediaByType(medias, 'photo_profil') || findMediaByType(medias, 'profil') || medias.find((m: any) => m.path || m.originalUrl);
  return buildImageUrl(photo?.path || photo?.originalUrl);
};

const getNounuAvatar = (room: any) => getUserAvatar(getNounuUser(room));
const getParentAvatar = (room: any) => getUserAvatar(getParentUser(room));

const getUserName = (user: any) => {
  if (user?.nounus?.[0]?.fullname) return user.nounus[0].fullname;
  if (user?.parents?.[0]?.fullname) return user.parents[0].fullname;
  return user?.email || 'Inconnu';
};

const getUserType = (user: any) => {
  if (user?.nounus?.length > 0) return 'Nounu';
  if (user?.parents?.length > 0) return 'Parent';
  return 'Utilisateur';
};

const getUnreadCount = (room: any) => {
  if (!room.unreadCounts) return 0;
  const nounu = getNounuUser(room);
  if (!nounu?.id) return 0;
  return room.unreadCounts
    .filter((uc: any) => uc.userId === nounu.id)
    .reduce((sum: number, uc: any) => sum + (uc.count || 0), 0);
};

const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};

const formatTime = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const getProposalBadgeClass = (status: string) => {
  switch (status) {
    case 'Accepted': return 'bg-green-50 text-green-700';
    case 'Refused': return 'bg-red-50 text-red-700';
    default: return 'bg-amber-50 text-amber-700';
  }
};

const getProposalCardClass = (status: string) => {
  switch (status) {
    case 'Accepted': return 'bg-green-50 border-green-200';
    case 'Refused': return 'bg-red-50 border-red-200';
    default: return 'bg-amber-50 border-amber-200';
  }
};

const getProposalDotClass = (status: string) => {
  switch (status) {
    case 'Accepted': return 'bg-green-500';
    case 'Refused': return 'bg-red-500';
    default: return 'bg-amber-500';
  }
};

const getProposalLabel = (status: string) => {
  switch (status) {
    case 'Accepted': return 'Acceptée';
    case 'Refused': return 'Refusée';
    default: return 'En attente';
  }
};

const loadMore = () => { currentPage.value++; adminStore.fetchChats(currentPage.value, limit, true); };

let conversationsUpdateTimer: ReturnType<typeof setTimeout> | null = null;
const onConversationsUpdated = () => {
  if (conversationsUpdateTimer) clearTimeout(conversationsUpdateTimer);
  conversationsUpdateTimer = setTimeout(() => {
    adminStore.fetchChats(1, currentPage.value * limit);
    conversationsUpdateTimer = null;
  }, 3000);
};

onMounted(() => {
  adminStore.fetchChats(currentPage.value, limit);
  socketService.on('conversationsUpdated', onConversationsUpdated);
});

onUnmounted(() => {
  if (conversationsUpdateTimer) clearTimeout(conversationsUpdateTimer);
  socketService.off('conversationsUpdated', onConversationsUpdated);
});
</script>
