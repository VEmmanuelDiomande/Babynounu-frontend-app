import { ChatServices } from '@/services/chat.services';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<any[]>([]);
  const currentRoom = ref<any>(null);
  const currentMessages = ref<any[]>([]);
  const unreadCount = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const chatServices = ChatServices();

  const fetchConversations = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const data = await chatServices.getConversations();
      conversations.value = Array.isArray(data) ? data : (data?.data || []);
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchRoom = async (roomId: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      const data = await chatServices.getRoom(roomId);
      currentRoom.value = data;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMessages = async (roomId: number, page = 1, limit = 50) => {
    try {
      isLoading.value = true;
      error.value = null;
      const data = await chatServices.getMessages(roomId, page, limit);
      currentMessages.value = Array.isArray(data) ? data : (data?.data || data?.messages || []);
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const sendMessage = async (
    roomId: number,
    content: string,
    isProposition?: boolean,
    propositionExpired?: string,
    montant?: number,
    periode?: string
  ) => {
    try {
      error.value = null;
      const message = await chatServices.sendMessage(roomId, content, isProposition, propositionExpired, montant, periode);
      if (currentRoom.value?.id === roomId) {
        currentMessages.value = [...currentMessages.value, message];
      }
      return message;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  };

  const sendMessageWithFile = async (roomId: number, file: File | Blob, fileName: string, content?: string) => {
    try {
      error.value = null;
      const message = await chatServices.sendMessageWithFile(roomId, file, fileName, content);
      if (currentRoom.value?.id === roomId) {
        currentMessages.value = [...currentMessages.value, message];
      }
      return message;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  };

  const findOrCreateRoom = async (receiverId: string, nounuId?: string, parentId?: string) => {
    try {
      error.value = null;
      const room = await chatServices.findOrCreateRoom(receiverId, nounuId, parentId);
      return room;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  };

  const markAsRead = async (roomId: number) => {
    try {
      error.value = null;
      await chatServices.markAsRead(roomId);
      if (currentRoom.value?.id === roomId) {
        currentRoom.value = { ...currentRoom.value, unreadCounts: [] };
      }
      conversations.value = conversations.value.map((room: any) =>
        room.id === roomId ? { ...room, unreadCounts: [] } : room
      );
    } catch (e: any) {
      error.value = e.message;
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await chatServices.getUnreadCount();
      unreadCount.value = data?.count || data?.unreadCount || 0;
    } catch (e: any) {
      // silent fail
    }
  };

  const resetState = () => {
    conversations.value = [];
    currentRoom.value = null;
    currentMessages.value = [];
    unreadCount.value = 0;
    isLoading.value = false;
    error.value = null;
  };

  return {
    conversations,
    currentRoom,
    currentMessages,
    unreadCount,
    isLoading,
    error,
    fetchConversations,
    fetchRoom,
    fetchMessages,
    sendMessage,
    sendMessageWithFile,
    findOrCreateRoom,
    markAsRead,
    fetchUnreadCount,
    resetState,
  };
});
