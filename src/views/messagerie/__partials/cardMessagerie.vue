<template>
  <div>
    <div
      class="flex flex-col gap-4 w-full m-auto divide-y divide-gray-100 px-4 font-love mb-8 text-zinc-800"
    >
      <div 
        v-for="(message, index) in formattedMessages" 
        :key="index"
        class="pt-4 first:pt-2 transition-all duration-200 hover:bg-gray-50 rounded-xl px-2"
      >
        <RouterLink
          :to="{ name: 'CHAT_MESSAGE_DETAIL', params: { id: message.id } }"
          class="block"
        >
          <div class="flex flex-row gap-4 items-center">
            <!-- Avatar avec indicateur de statut en ligne -->
            <div class="relative size-14 flex-shrink-0">
              <div class="size-14 rounded-full bg-slate-200 overflow-hidden">
                <img
                  class="w-full h-full rounded-full object-cover"
                  v-lazy="message?.nounuPhoto?.originalUrl || defaultAvatar(message[sender]?.fullname)"
                  :alt="message[sender]?.fullname"
                  @error="handleImageError($event, message[sender]?.fullname)"
                />
              </div>
              <!-- Indicateur de statut en ligne -->
              <span 
                class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                :class="{
                  'bg-green-500': onlineUsers.includes(message.id),
                  'bg-gray-400': !onlineUsers.includes(message.id)
                }"
              ></span>
            </div>

            <!-- Content -->
            <div class="w-[calc(100%-70px)] flex flex-col gap-1.5">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-1.5">
                  <span 
                    class="font-bold text-ng" 
                    :class="message.unreadCount > 0 ? 'text-secondary' : 'text-gray-900'"
                  >
                    {{ message[sender]?.fullname || 'Utilisateur' }}
                  </span>
                  <span 
                    v-if="onlineUsers.includes(message.id)"
                    class="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium"
                  >
                    En ligne
                  </span>
                </div>
                <span
                  class="text-xs font-semibold first-letter:uppercase"
                  :class="message.unreadCount > 0 ? 'text-secondary' : 'text-gray-500'"
                >
                  {{ message.formattedDate }}
                </span>
              </div>

              <!-- Lu and recent message -->
              <div class="flex gap-2 items-center w-full">
                <IcIcons
                  name="RiCheckDoubleLine"
                  :size="16"
                  :class="message.lastMessage.isRead ? 'text-secondary' : 'text-gray-400'"
                />
                <span 
                  class="truncate w-full font-medium text-base"
                  :class="message.unreadCount > 0 ? 'text-gray-900' : 'text-gray-600'"
                >
                  {{ message.lastMessage?.content || 'Nouveau message' }}
                </span>
                <div
                  v-if="message.unreadCount > 0"
                  class="w-[50px] flex justify-end text-end"
                >
                  <span
                    class="text-xs size-6 font-bold text-white rounded-full flex items-center justify-center bg-secondary shadow-sm"
                  >
                    {{ message.unreadCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted, onUnmounted, computed } from "vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { StorageUtils } from "@/utils/store.utils";
import moment from "moment";
import { socketService } from "@/services/socket.services";

// Types
interface MessageContent {
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface User {
  id: number;
  fullname: string;
}

interface Photo {
  originalUrl: string;
}

interface Room {
  id: number;
  parent: User;
  nounou: User;
  lastMessage?: MessageContent;
}

interface ConversationMessage {
  room: Room;
  lastMessage: MessageContent;
  unreadCount: number;
  nounuPhoto?: Photo;
}

// Props avec typage
const props = defineProps<{ 
  Messages: any; 
  sender: any; 
}>();

// Références et états
const GetUserId = ref<string | null>(null);
const now = ref(moment()); // Date actuelle qui sera mise à jour régulièrement
const onlineUsers = ref<number[]>([]); // Liste des utilisateurs en ligne

// Mettre à jour la date actuelle toutes les minutes
let interval: number | null = null;

// Fonctions utilitaires
const defaultAvatar = (name: string = 'User'): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
};

const handleImageError = (event: Event, name: string = 'User'): void => {
  const target = event.target as HTMLImageElement;
  target.src = defaultAvatar(name);
};

// Vérifier le statut en ligne des utilisateurs
const setupOnlineStatus = (): void => {
  if (!socketService) return;

  // Écouter les événements de statut en ligne
  socketService.on('userOnline', (userId: number) => {
    if (!onlineUsers.value.includes(userId)) {
      onlineUsers.value.push(userId);
    }
  });

  socketService.on('userOffline', (userId: number) => {
    onlineUsers.value = onlineUsers.value.filter(id => id !== userId);
  });

  // Demander le statut de tous les utilisateurs dans les conversations
  const userIds = formattedMessages.value
    .map(message => message.id)
    .filter(Boolean);
  
  if (userIds.length > 0) {
    socketService.emit('checkMultipleUsersStatus', userIds);
  }
};

// Nettoyer les ressources
const cleanupResources = (): void => {
  if (interval) {
    clearInterval(interval);
  }
  
  if (socketService) {
    socketService.off('userOnline');
    socketService.off('userOffline');
  }
};

function getUnreadCount(conversation: ConversationMessage): number {
  return conversation.unreadCount || 0;
}

// Formater les messages avec une date qui se met à jour automatiquement
const formattedMessages = computed(() => {
  if (!Array.isArray(props.Messages)) return [];
  
  return props.Messages
    ?.filter((msg) => msg.lastMessage)
    .sort((a, b) => {
      const dateA = moment(a.room.lastMessage?.createdAt || 0);
      const dateB = moment(b.room.lastMessage?.createdAt || 0);
      return dateB.unix() - dateA.unix();
    })
    .map((msg) => {
      return {
        ...msg.room,
        lastMessage: msg.lastMessage,
        unreadCount: getUnreadCount(msg),
        nounuPhoto: msg.nounuPhoto,
        formattedDate: moment(msg.lastMessage?.createdAt).from(now.value.valueOf()),
      };
    });
});

// Cycle de vie du composant
onMounted(async () => {
  try {
    const userIdStore = await StorageUtils().getStore("nUser_Id");
    GetUserId.value = userIdStore.value;

    // Mettre à jour la date actuelle toutes les minutes
    interval = window.setInterval(() => {
      now.value = moment();
    }, 60000); // 60000 ms = 1 minute (changé de 1000ms à 60000ms pour optimisation)
    
    // Configurer la vérification du statut en ligne
    setupOnlineStatus();
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
  }
});

// Nettoyer l'intervalle lors du démontage
onUnmounted(() => {
  cleanupResources();
});
</script>

<style scoped>
/* Animation pour les nouveaux messages */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.text-secondary {
  animation: pulse 2s infinite;
}

/* Transition pour les éléments de la liste */
.pt-4 {
  transition: all 0.2s ease-in-out;
}

.pt-4:hover {
  transform: translateX(4px);
}
</style>
