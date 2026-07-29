import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { StorageUtils } from '@/utils/store.utils';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { queryKeys } from '@/lib/query/query-keys';

const getAuthHeaders = async () => {
  const nToken = await StorageUtils().getStore('nToken');
  const token = nToken?.value;
  if (!token) {
    throw new Error("Token d'authentification manquant");
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.messages.rooms(),
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await axios.get(URL_API_ROUTE.MESSAGE_USER, { headers });
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useRoom(roomId: number) {
  return useQuery({
    queryKey: queryKeys.messages.room(roomId.toString()),
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.MESSAGE_ROOM}/${roomId}`, { headers });
      return response.data;
    },
    enabled: !!roomId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useMessages(roomId: number, page = 1, limit = 50) {
  return useQuery({
    queryKey: queryKeys.messages.roomMessages(roomId.toString()),
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.MESSAGE_ROOM}/${roomId}/messages`, {
        headers,
        params: { page, limit },
      });
      return response.data;
    },
    enabled: !!roomId,
    staleTime: 1000 * 60,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      roomId: number;
      content: string;
      isProposition?: boolean;
      propositionExpired?: string;
      montant?: number;
      periode?: string;
    }) => {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${URL_API_ROUTE.MESSAGE_CREATE}/${data.roomId}/messages`,
        { 
          content: data.content, 
          isProposition: data.isProposition, 
          propositionExpired: data.propositionExpired, 
          montant: data.montant, 
          periode: data.periode 
        },
        { headers }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.roomMessages(variables.roomId.toString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.rooms() });
    },
  });
}

export function useSendMessageWithFile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      roomId: number;
      file: File | Blob;
      fileName: string;
      content?: string;
    }) => {
      const headers = await getAuthHeaders();
      const formData = new FormData();
      formData.append('file', data.file, data.fileName);
      if (data.content) formData.append('content', data.content);
      const response = await axios.post(
        `${URL_API_ROUTE.MESSAGE_CREATE}/${data.roomId}/messages/file`,
        formData,
        { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.roomMessages(variables.roomId.toString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.rooms() });
    },
  });
}

export function useFindOrCreateRoom() {
  return useMutation({
    mutationFn: async (data: { receiverId: string; nounuId?: string; parentId?: string }) => {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        URL_API_ROUTE.MESSAGE_CREATE,
        { receiverId: data.receiverId, nounuId: data.nounuId, parentId: data.parentId },
        { headers }
      );
      return response.data;
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roomId: number) => {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${URL_API_ROUTE.MESSAGE_ROOM}/${roomId}/read`,
        {},
        { headers }
      );
      return response.data;
    },
    onSuccess: (data, roomId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.roomMessages(roomId.toString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.rooms() });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.unreadCount() });
    },
  });
}
