<template>
  <div class="max-w-3xl mx-auto flex flex-col h-full">
    <!-- Loading -->
    <div v-if="adminStore.isLoading && !adminStore.currentChat" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-rose-200 border-t-rose-400"></div>
    </div>

    <!-- Chat -->
    <div v-else-if="adminStore.currentChat" class="flex-1 flex flex-col min-h-0">
      <!-- Header -->
      <ChatHeader
        :title="`${getNounuName()} & ${getParentName()}`"
        subtitle="Nounu & Parent"
        :avatarUrl="getOtherUserAvatar()"
        :initials="getInitials()"
        :online="isOnline()"
        @back="goBack"
      >
        <template #actions>
          <button
            @click="handleDeleteChat"
            class="h-9 w-9 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors flex-shrink-0 text-red-500"
            title="Supprimer la conversation"
          >
            <i class="ri ri-delete-bin-line" style="font-size: 18px;"></i>
          </button>
        </template>
      </ChatHeader>

      <!-- Messages -->
      <div
        class="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-1"
        ref="messagesContainer"
        style="background-color: #efe5dc; background-image: radial-gradient(circle at 25% 25%, rgba(0,0,0,0.02) 1px, transparent 1px); background-size: 24px 24px;"
      >
        <template v-for="(msg, i) in adminStore.currentChat?.messages || []" :key="msg.id">
          <!-- Date separator -->
          <div v-if="showDateSeparator(adminStore.currentChat?.messages || [], i)" class="flex items-center justify-center my-3">
            <span class="px-3 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-xs font-love font-medium text-gray-500 shadow-sm">
              {{ getDateSeparatorLabel(msg.createdAt) }}
            </span>
          </div>

          <!-- Message bubble -->
          <ChatMessageBubble
            :msg="msg"
            :isMyMessage="isMyMessage(msg)"
            :showSenderName="true"
            :senderName="getSenderDisplayName(msg)"
            :showProposalActions="isMyMessage(msg)"
            @proposalResponse="handleProposalResponse"
          />
        </template>

        <!-- Empty state -->
        <ChatEmptyState v-if="!adminStore.currentChat?.messages?.length" />
      </div>

      <!-- Error -->
      <div v-if="adminStore.error" class="bg-red-50 border-t border-red-100 p-2.5 flex items-center gap-3 flex-shrink-0">
        <i class="ri ri-close-circle-line text-red-500" style="font-size: 18px;"></i>
        <p class="text-xs text-red-600 font-love">{{ adminStore.error }}</p>
      </div>

      <!-- Input area -->
      <div class="px-3 sm:px-4 py-2.5 bg-white border-t border-rose-50 flex-shrink-0">
        <!-- Recording bar -->
        <div v-if="isRecording" class="flex items-center gap-3 px-3 py-2.5 bg-red-50/50 rounded-2xl">
          <button @click="cancelRecording" class="h-9 w-9 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0 text-red-500">
            <i class="ri ri-close-line" style="font-size: 20px;"></i>
          </button>
          <div class="flex-1 flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span class="text-sm font-love text-red-500 font-medium">Enregistrement...</span>
            <span class="text-sm font-anton text-gray-700 ml-auto">{{ formatRecordingTime(recordingTime) }}</span>
          </div>
          <button @click="stopAndSendRecording" class="h-9 w-9 rounded-full bg-rose-400 text-white hover:bg-rose-500 active:scale-90 transition-all flex items-center justify-center flex-shrink-0 shadow-sm">
            <i class="ri ri-send-2-fill" style="font-size: 18px;"></i>
          </button>
        </div>

        <!-- File preview bar -->
        <div v-if="pendingFile" class="flex items-center gap-3 mb-2 px-3 py-2 bg-rose-50/50 rounded-xl">
          <div class="h-9 w-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-rose-100">
            <i :class="getFileIcon(pendingFile.type)" class="text-rose-400" style="font-size: 18px;"></i>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-xs font-love font-medium text-gray-900 truncate">{{ pendingFile.name }}</div>
            <div class="text-[10px] font-love text-gray-400">{{ formatFileSize(pendingFile.size) }}</div>
          </div>
          <button @click="pendingFile = null" class="h-7 w-7 rounded-full hover:bg-rose-100 flex items-center justify-center transition-colors flex-shrink-0">
            <i class="ri ri-close-line text-gray-400" style="font-size: 16px;"></i>
          </button>
        </div>

        <!-- Normal input -->
        <div v-if="!isRecording" class="flex items-end gap-2">
          <button
            @click="!hasActiveProposition && (showPropositionDrawer = true)"
            :disabled="hasActiveProposition"
            :class="[
              'h-10 w-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0',
              hasActiveProposition
                ? 'opacity-30 cursor-not-allowed text-gray-400'
                : 'hover:bg-rose-50 text-gray-500'
            ]"
            :title="hasActiveProposition ? 'Une proposition est en attente' : 'Nouvelle proposition'"
          >
            <i class="ri ri-hand-heart-line" style="font-size: 22px;"></i>
          </button>
          <button @click="fileInput?.click()" class="h-10 w-10 rounded-full hover:bg-rose-50 flex items-center justify-center transition-colors flex-shrink-0 text-gray-500">
            <i class="ri ri-attachment-2" style="font-size: 22px;"></i>
          </button>
          <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" />
          <div class="flex-1 relative">
            <input
              v-model="messageInput"
              @keyup.enter="handleSendMessage"
              type="text"
              placeholder="Répondre en tant que nounu..."
              class="w-full text-sm font-love bg-rose-50/50 rounded-3xl px-4 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all"
            />
          </div>
          <button
            v-if="messageInput.trim() || pendingFile"
            @click="handleSendMessage"
            class="h-10 w-10 rounded-full bg-rose-400 text-white hover:bg-rose-500 active:scale-90 transition-all flex items-center justify-center flex-shrink-0 shadow-sm"
          >
            <i class="ri ri-send-2-fill" style="font-size: 20px;"></i>
          </button>
          <button
            v-else
            @click="startRecording"
            class="h-10 w-10 rounded-full bg-rose-400 text-white hover:bg-rose-500 active:scale-90 transition-all flex items-center justify-center flex-shrink-0 shadow-sm"
          >
            <i class="ri ri-mic-line" style="font-size: 20px;"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Not found -->
    <ChatNotFound v-else />

    <!-- Proposition Drawer -->
    <PropositionDrawer
      :show="showPropositionDrawer"
      subtitle="Envoyez une offre en tant que nounu"
      @close="showPropositionDrawer = false"
      @send="handlePropositionSend"
    />
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
import { ref, computed, onActivated, onDeactivated, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/admin.store';
import { socketService } from '@/services/socket.services';
import { buildImageUrl, findMediaByType } from '@/utils/media.utils';
import { ConfirmModal } from '@/components/ui';
import { useConfirmModal } from '@/composables/useConfirmModal';
import { ChatHeader, ChatMessageBubble, PropositionDrawer, ChatEmptyState, ChatNotFound } from '@/components/chat';
import { useChatUtils } from '@/composables/useChatUtils';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const { showConfirm, confirmTitle, confirmMessage, confirmIcon, confirmIconBg, confirmIconClass, confirmLabel, confirmBgClass, requestConfirm, onConfirm, onCancel } = useConfirmModal();

const messageInput = ref('');
const showPropositionDrawer = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const pendingFile = ref<File | null>(null);
const fileInput = ref<HTMLElement | null>(null);

// Voice recording
const isRecording = ref(false);
const recordingTime = ref(0);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const recordingTimer = ref<ReturnType<typeof setInterval> | null>(null);

const { showDateSeparator, getDateSeparatorLabel, getFileIcon, formatRecordingTime, formatFileSize } = useChatUtils();

const roomId = computed(() => Number(route.params.id));

const hasActiveProposition = computed(() => {
  const messages = adminStore.currentChat?.messages || [];
  const now = new Date();
  return messages.some((m: any) =>
    m.isProposition &&
    m.proposalStatus === 'Pending' &&
    (!m.propositionExpired || new Date(m.propositionExpired) > now)
  );
});

const getNounuUser = () => {
  const room = adminStore.currentChat;
  if (!room) return null;
  if (room.sender?.nounus?.length > 0) return room.sender;
  return room.receiver;
};

const getNounuName = () => {
  const nounu = getNounuUser();
  return getUserName(nounu);
};

const getParentUser = () => {
  const room = adminStore.currentChat;
  if (!room) return null;
  if (room.sender?.parents?.length > 0) return room.sender;
  return room.receiver;
};

const getParentName = () => {
  const parent = getParentUser();
  return getUserName(parent);
};

const getInitials = () => {
  const nounu = getNounuUser();
  const parent = getParentUser();
  const name = nounu?.nounus?.[0]?.fullname || parent?.parents?.[0]?.fullname || nounu?.email || parent?.email || '';
  return name.substring(0, 2).toUpperCase();
};

const getUserName = (user: any) => {
  if (user?.nounus?.[0]?.fullname) return user.nounus[0].fullname;
  if (user?.parents?.[0]?.fullname) return user.parents[0].fullname;
  if (user?.nounus?.length) return 'Nounu';
  if (user?.parents?.length) return 'Parent';
  return 'Inconnu';
};

const getSenderDisplayName = (msg: any) => {
  if (msg.sender) return getUserName(msg.sender);
  const nounu = getNounuUser();
  const parent = getParentUser();
  if (msg.senderId === nounu?.id) return getUserName(nounu);
  if (msg.senderId === parent?.id) return getUserName(parent);
  return 'Inconnu';
};

const getOtherUserAvatar = () => {
  const nounu = getNounuUser();
  const parent = getParentUser();
  const user = nounu || parent;
  const medias = (user?.medias || []).filter((m: any) => !m.deletedAt);
  const photo = findMediaByType(medias, 'photo_profil') || findMediaByType(medias, 'profil') || medias.find((m: any) => m.path || m.originalUrl);
  return buildImageUrl(photo?.path || photo?.originalUrl);
};

const isOnline = () => {
  const nounu = getNounuUser();
  const parent = getParentUser();
  const user = nounu || parent;
  return user?.status === 'online' || user?.isOnline === true;
};

const isMyMessage = (msg: any) => {
  return msg.senderId === getNounuUser()?.id;
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const handleSendMessage = async () => {
  const content = messageInput.value.trim();
  if (!content && !pendingFile.value) return;
  try {
    if (pendingFile.value) {
      await adminStore.sendMessageAsNounuWithFile(roomId.value, pendingFile.value, pendingFile.value.name, content || undefined);
      pendingFile.value = null;
    } else {
      await adminStore.sendMessageAsNounu(roomId.value, content, undefined, undefined, undefined);
    }
    messageInput.value = '';
    scrollToBottom();
  } catch { /* error in store */ }
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    pendingFile.value = target.files[0];
  }
  target.value = '';
};

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    audioChunks.value = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.value.push(e.data);
    };
    recorder.onstop = async () => {
      const blob = new Blob(audioChunks.value, { type: 'audio/webm' });
      const fileName = `voice-${Date.now()}.webm`;
      try {
        await adminStore.sendMessageAsNounuWithFile(roomId.value, blob, fileName);
        scrollToBottom();
      } catch { /* error in store */ }
      stream.getTracks().forEach((t) => t.stop());
    };
    recorder.start();
    mediaRecorder.value = recorder;
    isRecording.value = true;
    recordingTime.value = 0;
    recordingTimer.value = setInterval(() => {
      recordingTime.value++;
    }, 1000);
  } catch { /* mic permission denied */ }
};

const cancelRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.onstop = null;
    mediaRecorder.value.stop();
  }
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
  isRecording.value = false;
  recordingTime.value = 0;
  audioChunks.value = [];
};

const stopAndSendRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop();
  }
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
  isRecording.value = false;
  recordingTime.value = 0;
};

const handlePropositionSend = async (data: { content: string; montant?: number; periode?: string; expired?: string }) => {
  try {
    await adminStore.sendMessageAsNounu(roomId.value, data.content, true, data.expired, data.montant, data.periode);
    showPropositionDrawer.value = false;
    scrollToBottom();
  } catch { /* error in store */ }
};

const handleProposalResponse = async (messageId: number, status: 'Accepted' | 'Refused') => {
  try {
    await adminStore.updateProposalStatus(roomId.value, messageId, status);
  } catch { /* error in store */ }
};

const handleDeleteChat = () => {
  requestConfirm('Voulez-vous vraiment supprimer cette conversation ?', async () => {
    try {
      await adminStore.removeChat(roomId.value);
      router.push({ name: 'ADMIN_CHATS' });
    } catch { /* error in store */ }
  }, { icon: 'delete-bin-line', iconBgClass: 'bg-red-50', iconClass: 'text-red-500', confirmBgClass: 'bg-red-500 hover:bg-red-600 shadow-red-200' });
};

const goBack = () => {
  router.push({ name: 'ADMIN_CHATS' });
};

const markAsRead = async () => {
  try {
    const nounuUser = getNounuUser();
    if (nounuUser?.id) {
      await adminStore.markRoomAsRead(roomId.value, nounuUser.id);
    }
  } catch { /* ignore */ }
};

const onNewMessage = (data: any) => {
  if (data.roomId === roomId.value && adminStore.currentChat) {
    const exists = (adminStore.currentChat.messages || []).some((m: any) => m.id === data.id);
    if (!exists) {
      adminStore.currentChat = {
        ...adminStore.currentChat,
        messages: [...(adminStore.currentChat.messages || []), data],
      };
      markAsRead();
      scrollToBottom();
    }
  }
};

watch(() => adminStore.currentChat?.messages?.length, () => {
  scrollToBottom();
});

watch(roomId, async (newId, oldId) => {
  if (newId !== oldId && newId) {
    socketService.off('newMessage', onNewMessage);
    socketService.off('newMessageNotify', onNewMessage);
    await adminStore.fetchChat(newId);
    await markAsRead();
    scrollToBottom();
    await socketService.on('newMessage', onNewMessage);
    await socketService.on('newMessageNotify', onNewMessage);
    socketService.emit('joinRoom', newId);
  }
});

onActivated(async () => {
  await adminStore.fetchChat(roomId.value);
  await markAsRead();
  scrollToBottom();

  await socketService.on('newMessage', onNewMessage);
  await socketService.on('newMessageNotify', onNewMessage);

  socketService.emit('joinRoom', roomId.value);
});

onDeactivated(() => {
  socketService.off('newMessage', onNewMessage);
  socketService.off('newMessageNotify', onNewMessage);
  if (recordingTimer.value) clearInterval(recordingTimer.value);
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.onstop = null;
    mediaRecorder.value.stop();
  }
});
</script>
