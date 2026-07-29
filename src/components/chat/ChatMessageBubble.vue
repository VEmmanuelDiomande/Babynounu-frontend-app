<template>
  <div :class="['flex', isMyMessage ? 'justify-end' : 'justify-start', 'mb-1']">
    <div
      :class="[
        'rounded-2xl px-3 py-2 shadow-sm relative',
        isMyMessage
          ? 'bg-[#d9fdd3] text-gray-900 rounded-br-md'
          : 'bg-white text-gray-900 rounded-bl-md',
        msg.isProposition ? 'max-w-[90%] sm:max-w-[400px] w-full' : 'max-w-[75%]'
      ]"
    >
      <!-- Sender name -->
      <div v-if="showSenderName" :class="['text-xs font-love font-semibold mb-0.5', isMyMessage ? 'text-green-600' : 'text-rose-500']">
        {{ senderName }}
      </div>

      <!-- Regular message -->
      <div v-if="!msg.isProposition && !msg.attachmentUrl" class="text-sm font-love whitespace-pre-wrap break-words pr-12">
        {{ msg.content }}
      </div>

      <!-- Audio / Voice note -->
      <div v-else-if="msg.attachmentUrl && msg.attachmentType?.startsWith('audio/')" class="min-w-[220px] max-w-[260px]">
        <div class="flex items-center gap-2.5">
          <button
            @click="$emit('toggleAudio', msg.id)"
            class="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
            :class="isMyMessage ? 'bg-green-600 text-white' : 'bg-rose-400 text-white'"
          >
            <i :class="isPlayingAudio ? 'ri ri-pause-fill' : 'ri ri-play-fill'" style="font-size: 20px;"></i>
          </button>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-[2px] h-8 mb-1">
              <div
                v-for="(bar, idx) in waveformBars"
                :key="idx"
                class="flex-1 rounded-full transition-colors"
                :class="isMyMessage ? 'bg-green-600' : 'bg-rose-400'"
                :style="{
                  height: bar + '%',
                  opacity: (audioProgress ?? 0) > (idx / waveformBars.length) * 100 ? 1 : 0.3
                }"
              ></div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-love font-medium" :class="isMyMessage ? 'text-green-800' : 'text-gray-600'">
                <i class="ri ri-mic-line" style="font-size: 10px;"></i>
                Note vocale
              </span>
              <span class="text-[10px] font-anton" :class="isMyMessage ? 'text-green-800' : 'text-gray-600'">
                {{ audioTime }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="msg.content" class="text-xs font-love whitespace-pre-wrap break-words text-gray-700 mt-1.5 pt-1.5 border-t border-black/5">{{ msg.content }}</div>
      </div>

      <!-- File attachment -->
      <div v-else-if="msg.attachmentUrl" class="min-w-[200px]">
        <a
          :href="attachmentUrl"
          target="_blank"
          :class="['flex items-center gap-2.5 rounded-xl p-2 transition-colors', isMyMessage ? 'hover:bg-black/5' : 'hover:bg-rose-50']"
        >
          <div
            class="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="isMyMessage ? 'bg-green-100' : 'bg-rose-100'"
          >
            <i :class="[fileIcon, isMyMessage ? 'text-green-600' : 'text-rose-500']" style="font-size: 20px;"></i>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-sm font-love font-medium text-gray-900 truncate">{{ msg.attachmentName || 'Fichier' }}</div>
            <div class="text-[10px] font-love text-gray-400 flex items-center gap-1">
              <i class="ri ri-download-2-line" style="font-size: 11px;"></i>
              Cliquez pour télécharger
            </div>
          </div>
        </a>
        <div v-if="msg.content" class="text-sm font-love whitespace-pre-wrap break-words text-gray-900 mt-1">{{ msg.content }}</div>
      </div>

      <!-- Proposition card -->
      <div v-else class="mb-1 w-full min-w-0">
        <div :class="[
          'rounded-xl overflow-hidden border shadow-sm',
          isMyMessage ? 'border-black/10' : getProposalCardClass(msg.proposalStatus, isPropositionExpired)
        ]">
          <!-- Header band -->
          <div :class="[
            'flex items-center gap-2 px-3 py-2',
            isMyMessage
              ? 'bg-gray-100/60'
              : msg.proposalStatus === 'Accepted' ? 'bg-green-50'
              : msg.proposalStatus === 'Refused' ? 'bg-red-50'
              : 'bg-rose-50'
          ]">
            <div :class="[
              'h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0',
              isMyMessage ? 'bg-gray-200/60'
              : msg.proposalStatus === 'Accepted' ? 'bg-green-100'
              : msg.proposalStatus === 'Refused' ? 'bg-red-100'
              : 'bg-rose-100'
            ]">
              <i :class="[
                'ri',
                msg.proposalStatus === 'Accepted' ? 'ri-checkbox-circle-fill text-green-500'
                : msg.proposalStatus === 'Refused' ? 'ri-close-circle-fill text-red-500'
                : 'ri-hand-heart-fill',
                isMyMessage && msg.proposalStatus === 'Pending' ? 'text-gray-500' : '',
              ]" style="font-size: 16px;"></i>
            </div>
            <span :class="[
              'text-xs font-love font-bold uppercase tracking-wide',
              isMyMessage ? 'text-gray-700'
              : msg.proposalStatus === 'Accepted' ? 'text-green-600'
              : msg.proposalStatus === 'Refused' ? 'text-red-600'
              : 'text-rose-500'
            ]">Proposition</span>
            <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-love font-semibold ml-auto', getProposalBadgeClass(msg.proposalStatus, isPropositionExpired)]">
              <span class="h-1.5 w-1.5 rounded-full" :class="getProposalDotClass(msg.proposalStatus, isPropositionExpired)"></span>
              {{ getProposalLabel(msg.proposalStatus, isPropositionExpired) }}
            </span>
          </div>

          <!-- Body -->
          <div class="px-3 py-2.5 bg-white">
            <div v-if="parsed.objet" class="text-sm font-love font-semibold text-gray-900 mb-1.5">
              {{ parsed.objet }}
            </div>

            <div v-if="parsed.type" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-500 text-[11px] font-love font-medium mb-2">
              <i class="ri ri-service-line" style="font-size: 12px;"></i>
              {{ parsed.type }}
            </div>

            <div v-if="parsed.description" class="text-sm font-love whitespace-pre-wrap text-gray-700 mb-2.5 leading-relaxed">
              {{ parsed.description }}
            </div>

            <!-- Info rows -->
            <div class="space-y-1.5">
              <div v-if="msg.montant" class="flex items-center gap-2">
                <div class="h-6 w-6 rounded-md bg-rose-50 flex items-center justify-center flex-shrink-0">
                  <i class="ri ri-wallet-line text-rose-400" style="font-size: 13px;"></i>
                </div>
                <span class="text-xs font-love text-gray-500">Montant</span>
                <span class="text-sm font-anton text-gray-900 ml-auto">{{ formatMontant(msg.montant) }}</span>
              </div>

              <div v-if="msg.periode || parsed.mois" class="flex items-center gap-2">
                <div class="h-6 w-6 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <i class="ri ri-calendar-2-line text-blue-400" style="font-size: 13px;"></i>
                </div>
                <span class="text-xs font-love text-gray-500">Durée</span>
                <span class="text-xs font-love font-medium text-gray-700 ml-auto">{{ msg.periode || parsed.mois }}</span>
              </div>

              <div v-if="parsed.debut" class="flex items-center gap-2">
                <div class="h-6 w-6 rounded-md bg-green-50 flex items-center justify-center flex-shrink-0">
                  <i class="ri ri-calendar-line text-green-500" style="font-size: 13px;"></i>
                </div>
                <span class="text-xs font-love text-gray-500">Début</span>
                <span class="text-xs font-love font-medium text-gray-700 ml-auto">{{ parsed.debut }}</span>
              </div>

              <div v-if="msg.propositionExpired" class="flex items-center gap-2">
                <div class="h-6 w-6 rounded-md bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <i class="ri ri-timer-line text-amber-500" style="font-size: 13px;"></i>
                </div>
                <span class="text-xs font-love text-gray-500">Expire dans 1h</span>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="msg.proposalStatus === 'Pending' && !isPropositionExpired && showProposalActions" class="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-100">
              <button @click="$emit('proposalResponse', msg.id, 'Accepted')" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-love font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 active:scale-95 transition-all">
                <i class="ri ri-checkbox-circle-line" style="font-size: 15px;"></i>
                Accepter
              </button>
              <button @click="$emit('proposalResponse', msg.id, 'Refused')" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-love font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 active:scale-95 transition-all">
                <i class="ri ri-close-line" style="font-size: 15px;"></i>
                Refuser
              </button>
            </div>

            <!-- Expired indicator -->
            <div v-else-if="msg.proposalStatus === 'Pending' && isPropositionExpired && showProposalActions" class="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100 text-xs font-love font-medium text-gray-400">
              <i class="ri ri-time-line" style="font-size: 14px;"></i>
              Proposition expirée
            </div>

            <!-- Accepted/Refused indicator -->
            <div v-else-if="msg.proposalStatus !== 'Pending' && showProposalActions" :class="['flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100 text-xs font-love font-medium', msg.proposalStatus === 'Accepted' ? 'text-green-600' : 'text-red-600']">
              <i :class="msg.proposalStatus === 'Accepted' ? 'ri ri-checkbox-circle-fill' : 'ri ri-close-circle-fill'" style="font-size: 14px;"></i>
              {{ msg.proposalStatus === 'Accepted' ? 'Proposition acceptée' : 'Proposition refusée' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Time + read indicator -->
      <div class="flex items-center justify-end gap-1 mt-0.5 -mb-1">
        <span class="text-[10px] font-love text-gray-500">{{ formatMsgTime(msg.createdAt) }}</span>
        <i v-if="isMyMessage && msg.isRead" class="ri ri-check-double-line text-[#53bdeb]" style="font-size: 14px;"></i>
        <i v-else-if="isMyMessage" class="ri ri-check-line text-gray-400" style="font-size: 14px;"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useChatUtils } from '@/composables/useChatUtils';

const props = defineProps<{
  msg: any;
  isMyMessage: boolean;
  showSenderName?: boolean;
  senderName?: string;
  showProposalActions?: boolean;
  isPlayingAudio?: boolean;
  audioProgress?: number;
  audioTime?: string;
  attachmentUrl?: string;
}>();

defineEmits<{
  toggleAudio: [msgId: number];
  proposalResponse: [messageId: number, status: 'Accepted' | 'Refused'];
}>();

const {
  formatMontant,
  formatMsgTime,
  getProposalBadgeClass,
  getProposalCardClass,
  getProposalDotClass,
  getProposalLabel,
  parsePropositionContent,
  getFileIcon,
  getWaveformBars,
} = useChatUtils();

const parsed = computed(() => parsePropositionContent(props.msg.content || ''));
const fileIcon = computed(() => getFileIcon(props.msg.attachmentType));
const waveformBars = computed(() => getWaveformBars(props.msg.id));
const isPropositionExpired = computed(() => {
  return props.msg.propositionExpired && new Date(props.msg.propositionExpired) <= new Date();
});
</script>
