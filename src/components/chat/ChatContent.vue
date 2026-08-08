<template>
  <div
    class="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-1"
    ref="messagesContainer"
    style="background-color: #efe5dc; background-image: radial-gradient(circle at 25% 25%, rgba(0,0,0,0.02) 1px, transparent 1px); background-size: 24px 24px;"
  >
    <template v-for="(msg, i) in messages" :key="msg.id">
      <!-- Date separator -->
      <div v-if="showDateSeparator(messages, i)" class="flex items-center justify-center my-3">
        <span class="px-3 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-xs font-love font-medium text-gray-500 shadow-sm">
          {{ getDateSeparatorLabel(msg.createdAt) }}
        </span>
      </div>

      <!-- Message bubble -->
      <ChatMessageBubble
        :msg="msg"
        :isMyMessage="isMyMessage(msg)"
        :showSenderName="showSenderName"
        :senderName="getSenderName ? getSenderName(msg) : ''"
        :isPlayingAudio="playingAudioId === msg.id"
        :audioProgress="getAudioProgress ? getAudioProgress(msg.id) : 0"
        :audioTime="getAudioTime ? getAudioTime(msg.id) : '0:00'"
        :attachmentUrl="getAttachmentUrl ? getAttachmentUrl(msg.attachmentUrl) : msg.attachmentUrl"
        :showProposalActions="getShowProposalActions ? getShowProposalActions(msg) : !isMyMessage(msg)"
        @toggleAudio="$emit('toggleAudio', $event)"
        @proposalResponse="(messageId, status) => $emit('proposalResponse', messageId, status)"
      />
    </template>

    <!-- Empty state -->
    <ChatEmptyState v-if="!messages.length" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChatUtils } from '@/composables/useChatUtils';
import ChatMessageBubble from './ChatMessageBubble.vue';
import ChatEmptyState from './ChatEmptyState.vue';

const props = defineProps<{
  messages: any[];
  isMyMessage: (msg: any) => boolean;
  showSenderName?: boolean;
  getSenderName?: (msg: any) => string;
  playingAudioId?: number | null;
  getAudioProgress?: (msgId: number) => number;
  getAudioTime?: (msgId: number) => string;
  getAttachmentUrl?: (url: string) => string;
  getShowProposalActions?: (msg: any) => boolean;
}>();

defineEmits<{
  toggleAudio: [msgId: number];
  proposalResponse: [messageId: number, status: 'Accepted' | 'Refused'];
}>();

const { showDateSeparator, getDateSeparatorLabel } = useChatUtils();

const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

defineExpose({ scrollToBottom, messagesContainer });
</script>
