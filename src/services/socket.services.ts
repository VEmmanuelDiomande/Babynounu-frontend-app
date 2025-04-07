// src/services/socket.service.ts
import { BASE_URL_CENTER } from '@/routes/_requests/index.request';
import { StorageUtils } from '@/utils/store.utils';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = BASE_URL_CENTER;

export class SocketService {
  private socket: Socket | null = null;
  private connectionPromise: Promise<void> | null = null;

  private async getAuthOptions() {
    try {
      const [token, userId, typeProfil] = await Promise.all([
        StorageUtils().getStore("nToken"),
        StorageUtils().getStore("nUser_Id"),
        StorageUtils().getStore("nType_Profil"),
      ]);

      if (!token?.value || !userId?.value || !typeProfil?.value) {
        throw new Error('Missing authentication data');
      }

      return {
        authorization: token.value,
        user: {
          id: userId.value,
          type_profil: {
            slug: typeProfil.value,
          },
        },
      };
    } catch (error) {
      console.error('Failed to get auth options:', error);
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
          const authOptions = await this.getAuthOptions();
          
          this.socket = io(SOCKET_URL, {
            auth: authOptions,
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
          });

          await new Promise<void>((resolve, reject) => {
            this.socket?.on('connect', resolve);
            this.socket?.on('connect_error', reject);
            this.socket?.connect();
          });

          this.setupErrorHandling();
        } catch (error) {
          this.cleanup();
          throw error;
        } finally {
          this.connectionPromise = null;
        }
      })();
    }

    await this.connectionPromise;
    return this.socket as Socket;
  }

  private setupErrorHandling() {
    this.socket?.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        this.socket?.connect();
      }
    });

    this.socket?.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.cleanup();
    });
  }

  private cleanup() {
    this.socket?.off('connect');
    this.socket?.off('connect_error');
    this.socket?.disconnect();
    this.socket = null;
    this.connectionPromise = null;
  }

  async on(event: string, callback: (data: any) => void): Promise<void> {
    const socket = await this.connect();
    socket.on(event, callback);
  }

  async emit(event: string, data?: any): Promise<void> {
    const socket = await this.connect();
    socket.emit(event, data);
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.disconnect();
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