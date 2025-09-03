<template>
  <div
    class="flex w-full mb-2"
    :class="{
      'justify-end': isCurrentUser,
      'justify-start': !isCurrentUser,
    }"
  >
    <div
      class="flex flex-col max-w-[80%]"
      :class="{
        'items-end': isCurrentUser,
        'items-start': !isCurrentUser,
      }"
    >
      <!-- Avatar pour les messages des autres utilisateurs -->
      <div v-if="!isCurrentUser" class="flex items-end mb-1">
        <div class="w-6 h-6 rounded-full bg-gray-200 mr-1 overflow-hidden hidden flex-shrink-0">
          <!-- Si vous avez un avatar, vous pouvez l'ajouter ici -->
          <div class="w-full h-full flex items-center justify-center text-xs  text-gray-500">
            {{ message.sender?.name?.charAt(0) || '?' }}
          </div>
        </div>
        <span class="text-xs text-gray-500">{{ message.sender?.name }}</span>
      </div>

      <div
        class="py-3 px-4 rounded-[18px] relative break-words shadow-sm"
        :class="{
          'bg-secondary/80 text-white rounded-br-[4px] ml-6': isCurrentUser,
          'bg-white text-zinc-900 rounded-bl-[4px] mr-6': !isCurrentUser,
        }"
      >
        <div class="leading-[1.4]  text-base">{{ message.content }}</div>
        <div
          class="text-xs mt-1 opacity-80 flex items-center justify-end"
          :class="{
            'text-zinc-100': isCurrentUser,
            'text-zinc-500': !isCurrentUser,
          }"
        >
          {{ formatTime(message.createdAt) }}
          <span v-if="isCurrentUser" class="ml-1 flex">
            <span v-if="message.isRead" class="text-blue-400">✓✓</span>
            <span v-else>✓</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isCurrentUser: {
    type: Boolean,
    default: false
  },
  formatTime: {
    type: Function,
    required: true
  }
});

// Vous pouvez ajouter des propriétés calculées si nécessaire
const messageStyle = computed(() => {
  return {
    transform: props.isCurrentUser ? 'translateX(-8px)' : 'translateX(8px)',
    transition: 'transform 0.2s ease-in-out'
  };
});
</script>

<style scoped>
/* Animation d'entrée pour les messages */
@keyframes slideInRight {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.justify-end > div {
  animation: slideInRight 0.3s ease-out forwards;
}

.justify-start > div {
  animation: slideInLeft 0.3s ease-out forwards;
}

/* Effet de survol pour les bulles de message */
.py-3.px-4:hover {
  filter: brightness(1.05);
}
</style>