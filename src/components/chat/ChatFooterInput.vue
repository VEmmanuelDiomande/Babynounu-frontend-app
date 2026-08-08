<template>
  <div :class="['px-3 sm:px-4 py-2.5 bg-white border-t border-rose-50 flex-shrink-0', fixed ? 'fixed bottom-0 w-full' : '']">
    <!-- Recording bar -->
    <div v-if="isRecording" class="flex items-center gap-3 mb-2">
      <button @click="$emit('cancelRecording')" class="h-9 w-9 rounded-full bg-red-50 flex items-center justify-center transition-colors flex-shrink-0">
        <i class="ri ri-delete-bin-line text-red-500" style="font-size: 18px;"></i>
      </button>
      <div class="flex-1 flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
        <span class="text-sm font-love text-red-500 font-medium">Enregistrement...</span>
        <span class="text-sm font-anton text-gray-700 ml-auto">{{ formatRecordingTime(recordingTime) }}</span>
      </div>
      <button @click="$emit('stopRecording')" class="h-9 w-9 rounded-full bg-rose-400 text-white hover:bg-rose-500 active:scale-90 transition-all flex items-center justify-center flex-shrink-0 shadow-sm">
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
      <button @click="$emit('clearFile')" class="h-7 w-7 rounded-full hover:bg-rose-100 flex items-center justify-center transition-colors flex-shrink-0">
        <i class="ri ri-close-line text-gray-400" style="font-size: 16px;"></i>
      </button>
    </div>

    <!-- Normal input -->
    <div v-if="!isRecording" class="flex items-end gap-2">
      <button
        @click="!hasActiveProposition && $emit('openProposition')"
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
      <input ref="fileInput" type="file" :accept="fileAccept" class="hidden" @change="handleFileSelect" />
      <div class="flex-1 relative">
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @keyup.enter="$emit('send')"
          type="text"
          :placeholder="placeholder"
          class="w-full text-sm font-love bg-rose-50/50 rounded-3xl px-4 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all"
        />
      </div>
      <button
        v-if="modelValue.trim() || pendingFile"
        @click="$emit('send')"
        class="h-10 w-10 rounded-full bg-rose-400 text-white hover:bg-rose-500 active:scale-90 transition-all flex items-center justify-center flex-shrink-0 shadow-sm"
      >
        <i :class="sendIcon" style="font-size: 20px;"></i>
      </button>
      <button
        v-else
        @click="$emit('startRecording')"
        class="h-10 w-10 rounded-full bg-rose-400 text-white hover:bg-rose-500 active:scale-90 transition-all flex items-center justify-center flex-shrink-0 shadow-sm"
      >
        <i class="ri ri-mic-line" style="font-size: 20px;"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChatUtils } from '@/composables/useChatUtils';

defineProps<{
  modelValue: string;
  isRecording: boolean;
  recordingTime: number;
  pendingFile: File | null;
  hasActiveProposition: boolean;
  placeholder?: string;
  fixed?: boolean;
  fileAccept?: string;
  sendIcon?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  send: [];
  startRecording: [];
  stopRecording: [];
  cancelRecording: [];
  selectFile: [file: File];
  clearFile: [];
  openProposition: [];
}>();

const { getFileIcon, formatRecordingTime, formatFileSize } = useChatUtils();

const fileInput = ref<HTMLElement | null>(null);

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    target.value = '';
    emit('selectFile', file);
  }
};
</script>
