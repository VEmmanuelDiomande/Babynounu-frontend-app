<template>
  <div class="max-w-3xl mx-auto flex flex-col h-full pt-20">
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
      <ChatContent
        ref="chatContentRef"
        :messages="adminStore.currentChat?.messages || []"
        :isMyMessage="isMyMessage"
        :showSenderName="true"
        :getSenderName="getSenderDisplayName"
        :getShowProposalActions="isMyMessage"
        @proposalResponse="handleProposalResponse"
      />

      <!-- Error -->
      <div v-if="adminStore.error" class="bg-red-50 border-t border-red-100 p-2.5 flex items-center gap-3 flex-shrink-0">
        <i class="ri ri-close-circle-line text-red-500" style="font-size: 18px;"></i>
        <p class="text-xs text-red-600 font-love">{{ adminStore.error }}</p>
      </div>

      <!-- Input area -->
      <ChatFooterInput
        v-model="messageInput"
        :isRecording="isRecording"
        :recordingTime="recordingTime"
        :pendingFile="pendingFile"
        :hasActiveProposition="hasActiveProposition"
        placeholder="Répondre en tant que nounu..."
        sendIcon="ri ri-send-2-fill"
        @send="handleSendMessage"
        @startRecording="startRecording"
        @stopRecording="stopAndSendRecording"
        @cancelRecording="cancelRecording"
        @selectFile="handleFileSelect"
        @clearFile="pendingFile = null"
        @openProposition="showPropositionDrawer = true"
      />
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
import { ChatHeader, ChatContent, ChatFooterInput, PropositionDrawer, ChatNotFound } from '@/components/chat';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const { showConfirm, confirmTitle, confirmMessage, confirmIcon, confirmIconBg, confirmIconClass, confirmLabel, confirmBgClass, requestConfirm, onConfirm, onCancel } = useConfirmModal();

const messageInput = ref('');
const showPropositionDrawer = ref(false);
const chatContentRef = ref<InstanceType<typeof ChatContent> | null>(null);
const pendingFile = ref<File | null>(null);

// Voice recording
const isRecording = ref(false);
const recordingTime = ref(0);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const recordingTimer = ref<ReturnType<typeof setInterval> | null>(null);

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
    chatContentRef.value?.scrollToBottom();
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

const handleFileSelect = (file: File) => {
  pendingFile.value = file;
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
