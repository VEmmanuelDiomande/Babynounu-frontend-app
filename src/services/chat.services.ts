import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import axios from "axios";

export const ChatServices = () => {
  const getAuthHeaders = async () => {
    const nToken = await StorageUtils().getStore("nToken");
    const token = nToken?.value;
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const getConversations = async (): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(URL_API_ROUTE.MESSAGE_USER, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des conversations");
    }
  };

  const getRoom = async (roomId: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.MESSAGE_ROOM}/${roomId}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération de la conversation");
    }
  };

  const getMessages = async (roomId: number, page = 1, limit = 50): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.MESSAGE_ROOM}/${roomId}/messages`, {
        headers,
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des messages");
    }
  };

  const sendMessage = async (
    roomId: number,
    content: string,
    isProposition?: boolean,
    propositionExpired?: string,
    montant?: number,
    periode?: string
  ): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${URL_API_ROUTE.MESSAGE_CREATE}/${roomId}/messages`,
        { content, isProposition, propositionExpired, montant, periode },
        { headers }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de l'envoi du message");
    }
  };

  const sendMessageWithFile = async (
    roomId: number,
    file: File | Blob,
    fileName: string,
    content?: string
  ): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const formData = new FormData();
      formData.append('file', file, fileName);
      if (content) formData.append('content', content);
      const response = await axios.post(
        `${URL_API_ROUTE.MESSAGE_CREATE}/${roomId}/messages/file`,
        formData,
        { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de l'envoi du fichier");
    }
  };

  const findOrCreateRoom = async (receiverId: string, nounuId?: string, parentId?: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        URL_API_ROUTE.MESSAGE_CREATE,
        { receiverId, nounuId, parentId },
        { headers }
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const err = new Error(error.response.data?.message || "Erreur serveur");
        (err as any).status = error.response.status;
        throw err;
      }
      throw new Error("Erreur lors de la création de la conversation");
    }
  };

  const markAsRead = async (roomId: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${URL_API_ROUTE.MESSAGE_ROOM}/${roomId}/read`,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors du marquage comme lu");
    }
  };

  const getUnreadCount = async (): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.MESSAGE_USER}/unread-count`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération du nombre de non lus");
    }
  };

  return {
    getConversations,
    getRoom,
    getMessages,
    sendMessage,
    sendMessageWithFile,
    findOrCreateRoom,
    markAsRead,
    getUnreadCount,
  };
};
