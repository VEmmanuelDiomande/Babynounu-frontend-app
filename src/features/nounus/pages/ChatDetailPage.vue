<template>
  <div class="max-w-3xl mx-auto flex flex-col pt-20" style="height: 100vh;">
    <!-- Loading -->
    <div v-if="chatStore.isLoading && !chatStore.currentRoom" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-rose-200 border-t-rose-400"></div>
    </div>

    <!-- Chat -->
    <div v-else-if="chatStore.currentRoom" class="flex-1 flex flex-col min-h-0">
      <!-- Header -->
      <ChatHeader
        :title="getOtherUserName()"
        :subtitle="getOtherUserType()"
        :avatarUrl="getOtherUserAvatar()"
        :initials="getInitials()"
        :online="isOnline()"
        @back="goBack"
      >
        <template #actions>
          <button class="h-9 w-9 rounded-full hover:bg-rose-50 flex items-center justify-center transition-colors flex-shrink-0">
            <i class="ri ri-more-2-line text-gray-500" style="font-size: 18px;"></i>
          </button>
        </template>
      </ChatHeader>

      <!-- Messages -->
      <ChatContent
        ref="chatContentRef"
        :messages="chatStore.currentMessages"
        :isMyMessage="isMyMessage"
        :playingAudioId="playingAudioId"
        :getAudioProgress="(msgId: number) => audioProgress[msgId] || 0"
        :getAudioTime="formatAudioTime"
        :getAttachmentUrl="getAttachmentUrl"
        @toggleAudio="toggleAudio"
        @proposalResponse="handleProposalResponse"
      />

      <!-- Error -->
      <div v-if="chatStore.error" class="bg-red-50 border-t border-red-100 p-2.5 flex items-center gap-3 flex-shrink-0">
        <i class="ri ri-close-circle-line text-red-500" style="font-size: 18px;"></i>
        <p class="text-xs text-red-600 font-love">{{ chatStore.error }}</p>
      </div>

      <!-- Input area -->
      <ChatFooterInput
        v-model="messageInput"
        :isRecording="isRecording"
        :recordingTime="recordingTime"
        :pendingFile="pendingFile"
        :hasActiveProposition="hasActiveProposition"
        placeholder="Message..."
        :fixed="true"
        fileAccept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.mp4,.webm"
        sendIcon="ri ri-send-plane-line"
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
      :subtitle="`Envoyez une offre à ${getOtherUserName()}`"
      @close="showPropositionDrawer = false"
      @send="handlePropositionSend"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chatStore';
import { socketService } from '@/services/socket.services';
import { StorageUtils } from '@/utils/store.utils';
import { buildImageUrl, findMediaByType } from '@/utils/media.utils';
import { ChatHeader, ChatContent, ChatFooterInput, PropositionDrawer, ChatNotFound } from '@/components/chat';
import { useChatUtils } from '@/composables/useChatUtils';

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();

const {
  formatSeconds,
} = useChatUtils();

const messageInput = ref('');
const showPropositionDrawer = ref(false);
const chatContentRef = ref<InstanceType<typeof ChatContent> | null>(null);
const currentUserId = ref<string | null>(null);

// Voice recording
const isRecording = ref(false);
const recordingTime = ref(0);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const recordingTimer = ref<ReturnType<typeof setInterval> | null>(null);

// File attachment
const pendingFile = ref<File | null>(null);

// Audio playback
const playingAudioId = ref<number | null>(null);
const audioProgress = ref<Record<number, number>>({});
const audioElements = ref<Record<number, HTMLAudioElement>>({});
const audioDurations = ref<Record<number, string>>({});

const roomId = computed(() => Number(route.params.id));

const hasActiveProposition = computed(() => {
  const messages = chatStore.currentRoom?.messages || chatStore.currentMessages || [];
  const now = new Date();
  return messages.some((m: any) =>
    m.isProposition &&
    m.proposalStatus === 'Pending' &&
    (!m.propositionExpired || new Date(m.propositionExpired) > now)
  );
});

const isMyMessage = (msg: any) => {
  return msg.senderId?.toString() === currentUserId.value;
};

const getOtherUser = () => {
  const room = chatStore.currentRoom;
  if (!room) return null;
  if (room.sender?.id?.toString() === currentUserId.value) return room.receiver;
  return room.sender;
};

const getOtherUserName = () => {
  const user = getOtherUser();
  if (user?.nounus?.[0]?.fullname) return user.nounus[0].fullname;
  if (user?.parents?.[0]?.fullname) return user.parents[0].fullname;
  return user?.email || 'Utilisateur';
};

const getOtherUserType = () => {
  const user = getOtherUser();
  if (user?.nounus?.length > 0) return 'Nounu';
  if (user?.parents?.length > 0) return 'Parent';
  return 'Utilisateur';
};

const getInitials = () => {
  const name = getOtherUserName();
  return name.substring(0, 2).toUpperCase();
};

const getOtherUserAvatar = () => {
  const user = getOtherUser();
  const medias = (user?.medias || []).filter((m: any) => !m.deletedAt);
  const photo = findMediaByType(medias, 'photo_profil') || findMediaByType(medias, 'profil') || medias.find((m: any) => m.path || m.originalUrl);
  return buildImageUrl(photo?.path || photo?.originalUrl);
};

const isOnline = () => {
  const user = getOtherUser();
  return user?.status === 'online' || user?.isOnline === true;
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
      await chatStore.sendMessageWithFile(roomId.value, pendingFile.value, pendingFile.value.name, content || undefined);
      pendingFile.value = null;
    } else {
      await chatStore.sendMessage(roomId.value, content, undefined, undefined, undefined);
    }
    messageInput.value = '';
    scrollToBottom();
  } catch { /* error in store */ }
};

// ── Voice recording ──
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    audioChunks.value = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.value.push(e.data);
    };
    recorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
    };
    recorder.start();
    mediaRecorder.value = recorder;
    isRecording.value = true;
    recordingTime.value = 0;
    recordingTimer.value = setInterval(() => {
      recordingTime.value++;
    }, 1000);
  } catch {
    // mic permission denied or not available
  }
};

const stopAndSendRecording = async () => {
  if (!mediaRecorder.value) return;
  const recorder = mediaRecorder.value;
  recorder.onstop = async () => {
    const blob = new Blob(audioChunks.value, { type: 'audio/webm' });
    const fileName = `voice-${Date.now()}.webm`;
    try {
      await chatStore.sendMessageWithFile(roomId.value, blob, fileName);
      scrollToBottom();
    } catch { /* error in store */ }
  };
  recorder.stop();
  isRecording.value = false;
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
};

const cancelRecording = () => {
  if (!mediaRecorder.value) return;
  mediaRecorder.value.onstop = () => {
    if (mediaRecorder.value?.stream) {
      mediaRecorder.value.stream.getTracks().forEach(t => t.stop());
    }
  };
  mediaRecorder.value.stop();
  isRecording.value = false;
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
  audioChunks.value = [];
};

// ── File handling ──
const handleFileSelect = (file: File) => {
  pendingFile.value = file;
};

const getAttachmentUrl = (url: string) => {
  return buildImageUrl(url);
};

// ── Audio playback ──
const toggleAudio = (msgId: number) => {
  if (playingAudioId.value === msgId) {
    audioElements.value[msgId]?.pause();
    playingAudioId.value = null;
    return;
  }
  if (playingAudioId.value !== null && audioElements.value[playingAudioId.value]) {
    audioElements.value[playingAudioId.value].pause();
    playingAudioId.value = null;
  }
  const msg = chatStore.currentMessages.find(m => m.id === msgId);
  if (!msg?.attachmentUrl) return;
  if (!audioElements.value[msgId]) {
    const audio = new Audio(getAttachmentUrl(msg.attachmentUrl));
    audio.onloadedmetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        audioDurations.value[msgId] = formatSeconds(audio.duration);
      }
    };
    audio.ontimeupdate = () => {
      if (audio.duration) {
        audioProgress.value[msgId] = (audio.currentTime / audio.duration) * 100;
      }
    };
    audio.onended = () => {
      playingAudioId.value = null;
      audioProgress.value[msgId] = 0;
    };
    audioElements.value[msgId] = audio;
  }
  audioElements.value[msgId].play();
  playingAudioId.value = msgId;
};

const formatAudioTime = (msgId: number) => {
  if (audioDurations.value[msgId]) return audioDurations.value[msgId];
  const audio = audioElements.value[msgId];
  if (audio?.duration && isFinite(audio.duration)) {
    return formatSeconds(audio.duration);
  }
  return '0:00';
};

const handlePropositionSend = async (data: { content: string; montant?: number; periode?: string; expired?: string }) => {
  try {
    await chatStore.sendMessage(roomId.value, data.content, true, data.expired, data.montant, data.periode);
    showPropositionDrawer.value = false;
    scrollToBottom();
  } catch { /* error in store */ }
};

const handleProposalResponse = async (messageId: number, status: 'Accepted' | 'Refused') => {
  // Use chat service directly via store - for now we use the admin approach
  // This could be extended with a dedicated proposal endpoint
  try {
    const { ChatServices } = await import('@/services/chat.services');
    const chatServices = ChatServices();
    // The backend may handle proposal status via message update
    // For now, we reload messages after a brief delay
    await chatStore.fetchMessages(roomId.value);
  } catch { /* ignore */ }
};

const goBack = () => {
  router.push({ name: 'CHAT_MESSAGE' });
};

watch(() => chatStore.currentMessages.length, () => {
  scrollToBottom();
});

onMounted(async () => {
  if (!roomId.value || Number.isNaN(roomId.value)) {
    router.replace({ name: 'CHAT_MESSAGE' });
    return;
  }

  const userIdResult = await StorageUtils().getStore('nUser_Id');
  currentUserId.value = userIdResult?.value || null;

  // La vérification d'abonnement est gérée par le route guard (routes/index.ts)
  // et par le ChatLayout via useHasActiveSubscription (TanStack Query).
  // Ne pas refaire une vérification HTTP ici : en cas d'erreur réseau,
  // l'utilisateur était incorrectement redirigé vers PackSubscrible.

  await chatStore.fetchRoom(roomId.value);
  await chatStore.fetchMessages(roomId.value);
  await chatStore.markAsRead(roomId.value);
  scrollToBottom();

  const onNewMessage = async (data: any) => {
    if (data.roomId === roomId.value) {
      const exists = chatStore.currentMessages.some((m: any) => m.id === data.id);
      if (!exists) {
        chatStore.currentMessages.push(data);
        await chatStore.markAsRead(roomId.value);
        scrollToBottom();
      }
    }
  };

  await socketService.on('newMessage', onNewMessage);
  await socketService.on('newMessageNotify', onNewMessage);

  socketService.emit('joinRoom', roomId.value);

  onUnmounted(() => {
    socketService.off('newMessage', onNewMessage);
    socketService.off('newMessageNotify', onNewMessage);
    if (recordingTimer.value) clearInterval(recordingTimer.value);
    if (isRecording.value && mediaRecorder.value) {
      mediaRecorder.value.stream?.getTracks().forEach(t => t.stop());
    }
    Object.values(audioElements.value).forEach(a => a.pause());
  });
});
</script>
