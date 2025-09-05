<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" class="border-t-0 font-love">
        <ion-tab-button
          v-for="(tab, index) in tabs"
          :key="index"
          :tab="tab.tab"
          :href="tab.link"
          class="flex gap-2"
        >
          <div
            v-if="!tab.name"
            class="w-14 h-10 bg-gray-100 flex justify-center items-center rounded-xl"
          >
            <RiAddLine size="28" class="text-gray-400" />
          </div>
          <div
            v-else
            class="flex flex-col justify-center items-center"
            @click="updatePage(tab)"
          >
            <IcIcons
              :name="getIconName(tab)"
              :size="tab.name ? 28 : 38"
              :class="getIconClass(tab)"
            />
            <p class="text-xr font-love" :class="getTextClass(tab)">
              {{ tab.name }}
            </p>
            <NotificationBadge
              v-if="tab.link === '/notifications' && hasNotifications" 
              :count="notificationCount" 
            />
            <NotificationBadge 
              v-if="tab.link === '/chat' && hasUnreadMessages" 
              :count="unreadMessagesCount" 
            />
          </div>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonPage,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
} from "@ionic/vue";
import { ref, computed, onMounted, onActivated, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useTabHook } from "@/hooks/menuHooks/useTab.hook";
import { StorageUtils } from "@/utils/store.utils";
import IcIcons from "@/components/icons/IcIcons.vue";
import { RiAddLine } from "@remixicon/vue";
import { useUserStore } from "@/stores/user.store";
import { useNotificationStore } from "@/stores/notificationStore";
import { SocketService } from "@/services/socket.services";
import NotificationBadge from "@/components/notifications/NotificationBadge.vue";

// Définition des types
interface TabItem {
  tab: string;
  link: string;
  name?: string;
  icon: string;
  iconFull: string;
}

// State
const route = useRoute();
const nPageType = ref<string | null>(null);
const nType_Profil = ref("");

// Méthode pour récupérer les données depuis le Storage
const fetchPageTypeAndProfile = async () => {
  const pageType = await StorageUtils().getStore("nPageType");
  const typeProfil = await StorageUtils().getStore("nType_Profil");
  nPageType.value = pageType?.value || null;
  nType_Profil.value = typeProfil?.value || "";
};

// Exécuter fetchPageTypeAndProfile lors du montage ou de l'activation du composant
const initializeData = async () => {
  await fetchPageTypeAndProfile();
};
onMounted(initializeData);
onActivated(initializeData);

// Méthode pour mettre à jour les vues de notification
const updatePage = async (tab: TabItem) => {
  if (tab.link === "/notifications") {
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

// Tabs dynamiques basées sur le type de page
const { state, configureNounuTabs, configureParentTabs } = useTabHook();
const tabs = computed(() => {
  const userStore = useUserStore();
  let menuTabs: TabItem[] = [];

  if (nType_Profil.value === "nounu") {
    // Utilisateur nounu
    menuTabs = [...state.menuTabs];
    configureNounuTabs(menuTabs);
  } else if (nType_Profil.value === "parent") {
    // Utilisateur parent (cherche des jobs)
    menuTabs = [...state.menuJobTabs];
    configureParentTabs(menuTabs);
  } else {
    // Fallback basé sur la dernière page visitée
    if (userStore.pageType === "/home/nounus") {
      menuTabs = [...state.menuTabs];
      configureNounuTabs(menuTabs);
    } else {
      menuTabs = [...state.menuJobTabs];
      configureParentTabs(menuTabs);
    }
  }

  return menuTabs;
});

// Fonctions pour les icônes
const getIconName = (tab: TabItem): string => {
  return route.path.includes(tab.link) ? tab.iconFull : tab.icon;
};

const getIconClass = (tab: TabItem): string => {
  return route.path.includes(tab.link) ? "text-primary" : "text-gray-400";
};

const getTextClass = (tab: TabItem): string => {
  return route.path.includes(tab.link)
    ? "text-primary font-extrabold"
    : "font-bold text-zinc-400";
};
</script>
