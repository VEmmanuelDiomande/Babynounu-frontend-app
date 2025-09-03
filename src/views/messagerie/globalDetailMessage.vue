<template>
  <IonPage v-if="dataChat" class="bg-[#f5f7fb] font-love">
    <!-- Header component -->
    <MessagerieDetailHeader
      :Room="dataChat[typeProfil]"
      :photo="dataChat?.photo"
      :activeConversation="activeConversation"
      class="sticky top-0 z-10"
      :arWriting="typingUsers"
    />

    <!-- Main content area -->
    <IonContent ref="content" class="pt-0 px-0 font-love">
      <!-- Background elements -->
      <div class="fixed inset-0 bg-black/10 -z-40"></div>
      <div
        class="fixed inset-0 -z-50 bg-cover bg-center bg-no-repeat opacity-5"
      >
        <img
          class="w-full h-full object-cover"
          src="/images/backgrounds/chat_bg.jpg"
          alt="Chat background"
          loading="lazy"
        />
      </div>

      <!-- New messages indicator -->
      <IonButton
        v-if="hasNewMessages"
        expand="block"
        class="fixed bottom-[80px] left-1/2 transform -translate-x-1/2 z-10 w-auto py-2 px-4 rounded-full text-sm flex items-center gap-2 shadow-md"
        @click="scrollToBottom"
      >
        <IcIcons name="RiArrowDownCircleFill" :size="20" />
        Nouveaux messages
      </IonButton>

      <!-- Messages container -->
      <div
        v-if="activeConversation && messages.length"
        class="flex flex-col min-h-full py-0 px-3 pb-[80px] pt-4"
      >
        <div class="flex flex-col gap-3">
          <!-- Groupement des messages par date -->
          <template
            v-for="(group, groupIndex) in groupedMessages"
            :key="groupIndex"
          >
            <!-- Date separator -->
            <div class="flex justify-center my-3">
              <div
                class="bg-gray-200/80 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm"
              >
                {{ formatDateHeader(group.date) }}
              </div>
            </div>

            <!-- Messages for this date -->
            <div
              v-for="message in group.messages"
              :key="message.id"
              class="message-container"
            >
              <!-- Regular text message -->
              <MessageBubble
                v-if="!message.isProposition"
                :message="message"
                :is-current-user="isCurrentUser(message.sender.id)"
                :format-time="formatTime"
              />

              <!-- Service proposal -->
              <ProposalCard
                v-else
                :message="message"
                :is-current-user="isCurrentUser(message.sender.id)"
                :is-proposal-expired="isProposalExpired(message)"
                :get-message-content="getMessageContent"
                :format-time="formatTime"
                @accept="acceptProposal(message, 'Accepted')"
                @decline="declineProposal(message, 'Refused')"
              />
            </div>
          </template>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="activeConversation && !messages.length"
        class="flex flex-col items-center justify-center h-full text-gray-500"
      >
        <p>Aucun message pour le moment</p>
      </div>

      <!-- Typing indicator -->
      <TypingIndicator
        v-if="typingUsers.length > 0"
        :typing-users="typingUsers"
      />
    </IonContent>

    <!-- Message input area -->
    <IonFooter
      class="bg-white p-3 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] border-t border-[#eee]"
    >
      <CardMissionsValidate
        :activeConversation="activeConversation"
        :data="{
          nounu: dataChat.nounou.id,
          parent: dataChat.parent.id,
          userId: dataChat.parent?.user?.id,
        }"
        :isStatus="isStatus"
      />

      <MessageInputForm
        v-model="newMessage"
        @input="handleInput"
        @send="sendMessage"
      />
    </IonFooter>
  </IonPage>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  defineAsyncComponent,
} from "vue";
import { format, isToday, isYesterday, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import { SettingServices } from "@/services/setting.services";
import { useRoute } from "vue-router";
import MessagerieDetailHeader from "@/components/headers/MessagerieDetailHeader.vue";
import { IonButton, IonContent, IonFooter, IonPage } from "@ionic/vue";
import ChatMessageForm from "@/components/forms/chatMessageForm.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { SocketService } from "@/services/socket.services";
import moment from "moment";
import CardMissionsValidate from "./__partials/cardMissionsValidate.vue";
import { useNotificationHook } from "@/hooks/notificationHooks/notification.hook";

// Composants asynchrones pour améliorer les performances
const MessageBubble = defineAsyncComponent(
  () => import("./__partials/MessageBubble.vue")
);
const ProposalCard = defineAsyncComponent(
  () => import("./__partials/ProposalCard.vue")
);
const TypingIndicator = defineAsyncComponent(
  () => import("./__partials/TypingIndicator.vue")
);
const MessageInputForm = defineAsyncComponent(
  () => import("./__partials/MessageInputForm.vue")
);



// Interfaces for type safety
interface User {
  id: any;
  name: string;
  role: any;
}

interface Message {
  id: any;
  content: string;
  sender: User;
  room: any;
  createdAt: string;
  isRead: boolean;
  isProposition: boolean;
  propositionExpired: string;
  expired?: string;
  status?: "Accepted" | "Refused" | "Pending";
  proposalStatus?: "Accepted" | "Refused" | "Pending";
}

interface MessageGroup {
  date: string;
  messages: Message[];
}

// Component props
const props = defineProps({
  dataChat: {
    type: Object as () => any,
    required: true,
  },
  typeProfil: {
    type: String,
    required: true,
  },
  activeConversation: {
    type: [String, Number],
    required: true,
  },
});

// Reactive state
const currentUser = ref<User>({
  id: "",
  name: "",
  role: "parent", // Default value
});
const content = ref<any>(null);
const messages = ref<Message[]>([]);
const newMessage = ref("");
const socketService = new SocketService();
const route = useRoute();
const hasNewMessages = ref(false);
const updateIntervals = ref<Record<string, number>>({});
const isStatus = ref<"Accepted" | "Refused" | "Pending">("Pending");

// Computed properties
const groupedMessages = computed(() => {
  const groups: MessageGroup[] = [];

  messages.value.forEach((message) => {
    const messageDate = new Date(message.createdAt).toISOString().split("T")[0];

    // Chercher si un groupe avec cette date existe déjà
    const existingGroup = groups.find((group) => group.date === messageDate);

    if (existingGroup) {
      existingGroup.messages.push(message);
    } else {
      groups.push({
        date: messageDate,
        messages: [message],
      });
    }
  });

  return groups;
});

// Methods
const isProposalExpired = (message: Message) => {
  return message.expired === "Proposition expirée";
};

const joinRoom = () => {
  socketService.emit("joinRoom", props.activeConversation);
};

/**
 * Formate l'en-tête de date pour les groupes de messages
 * @param {string} dateString - La date à formater
 * @returns {string} Date formatée
 */
const formatDateHeader = (dateString: string): string => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return "Aujourd'hui";
  } else if (isYesterday(date)) {
    return "Hier";
  } else {
    return format(date, "d MMMM yyyy", { locale: fr });
  }
};

/**
 * Parses message content if it's JSON, otherwise returns empty object
 * @param {Message} message - The message to parse
 * @returns {Object} Parsed message content or empty object
 */
const getMessageContent = (message: Message) => {
  try {
    return JSON.parse(message.content);
  } catch {
    return {};
  }
};

/**
 * Checks if the sender is the current user
 * @param {number} senderId - The sender's ID to check
 * @returns {boolean} True if sender is current user
 */
const isCurrentUser = (senderId: any) => {
  return senderId === currentUser.value.id;
};

/**
 * Formats the expiration time for a proposal
 * @param {string} timestamp - The expiration timestamp
 * @returns {string} Formatted expiration message
 */
const formatExpiredTime = (timestamp: string): string => {
  const diffTime = moment(timestamp).diff(moment());
  const duration = moment.duration(diffTime);

  if (duration.asSeconds() <= 0) {
    return "Proposition expirée";
  }

  const days = Math.floor(duration.asDays());
  const hours = Math.floor(duration.asHours() % 24);
  const minutes = Math.floor(duration.asMinutes() % 60);
  const seconds = Math.floor(duration.asSeconds() % 60);

  const parts = [];
  if (days > 0) parts.push(`${days} jour${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} heure${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  if (seconds > 0 && days === 0 && hours === 0) {
    parts.push(`${seconds} seconde${seconds > 1 ? "s" : ""}`);
  }

  return parts.length > 0
    ? `En attente, cette proposition expire dans ${parts.join(" et ")}`
    : "Proposition expirée";
};

/**
 * Starts dynamic updates for proposal expiration countdown
 * @param {string} messageId - The ID of the message to update
 */
const startDynamicUpdate = (messageId: string) => {
  if (updateIntervals.value[messageId]) return;

  updateIntervals.value[messageId] = window.setInterval(() => {
    messages.value = messages.value.map((msg: any) => {
      if (msg.id === messageId) {
        return {
          ...msg,
          expired: formatExpiredTime(msg.propositionExpired),
          status: msg?.proposalStatus,
        };
      }
      return msg;
    });
  }, 1000);
};

/**
 * Scrolls the chat to the bottom
 */
const scrollToBottom = () => {
  content.value?.$el.scrollToBottom(500);
  hasNewMessages.value = false;
};

/**
 * Updates the proposal status in database and in the component's state
 * @param {Message} message - The message that was accepted or refused
 * @param {string} status - The new status of the proposal (accepted or refused)
 */
const createdNewContractOrRefused = async (
  message: Message,
  status: "Accepted" | "Refused" | "Pending"
) => {
  if (!message || isProposalExpired(message)) return;

  try {
    const response = await SettingServices().createSetting(
      `${URL_API_ROUTE.PROPOSAL_STATUS}`,
      {
        roomId: props.activeConversation,
        messageId: message.id,
        status,
      }
    );
    if (response) {
      isStatus.value = status;
      messages.value = messages.value.map((msg: any) => {
        if (msg.id === message.id) {
          msg.status = status;
          msg.proposalStatus = status;
        }
        return msg;
      });
    }
  } catch (error) {
    console.error("Failed to accept proposal:", error);
  }
};

/**
 * Handles proposal acceptance
 * @param {Message} message - The message to accept
 * @param {string} status - The status to set ('Accepted')
 */
const acceptProposal = async (
  message: Message,
  status: "Accepted" | "Refused" | "Pending"
) => {
  await createdNewContractOrRefused(message, status);
};

/**
 * Handles proposal refusal
 * @param {Message} message - The message to refuse
 * @param {string} status - The status to set ('Refused')
 */
const declineProposal = async (
  message: Message,
  status: "Accepted" | "Refused" | "Pending"
) => {
  await createdNewContractOrRefused(message, status);
};

/**
 * Loads messages for the current conversation
 */
const loadMessages = async () => {
  if (!props.activeConversation) return;

  try {
    const response = await SettingServices().listSetting(
      `${URL_API_ROUTE.MESSAGE_ROOM}?roomId=${props.activeConversation}`
    );

    messages.value = response.map((msg: Message) => ({
      ...msg,
      expired: msg.isProposition
        ? formatExpiredTime(msg.propositionExpired)
        : undefined,
    }));

    // Start updates for proposal messages
    response.forEach((msg: Message) => {
      if (msg.isProposition) {
        startDynamicUpdate(msg.id);
      }
    });

    // Update status from contract data if available
    if (props.dataChat?.contract[0]?.message?.proposalStatus) {
      isStatus.value = props.dataChat.contract[0].message.proposalStatus;
    }

    setTimeout(() => {
      scrollToBottom();
    }, 500);
  } catch (error) {
    console.error("Failed to load messages:", error);
  }
};

/**
 * Sends a new message
 */
const sendMessage = () => {
  if (!newMessage.value.trim() || !props.activeConversation) return;

  socketService.emit("sendMessage", {
    roomId: props.activeConversation,
    content: newMessage.value,
    isProposition: false,
    type: "Message",
  });

  newMessage.value = "";
};
/**
 * Sets up socket event listeners
 */
const setupSocketListeners = () => {
  socketService.on("newMessage", (message: Message) => {
    
    if (
      props.activeConversation &&
      message.room.id == props.activeConversation
    ) {
      // Check if message already exists before adding
      const messageExists = messages.value.some((msg) => msg.id === message.id);
      if (!messageExists) {
        messages.value.push({
          ...message,
          expired: message.isProposition
            ? formatExpiredTime(message.propositionExpired)
            : undefined,
        });
      }

      scrollToBottom();

      if (message.isProposition) {
        startDynamicUpdate(message.id);
      }

      if (!isCurrentUser(message.sender.id)) {
        hasNewMessages.value = true;
        markAsRead();
      }
    }
  });
};

/**
 * Marks messages as read
 */
const markAsRead = () => {
  if (!props.activeConversation) return;
  socketService.emit(
    "markAsRead",
    parseInt(props.activeConversation.toString())
  );
};

/**
 * Formats a timestamp to display time only
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted time string
 */
const formatTime = (dateString: string): string => {
  return format(new Date(dateString), "HH:mm");
};

// États pour le typing
const typingUsers = ref<Array<{ id: number; name: string }>>([]);
const typingTimeout = ref<NodeJS.Timeout | null>(null);
const isCurrentlyTyping = ref(false);

// Détection de la saisie utilisateur
const handleInput = () => {
  if (!isCurrentlyTyping.value) {
    isCurrentlyTyping.value = true;
    socketService.emit("typingStart", {
      roomId: props.activeConversation,
      userId: currentUser.value.id,
      userName: currentUser.value.name,
    });
  }

  // Réinitialise le timeout à chaque frappe
  if (typingTimeout.value) clearTimeout(typingTimeout.value);
  typingTimeout.value = setTimeout(stopTyping, 2000);
};

const stopTyping = () => {
  isCurrentlyTyping.value = false;
  socketService.emit("typingStop", {
    roomId: props.activeConversation,
    userId: currentUser.value.id,
  });
};

// Lifecycle hooks
onMounted(async () => {
  // Get current user info
  const storedUser = await StorageUtils().getStore("nUser_Id");
  const storedUserName = await StorageUtils().getStore("nUser_Name");
  const storedUserRole = await StorageUtils().getStore("nUser_Role");

  currentUser.value = {
    id: storedUser?.value || "",
    name: storedUserName?.value || "",
    role: storedUserRole?.value || "parent",
  };

  // Join the chat room
  joinRoom();

  // Load messages
  loadMessages();

  // Setup socket listeners
  setupSocketListeners();

  // Setup typing listeners
  socketService.on(
    "userTyping",
    (data: { userId: number; userName: string }) => {
      if (data.userId !== currentUser.value.id) {
        const existingUser = typingUsers.value.find(
          (user) => user.id === data.userId
        );
        if (!existingUser) {
          typingUsers.value.push({
            id: data.userId,
            name: data.userName,
          });
        }
      }
    }
  );

  socketService.on("userStoppedTyping", (userId: any) => {
    console.log(userId, typingUsers.value)
    typingUsers.value = typingUsers.value.filter((user) => user.id !== userId?.userId);
  });

  // Mark messages as read when conversation is opened
  markAsRead();
});

onUnmounted(() => {
  // Clear all update intervals
  Object.values(updateIntervals.value).forEach((interval) => {
    clearInterval(interval);
  });

  // Clear typing timeout
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }

  // Remove socket listeners
  socketService.off("newMessage");
  socketService.off("userTyping");
  socketService.off("userStoppedTyping");
});
</script>

<style scoped>
/* Animation pour l'indicateur de frappe */
@keyframes typing {
  0% {
    transform: translateY(0px);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-5px);
    opacity: 1;
  }
  100% {
    transform: translateY(0px);
    opacity: 0.4;
  }
}

.animate-typing {
  animation: typing 1s infinite;
}

/* Animation pour les messages */
.message-container {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
