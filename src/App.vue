<template>
  <router-view />
  <ToastContainer />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { pushNotificationService } from '@/services/pushNotification.services';
import { socketService } from '@/services/socket.services';
import { useNotificationStore } from '@/stores/notificationStore';
import { StorageUtils } from '@/utils/store.utils';
import ToastContainer from '@/components/ui/Toast/ToastContainer.vue';

const router = useRouter();
const notificationStore = useNotificationStore();

const initRealtime = async () => {
  const token = (await StorageUtils().getStore('nToken'))?.value;
  if (!token) return;

  await pushNotificationService.init();

  pushNotificationService.onNotification((data) => {
    if (data.screen === 'NOTIFICATIONS') {
      router.push({ name: 'NOTIFICATIONS' });
    } else if (data.screen === 'CHAT_MESSAGE_DETAIL' && data.roomId) {
      router.push({ name: 'CHAT_MESSAGE_DETAIL', params: { id: data.roomId } });
    }
  });

  socketService.on('newNotification', (data: any) => {
    if (!socketService.isConnected()) {
      pushNotificationService.showLocalNotification(data.title || 'BabyNounu', data.message, {
        type: data.type,
        screen: 'NOTIFICATIONS',
      });
    }
  });
};

onMounted(() => {
  initRealtime();

  if (Capacitor.isNativePlatform()) {
    // StatusBar transparent : le contenu du WebView s'affiche sous la status bar.
    // SystemBars (capacitor.config.ts, style "LIGHT") garde les icones sombres
    // (heure/batterie) visibles sur le fond clair de l'app.
    // Aucun background defini par Capacitor : la status bar montre le contenu
    // du WebView (rose-50 ou blanc selon la page).
    // StatusBar.setOverlaysWebView({ overlay: true });
    // StatusBar.setStyle({ style: Style.Dark });

    App.addListener('appUrlOpen', ({ url }) => {
      if (!url) return;

      try {
        const parsed = new URL(url);
        const path = parsed.pathname;
        const searchParams = parsed.searchParams;
        const transactionId = searchParams.get('transaction_id');

        if (path.includes('/payment/return') && transactionId) {
          router.push({
            name: 'PAYMENT_RETURN',
            query: { transaction_id: transactionId },
          });
        }
      } catch (e) {
        console.error('Deep link parse error:', e);
      }
    });
  }
});
</script>
