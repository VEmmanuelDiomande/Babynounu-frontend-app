<template>
  <TabButton
    v-for="(tab, index) in tabs"
    :key="index"
    :tab="tab"
    :has-notifications="tab.tab === 'tab4' && hasNotifications"
    :notification-count="notificationCount"
    :has-unread-messages="tab.tab === 'tab3' && hasUnreadMessages"
    :unread-messages-count="unreadMessagesCount"
    @update-page="updatePage"
  />
</template>

<script lang="ts" setup>
import {
  IonPage,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
} from "@ionic/vue";
import { ref, computed, onMounted, onActivated } from "vue";
import { useTabHook } from "@/hooks/menuHooks/useTab.hook";
import { StorageUtils } from "@/utils/store.utils";
import { useNotificationStore } from "@/stores/notificationStore";
import { SocketService } from "@/services/socket.services";
import TabButton from "@/components/tabs/TabButton.vue";

// Définition des types
interface TabItem {
  tab: string;
  link: string;
  name?: string;
  icon: string;
  iconFull: string;
}

// Méthode pour mettre à jour les vues de notification
const updatePage = async (tab: TabItem) => {
  if (tab.tab === "tab4") {
    const userId = await StorageUtils().getStore("nUser_Id");
    new SocketService().emit("updateViewByUserId", {
      userId: userId.value,
    });
  }
};

// Accès aux stores pour les notifications
const notificationStore = useNotificationStore();
const notificationCount = computed(() => notificationStore.state.countNotification);
const hasNotifications = computed(() => notificationCount.value > 0);
const unreadMessagesCount = computed(() => notificationStore.state.countMessage?.totalUnread || 0);
const hasUnreadMessages = computed(() => unreadMessagesCount.value > 0);

// Tabs dynamiques pour les nounus
const { state, configureNounuTabs } = useTabHook();
const tabs = computed(() => {
  // Utiliser directement les onglets pour les nounus
  const menuTabs = [...state.menuJobTabs]; // Copie pour éviter la mutation directe
  
  // Configurer les onglets spécifiques pour les nounus
  configureNounuTabs(menuTabs);
  
  return menuTabs;
});

</script>