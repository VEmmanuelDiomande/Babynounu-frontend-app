<template>
  <div class="max-w-3xl mx-auto flex flex-col" style="height: 100vh;">
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
      <div
        class="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-1"
        ref="messagesContainer"
        style="background-color: #efe5dc; background-image: radial-gradient(circle at 25% 25%, rgba(0,0,0,0.02) 1px, transparent 1px); background-size: 24px 24px;"
      >
        <template v-for="(msg, i) in chatStore.currentMessages" :key="msg.id">
          <!-- Date separator -->
          <div v-if="showDateSeparator(chatStore.currentMessages, i)" class="flex items-center justify-center my-3">
            <span class="px-3 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-xs font-love font-medium text-gray-500 shadow-sm">
              {{ getDateSeparatorLabel(msg.createdAt) }}
            </span>
          </div>

          <!-- Message bubble -->
          <ChatMessageBubble
            :msg="msg"
            :isMyMessage="isMyMessage(msg)"
            :isPlayingAudio="playingAudioId === msg.id"
            :audioProgress="audioProgress[msg.id] || 0"
            :audioTime="formatAudioTime(msg.id)"
            :attachmentUrl="getAttachmentUrl(msg.attachmentUrl)"
            :showProposalActions="!isMyMessage(msg)"
            @toggleAudio="toggleAudio"
            @proposalResponse="handleProposalResponse"
          />
        </template>

        <!-- Empty state -->
        <ChatEmptyState v-if="!chatStore.currentMessages.length" />
      </div>

      <!-- Error -->
      <div v-if="chatStore.error" class="bg-red-50 border-t border-red-100 p-2.5 flex items-center gap-3 flex-shrink-0">
        <i class="ri ri-close-circle-line text-red-500" style="font-size: 18px;"></i>
        <p class="text-xs text-red-600 font-love">{{ chatStore.error }}</p>
      </div>

      <!-- Input area -->
      <div class="px-3 sm:px-4 py-2.5 bg-white border-t border-rose-50 flex-shrink-0">
        <!-- Recording bar -->
        <div v-if="isRecording" class="flex items-center gap-3 mb-2">
          <button @click="cancelRecording" class="h-9 w-9 rounded-full bg-red-50 flex items-center justify-center transition-colors flex-shrink-0">
            <i class="ri ri-delete-bin-line text-red-500" style="font-size: 18px;"></i>
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
          <input ref="fileInput" type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.mp4,.webm" class="hidden" @change="handleFileSelect" />
          <div class="flex-1 relative">
            <input
              v-model="messageInput"
              @keyup.enter="handleSendMessage"
              type="text"
              placeholder="Message..."
              class="w-full text-sm font-love bg-rose-50/50 rounded-3xl px-4 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all"
            />
          </div>
          <button
            v-if="messageInput.trim() || pendingFile"
            @click="handleSendMessage"
            class="h-10 w-10 rounded-full bg-rose-400 text-white hover:bg-rose-500 active:scale-90 transition-all flex items-center justify-center flex-shrink-0 shadow-sm"
          >
            <i class="ri ri-send-plane-line" style="font-size: 20px;"></i>
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
import { ChatHeader, ChatMessageBubble, PropositionDrawer, ChatEmptyState, ChatNotFound } from '@/components/chat';
import { useChatUtils } from '@/composables/useChatUtils';
import axios from 'axios';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();
const userRole = ref<string | null>(null);

const {
  formatMsgTime,
  showDateSeparator,
  getDateSeparatorLabel,
  getFileIcon,
  formatSeconds,
  formatRecordingTime,
  formatFileSize,
  getWaveformBars,
} = useChatUtils();

const messageInput = ref('');
const showPropositionDrawer = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const currentUserId = ref<string | null>(null);

// Voice recording
const isRecording = ref(false);
const recordingTime = ref(0);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const recordingTimer = ref<ReturnType<typeof setInterval> | null>(null);

// File attachment
const pendingFile = ref<File | null>(null);
const fileInput = ref<HTMLElement | null>(null);

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
const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    pendingFile.value = target.files[0];
  }
  target.value = '';
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
