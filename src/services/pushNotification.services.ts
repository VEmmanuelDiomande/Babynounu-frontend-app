import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { apiClient } from '@/lib/api';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { StorageUtils } from '@/utils/store.utils';

const PUSH_REGISTER_URL = URL_API_ROUTE.PUSH_REGISTER;
const PUSH_UNREGISTER_URL = URL_API_ROUTE.PUSH_UNREGISTER;

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
      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        return;
      }

      await PushNotifications.register();

      await PushNotifications.addListener('registration', async (token: Token) => {
        await this.registerTokenWithBackend(token.value);
      });

      await PushNotifications.addListener('registrationError', (err) => {
        console.error('Push registration error:', err);
      });

      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        const data = notification.data || {};
        if (data.type) {
          this.handlers.forEach((h) => h(data));
        }
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        const data = notification.notification.data || {};
        if (data.type) {
          this.handlers.forEach((h) => h(data));
        }
      });

      this.initialized = true;
    } catch (error) {
      console.error('Push notification init error:', error);
    }
  }

  private async registerTokenWithBackend(token: string): Promise<void> {
    try {
      const userId = (await StorageUtils().getStore('nUser_Id'))?.value;
      if (!userId) return;

      const platform = Capacitor.getPlatform();
      await apiClient.post(PUSH_REGISTER_URL, { token, platform });
    } catch (error) {
      console.error('Failed to register push token:', error);
    }
  }

  async unregisterToken(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      const token = await this.getRegisteredToken();
      if (token) {
        await apiClient.delete(PUSH_UNREGISTER_URL, { data: { token } });
      }
    } catch (error) {
      console.error('Failed to unregister push token:', error);
    }
  }

  private async getRegisteredToken(): Promise<string | null> {
    return null;
  }

  onNotification(handler: PushNotificationHandler): void {
    this.handlers.push(handler);
  }

  clearHandlers(): void {
    this.handlers = [];
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
      console.error('Local notification error:', error);
    }
  }
}

export const pushNotificationService = new PushNotificationService();
