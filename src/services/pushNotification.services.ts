import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { apiClient } from '@/lib/api';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { StorageUtils } from '@/utils/store.utils';

const PUSH_REGISTER_URL = URL_API_ROUTE.PUSH_REGISTER;
const PUSH_UNREGISTER_URL = URL_API_ROUTE.PUSH_UNREGISTER;
const PUSH_TOKEN_STORAGE_KEY = 'nPushToken';

// Canal Android utilisé par le backend FCM (push-notification.service.ts channelId)
const ANDROID_CHANNEL_ID = 'babynounu_notifications';

export type PushNotificationHandler = (data: { type: string; screen?: string; [key: string]: any }) => void;

class PushNotificationService {
  private initialized = false;
  private handlers: PushNotificationHandler[] = [];

  async init(): Promise<void> {
    if (this.initialized) return;
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      // Créer le canal de notification Android utilisé par le backend FCM.
      // Sans ce canal, les notifications push avec channelId='babynounu_notifications'
      // peuvent ne pas s'afficher sur Android 8+.
      if (Capacitor.getPlatform() === 'android') {
        try {
          await LocalNotifications.createChannel({
            id: ANDROID_CHANNEL_ID,
            name: 'Notifications BabyNounu',
            description: 'Canal principal pour les notifications push BabyNounu',
            importance: 5, // HIGH
            visibility: 1, // PUBLIC
            sound: 'bell_notification.mp3',
          });
        } catch (channelErr) {
          // Le canal existe peut-être déjà — ignorer l'erreur
          console.warn('[Push] Channel creation warning:', channelErr);
        }
      }

      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('[Push] Permission not granted for push notifications');
        return;
      }

      // IMPORTANT: Add listeners BEFORE calling register() to avoid a race condition
      // where the 'registration' event fires before the listener is attached.
      await PushNotifications.addListener('registration', async (token: Token) => {
        console.log('[Push] FCM token received:', token.value.substring(0, 20) + '...');
        await this.storeTokenLocally(token.value);
        await this.registerTokenWithBackend(token.value);
      });

      await PushNotifications.addListener('registrationError', (err) => {
        console.error('[Push] Registration error:', err);
      });

      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('[Push] Notification received:', notification);
        const data = notification.data || {};
        if (data.type) {
          this.handlers.forEach((h) => h(data));
        }
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('[Push] Notification action performed:', notification);
        const data = notification.notification.data || {};
        if (data.type) {
          this.handlers.forEach((h) => h(data));
        }
      });

      await PushNotifications.register();

      this.initialized = true;
      console.log('[Push] Push notification service initialized');
    } catch (error) {
      console.error('[Push] Init error:', error);
    }
  }

  private async storeTokenLocally(token: string): Promise<void> {
    try {
      await StorageUtils().setStore(PUSH_TOKEN_STORAGE_KEY, token);
    } catch (error) {
      console.error('[Push] Failed to store token locally:', error);
    }
  }

  private async registerTokenWithBackend(token: string): Promise<void> {
    try {
      const userId = (await StorageUtils().getStore('nUser_Id'))?.value;
      if (!userId) {
        console.warn('[Push] No user ID found, skipping backend token registration');
        return;
      }

      const platform = Capacitor.getPlatform();
      await apiClient.post(PUSH_REGISTER_URL, { token, platform });
      console.log('[Push] Token registered with backend for user:', userId);
    } catch (error) {
      console.error('[Push] Failed to register token with backend:', error);
    }
  }

  async unregisterToken(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      const token = await this.getRegisteredToken();
      if (token) {
        await apiClient.delete(PUSH_UNREGISTER_URL, { data: { token } });
        await StorageUtils().removeStore(PUSH_TOKEN_STORAGE_KEY);
        console.log('[Push] Token unregistered from backend');
      }
    } catch (error) {
      console.error('[Push] Failed to unregister token:', error);
    }
  }

  private async getRegisteredToken(): Promise<string | null> {
    try {
      const result = await StorageUtils().getStore(PUSH_TOKEN_STORAGE_KEY);
      return result?.value || null;
    } catch {
      return null;
    }
  }

  onNotification(handler: PushNotificationHandler): void {
    this.handlers.push(handler);
  }

  clearHandlers(): void {
    this.handlers = [];
  }

  /**
   * Verifie l'etat actuel de la permission de notification push.
   * Retourne 'granted', 'denied', 'prompt' ou 'unsupported' (web).
   */
  async checkPermissionStatus(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
    if (!Capacitor.isNativePlatform()) return 'unsupported';
    try {
      const status = await PushNotifications.checkPermissions();
      return status.receive as 'granted' | 'denied' | 'prompt';
    } catch {
      return 'denied';
    }
  }

  /**
   * Active les notifications push : demande la permission si necessaire,
   * initialise le service et enregistre le token FCM aupres du backend.
   * Retourne true si active avec succes, false sinon.
   */
  async enable(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      console.warn('[Push] Enable: not a native platform');
      return false;
    }
    // Re-init meme si deja initialise (cas ou on a desactive puis reactive)
    this.initialized = false;
    await this.init();
    const status = await this.checkPermissionStatus();
    return status === 'granted';
  }

  /**
   * Desactive les notifications push : desenregistre le token FCM aupres
   * du backend et supprime le token local. La permission OS reste accordee
   * (Android ne permet pas de revoquer programmatiquement) mais le device
   * ne recevra plus de push car le token n'est plus valide cote serveur.
   */
  async disable(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await this.unregisterToken();
      this.initialized = false;
      console.log('[Push] Push notifications disabled (token unregistered)');
    } catch (error) {
      console.error('[Push] Failed to disable push notifications:', error);
    }
  }

  async showLocalNotification(title: string, body: string, extra?: Record<string, unknown>): Promise<void> {
    try {
      const { display } = await LocalNotifications.requestPermissions();
      if (display !== 'granted') return;

      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 1000) },
            extra: extra || {},
          },
        ],
      });
    } catch (error) {
      console.error('[Push] Local notification error:', error);
    }
  }
}

export const pushNotificationService = new PushNotificationService();
