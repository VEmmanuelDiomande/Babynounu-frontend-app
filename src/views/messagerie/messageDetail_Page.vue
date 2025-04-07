<script setup lang="ts">
import { SocketService } from "@/services/socket.services";
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const socketService = new SocketService();

const room = ref("general");
const conversation = ref<any>();
const messages = ref<{ sender: string; content: string }[]>([]);
const newMessage = ref("");
const sender = ref("User" + Math.floor(Math.random() * 100));
const typingUser = ref<string | null>(null);
let typingTimeout: NodeJS.Timeout | null = null;

const joinRoom = () => {
  socketService.emit("joinRoom", room.value);
};

const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    socketService.emit("sendMessage", {
      sender: sender.value,
      content: newMessage.value,
      room: room.value,
    });
    newMessage.value = "";
  }
};

const sendTypingEvent = () => {
  socketService.emit("typing", { sender: sender.value, room: room.value });

  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    typingUser.value = null;
  }, 3000); // Arrête d'afficher "X est en train d'écrire..." après 3 secondes d'inactivité
};

// Get Only Conversation
const GetConversation = () => {
  socketService.emit("getConversation", room.value);
}

const route = useRoute();

onMounted(() => {

  room.value = route.params.id.toString();
  console.log(room.value )

  GetConversation();
  joinRoom();

  socketService.on("conversation", (conversation) => {
    conversation.value = conversation
    console.log(conversation.value);
  });

  socketService.on("loadMessages", (loadedMessages) => {
    messages.value = loadedMessages;
  });

  socketService.on("newMessage", (message) => {
    messages.value.push(message);
  });

  socketService.on("typing", (user) => {
    typingUser.value = user;
  });
});

onUnmounted(() => {
  (socketService as any).off("loadMessages");
  (socketService as any).off("newMessage");
  (socketService as any).off("typing");
});
</script>

<template>
  <div>
    <h2>Chat Room: {{ room }}</h2>
    <div v-for="(msg, index) in messages" :key="index">
      <strong>{{ msg.sender }}:</strong> {{ msg.content }}
    </div>
    <p v-if="typingUser">{{ typingUser }} est en train d'écrire...</p>
    <input
      v-model="newMessage"
      @input="sendTypingEvent"
      @keyup.enter="sendMessage"
      placeholder="Type a message..."
    />
    <button @click="sendMessage">Send</button>
  </div>
</template>
