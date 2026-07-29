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
  private readonly reconnectDelay = 5000; // 5s entre les tentatives (corrigé de 150s)
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();
  private isConnecting = false;

  private async getAuthOptions() {
    try {
      const [token, userId, typeProfil, profilId] = await Promise.all([
        StorageUtils().getStore("nToken"),
        StorageUtils().getStore("nUser_Id"),
        StorageUtils().getStore("nType_Profil"),
        StorageUtils().getStore("nProfil_1_Id"),
      ]);

      // Validation stricte des données d'authentification
      if (!token?.value || !userId?.value || !typeProfil?.value) {
        return null;
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
          id: profilId?.value || null, // Gérer le cas où profilId peut être null
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async connect(): Promise<Socket> {
    // Éviter les connexions multiples simultanées
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.isConnecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    this.isConnecting = true;
    this.connectionPromise = (async () => {
      try {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          throw new Error('Max reconnection attempts reached');
        }

        const authOptions = await this.getAuthOptions();
        
        if (!authOptions) {
          throw new Error('User not authenticated');
        }
        
        this.socket = io(SOCKET_URL, {
          timeout: 20000,
          auth: authOptions,
          autoConnect: false, // Contrôle manuel de la connexion
          reconnection: false, // Désactiver la reconnexion automatique pour la gérer manuellement
           // Fallback sur polling si websocket échoue
        });

        // Gestionnaires d'événements
        this.setupEventHandlers();

        // Connexion avec timeout
        await this.connectWithTimeout();
        
        this.reconnectAttempts = 0; // Reset après connexion réussie
        return this.socket;
      } catch (error) {
        this.cleanup();
        this.reconnectAttempts++;
        throw error;
      } finally {
        this.isConnecting = false;
        this.connectionPromise = null;
      }
    })();

    return this.connectionPromise;
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[Socket] Connected successfully');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      // console.log('Socket disconnected:', reason);
      
      // Reconnexion automatique seulement pour certaines raisons
      if (reason === 'io server disconnect' || reason === 'transport close') {
        this.scheduleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
    });

    // Restaurer les event listeners après reconnexion
    this.socket.on('connect', () => {
      this.restoreEventListeners();
    });
  }

  private async connectWithTimeout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      const timer = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 20000); // 20s timeout

      this.socket.once('connect', () => {
        clearTimeout(timer);
        resolve();
      });

      this.socket.once('connect_error', (error) => {
        clearTimeout(timer);
        reject(error);
      });

      this.socket.connect();
    });
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts); // Backoff exponentiel
      console.log(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private restoreEventListeners(): void {
    if (!this.socket) return;
    
    // Restaurer tous les event listeners stockés
    this.eventListeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket?.off(event, callback); // Éviter les doublons
        this.socket?.on(event, callback);
      });
    });
  }

  private cleanup(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  async on(event: string, callback: (data: any) => void): Promise<void> {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
    
    try {
      const socket = await this.connect();
      socket.off(event, callback); // Éviter les doublons (restoreEventListeners peut déjà l'avoir enregistré)
      socket.on(event, callback);
      console.log(`[Socket] Listener registered for '${event}'`);
    } catch (error) {
      console.warn(`[Socket] Not connected, listener for '${event}' pending. Error:`, error);
    }
  }

  async off(event: string, callback?: (data: any) => void): Promise<void> {
    if (callback) {
      this.eventListeners.get(event)?.delete(callback);
      if (this.socket?.connected) {
        this.socket.off(event, callback);
      }
    } else {
      this.eventListeners.delete(event);
      if (this.socket?.connected) {
        this.socket.off(event);
      }
    }
  }

  async emit(event: string, data?: any, acknowledge?: (response: any) => void): Promise<void> {
    try {
      const socket = await this.connect();
      
      if (!socket.connected) {
        throw new Error('Socket not connected');
      }

      if (acknowledge) {
        socket.emit(event, data, acknowledge);
      } else {
        socket.emit(event, data);
      }
    } catch (error) {
      console.error(`Emit failed for event '${event}':`, error);
      
      // Retry une seule fois après un délai
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.emit(event, data, acknowledge).catch(retryError => {
            console.error(`Retry emit failed for event '${event}':`, retryError);
          });
        }, 1000);
      }
    }
  }

  async disconnect(): Promise<void> {
    this.eventListeners.clear();
    this.reconnectAttempts = this.maxReconnectAttempts; // Empêcher la reconnexion
    this.cleanup();
  }

  async getSocket(): Promise<Socket | null> {
    try {
      return await this.connect();
    } catch (error) {
      console.error('Failed to get socket:', error);
      return null;
    }
  }

  // Méthode utilitaire pour vérifier l'état de connexion
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Méthode pour forcer une reconnexion
  async forceReconnect(): Promise<void> {
    this.disconnect();
    this.reconnectAttempts = 0;
    await this.connect();
  }
}

// Singleton pattern pour une seule instance de socket
export const socketService = new SocketService();