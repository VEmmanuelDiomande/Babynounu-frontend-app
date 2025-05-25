// src/services/socket.service.ts
import { BASE_URL_CENTER } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = BASE_URL_CENTER;

export class SocketService {
  private socket: Socket | null = null;
  private connectionPromise: Promise<Socket> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private readonly reconnectDelay = 150000; // 15s entre les tentatives
  private eventListeners: Map<string, (data: any) => void> = new Map();

  private async getAuthOptions() {
    try {
      const [token, userId, typeProfil, profilId] = await Promise.all([
        StorageUtils().getStore("nToken"),
        StorageUtils().getStore("nUser_Id"),
        StorageUtils().getStore("nType_Profil"),
        StorageUtils().getStore("nProfil_1_Id"),
      ]);

      if (!token?.value || !userId?.value || !typeProfil?.value) {
        // throw new Error("Missing authentication data");
      }

      return {
        token: token.value,
        authorization: 'Bearer ' + token.value,
        user: {
          id: userId.value,
          type_profil: {
            slug: typeProfil.value,
          },
        },
        profile: {
          id: profilId.value,
        },
      };
    } catch (error) {
      console.error("Failed to get auth options:", error);
      throw error;
    }
  }

  async connect(): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (!this.connectionPromise) {
      this.connectionPromise = (async () => {
        try {
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            throw new Error('Max reconnection attempts reached');
          }

          const authOptions = await this.getAuthOptions();
          this.reconnectAttempts++;

          this.socket = io(SOCKET_URL, {
            timeout: 20000, // 20s (valeur plus raisonnable)
            auth: authOptions,
            autoConnect: true,
            reconnection: true, // ✅ Activer la reconnexion automatique
            reconnectionAttempts: 5, // Nombre max de tentatives
            reconnectionDelay: 5000, // Délai entre les tentatives (5s)
            // transports: ["websocket"],
          });

          // Gestionnaire de déconnexion
          this.socket.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
              // Reconnexion seulement si le serveur a déconnecté
              setTimeout(() => this.connect(), this.reconnectDelay);
            }
          });

          await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => {
              reject(new Error('Connection timeout'));
            }, 1000000);

            this.socket?.once('connect', () => {
              clearTimeout(timer);
              this.reconnectAttempts = 0; // Reset du compteur après connexion réussie
              resolve();
            });

            this.socket?.once('connect_error', (error) => {
              clearTimeout(timer);
              reject(error);
            });

            this.socket?.connect();
          });

          return this.socket;
        } catch (error) {
          this.cleanup();
          throw error;
        } finally {
          this.connectionPromise = null;
        }
      })();
    }

    return this.connectionPromise.then(() => this.socket as Socket);
  }

  private cleanup() {
    if (this.socket) {
      this.socket.off('connect');
      this.socket.off('connect_error');
      this.socket.off('disconnect');
      this.socket.disconnect();
      this.socket = null;
    }
  }


  async on(event: string, callback: (data: any) => void): Promise<void> {
    this.eventListeners.set(event, callback);
    const socket = await this.connect();
    socket.on(event, callback);
  }

  async off(event: string): Promise<void> {
    this.eventListeners.delete(event);
    const socket = await this.getSocket();
    socket?.off(event);
  }

  async emit(event: string, data?: any, acknowledge?: (response: any) => void): Promise<void> {
    try {
      const socket = await this.connect();
      if (acknowledge) {
        socket.emit(event, data, acknowledge);
      } else {
        socket.emit(event, data);
      }
    } catch (error) {
      console.error("Emit failed, retrying...", error);
      setTimeout(() => this.emit(event, data, acknowledge), 1000); // Retry après 1s
    }
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.eventListeners.clear();
      this.cleanup();
    }
  }

  async getSocket(): Promise<Socket | null> {
    try {
      return await this.connect();
    } catch {
      return null;
    }
  }
}

// Singleton pattern pour une seule instance de socket
export const socketService = new SocketService();