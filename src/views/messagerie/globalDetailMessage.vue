<template>
  <IonPage v-if="dataChat">
    <MessagerieDetailHeader
      :Room="dataChat[typeProfil]"
      :photo="dataChat?.photo"
    />

    <IonContent ref="content">
      <IonButton expand="block" class="hidden" @click="scrollToBottom()">
        Scroll to Bottom
      </IonButton>

      <div class="flex flex-col flex-1" v-if="activeConversation">
        <div class="flex flex-col p-5 overflow-y-auto">
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex flex-col mb-4"
            :class="{
              'ml-auto': message.sender.id === currentUser.id,
              'mr-auto': message.sender.id !== currentUser.id,
            }"
          >
            <div
              class="px-4 py-3 rounded-2xl"
              :class="{
                'bg-blue-500 text-white text-end ':
                  message.sender.id == currentUser.id,
                'bg-gray-200 text-black': message.sender.id != currentUser.id,
              }"
            >
              {{ message.content }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ formatTime(message.createdAt) }}
              <span v-if="message.sender.id === currentUser.id" class="ml-1">
                {{ message.isRead ? "✓✓" : "✓" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </IonContent>

    <!-- Input area -->
    <IonFooter class="flex flex-col w-full">
       <!-- <CardMissionsValidate v-if="nType_Profil == 'administrateur'" :data="{nounu: dataChat.nounou.id, parent: dataChat.parent.id, userId: dataChat.parent?.user?.id  }" /> -->
      <span
        v-if="typingUsers.length > 0"
        class="text-sm bg-gray-100/50 text-center py-2 opacity-70"
      >
        {{ typingMessage }}
      </span>
      <div class="flex items-center border gap-2 rounded-lg p-2 bg-gray-100">
        <ChatMessageForm
          name="chat"
          v-model="newMessage"
          @keyup.enter="sendMessage"
        />
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          @click="sendMessage"
          :disabled="!newMessage"
        >
          <IcIcons name="RiSendPlaneFill" :size="20" />
        </button>
      </div>
    </IonFooter>
  </IonPage>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { io, Socket } from "socket.io-client";
import { format } from "date-fns";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import { SettingServices } from "@/services/setting.services";
import { useRoute } from "vue-router";
import MessagerieDetailHeader from "@/components/headers/MessagerieDetailHeader.vue";
import { IonButton, IonContent, IonFooter, IonPage } from "@ionic/vue";
import { useQuery } from "@tanstack/vue-query";
import ChatMessageForm from "@/components/forms/chatMessageForm.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { useConversationStore } from "@/stores/conversationStore";
import CardMissionsValidate from "./__partials/cardMissionsValidate.vue";

const { dataChat, typeProfil, activeConversation } = defineProps([
  "dataChat",
  "typeProfil",
  "activeConversation",
]);

interface User {
  id: number;
  name: string;
  role: "administrateur" | "parent" | "nounu";
}

interface Message {
  id: any;
  content: string;
  sender: User;
  room: any;
  createdAt: string;
  isRead: boolean;
}

interface Room {
  id: number;
  parent: {
    fullname: string;
  };
  nounou: {
    fullname: string;
  };
}

const route = useRoute();

const currentUser = ref<any>({
  id: "",
});
const content = ref<any>(null);

const socket = ref<Socket | null>(null);
const messages = ref<Message[]>([]);
const newMessage = ref("");
const isOpenDetailMessage = ref(false);
const globalUnreadCounts = ref<any>();
const nType_Profil = ref<any>();

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});

const scrollToBottom = () => {
  content.value?.$el.scrollToBottom(100);
};

async function loadMessages() {
  if (!activeConversation) return;

  try {
    const response = await SettingServices().listSetting(
      `${URL_API_ROUTE.MESSAGE_ROOM}?roomId=${activeConversation}`
    );
    messages.value = response;
    markAsRead();

    if (socket.value) {
      socket.value.emit("joinRoom", { roomId: route.params.id });
    }
  } catch (error) {
    console.error("Failed to load messages:", error);
  }
}

function sendMessage() {
  if (!newMessage.value.trim() || !activeConversation || !socket.value) return;

  socket.value.emit("sendMessage", {
    roomId: activeConversation,
    content: newMessage.value,
  });

  newMessage.value = "";
}

async function markAsRead() {
  if (!activeConversation || !socket.value) return;

  socket.value.emit("markAsRead", {
    roomId: activeConversation,
  });
}

function formatTime(dateString: string): string {
  return format(new Date(dateString), "HH:mm");
}

// Charger les messages quand la conversation active change
watch(() => activeConversation, loadMessages, { immediate: true });

const typingUsers = ref<{ id: number; name: string }[]>([]);
let typingTimeout: number | null = null;

const typingMessage = computed(() => {
  if (typingUsers.value.length === 0) return "";
  if (typingUsers.value.length === 1)
    return `${typingUsers.value[0].name} is typing...`;
  return `${typingUsers.value.map((u) => u.name).join(", ")} are typing...`;
});

// Fonction pour rafraîchir les counts
const refreshUnreadCounts = () => {
  socket.value?.emit("getGlobalUnreadCounts", { roomId: activeConversation });
};

onMounted(async () => {
  scrollToBottom();
  useConversationStore().state.RoomsOpenId = activeConversation;
  currentUser.value.id = (await StorageUtils().getStore("nUser_Id")).value;
  nType_Profil.value = (await StorageUtils().getStore("nType_Profil")).value;
  // Initialiser la connexion Socket.IO
  socket.value = io("http://localhost:3000", {
    auth: {
      authorization: (await StorageUtils().getStore("nToken")).value,
      user: {
        id: (await StorageUtils().getStore("nUser_Id")).value,
        type_profil: {
          slug: (await StorageUtils().getStore("nType_Profil")).value,
        },
      },
    },
  });

  // Demander les counts initiaux
  refreshUnreadCounts();

  // Écouter les événements Socket.IO
  socket.value.on("newMessage", (message: Message) => {
    console.log(message);
    if (activeConversation && message.room.id == activeConversation) {
      messages.value.push(message);
      scrollToBottom();
      refreshUnreadCounts();

      if (message.sender.id != currentUser.value.id) {
        markAsRead();
        refreshUnreadCounts();
      }
    }
  });

  // Écouter l'événement pour les counts globaux
  socket.value.on("globalUnreadCounts", (counts) => {
    console.log(counts);
    globalUnreadCounts.value = counts;
  });

  socket.value.on("messagesRead", ({ roomId, readerId }) => {
    console.log("RoomsOpenId", useConversationStore().state.RoomsOpenId);
    if (
      activeConversation &&
      activeConversation == roomId &&
      useConversationStore().state.RoomsOpenId == activeConversation
    ) {
      messages.value.forEach((msg) => {
        if (msg.sender.id != readerId) {
          msg.isRead = true;
        }
      });
    }
    // Demander les counts initiaux
    refreshUnreadCounts();
  });
});
</script>
