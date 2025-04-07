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
            @click="UpdatePage(tab)"
          >
            <IcIcons
              :name="getIconName(tab)"
              :size="tab.name ? 28 : 38"
              :class="getIconClass(tab)"
            />
            <p class="text-xr font-love" :class="getTextClass(tab)">
              {{ tab.name }}
            </p>
            <div
              v-if="
                tab.tab == 'tab4' &&
                useNotificationStore().state.countNotification > 0
              "
              class="absolute top-1 ring-2 ring-white right-1 size-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-semibold text-white"
            >
              {{ useNotificationStore().state.countNotification }}
            </div>
            <div
              v-if="
                tab.tab == 'tab3' &&
                useNotificationStore().state.countMessage?.parentUnread > 0
              "
              class="absolute top-1 ring-2 ring-white right-1 size-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-semibold text-white"
            >
              {{ useNotificationStore().state.countMessage?.parentUnread }}
            </div>
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
import { ref, computed, onMounted, onActivated } from "vue";
import { useRoute } from "vue-router";
import { useTabHook } from "@/hooks/menuHooks/useTab.hook";
import { StorageUtils } from "@/utils/store.utils";
import IcIcons from "@/components/icons/IcIcons.vue";
import { RiAddLine } from "@remixicon/vue";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { useConversationStore } from "@/stores/conversationStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { SocketService } from "@/services/socket.services";
import { set } from "zod";

// State
const route = useRoute();
const nPageType = ref<string | null>(null);
const nType_Profil = ref("");

// Méthode pour récupérer les données depuis le Storage
const fetchPageTypeAndProfile = async () => {
  const pageType = await StorageUtils().getStore("nPageType");
  const typeProfil: any = await StorageUtils().getStore("nType_Profil");
  nPageType.value = pageType?.value || null;
  nType_Profil.value = typeProfil?.value;
};

// Exécuter fetchPageTypeAndProfile lors du montage ou de l'activation du composant
const initializeData = async () => {
  await fetchPageTypeAndProfile();
};
onMounted(initializeData);
onActivated(initializeData);



const UpdatePage = async (tab: any) => {
  if (tab.tab == "tab4") {
    new SocketService().emit("updateViewByUserId", {
      userId: (await StorageUtils().getStore("nUser_Id")).value,
    });
  }
};

// Tabs dynamiques basées sur le type de page
const { state } = useTabHook();
const tabs = computed(() => {
  if (useUserStore().pageType && useUserStore().pageType == "/home/nounus") {
    state.menuTabs[0].link = "/home/nounus";
    state.menuTabs[0].tab = "tab1";
    state.menuTabs[1].link = "/search/nounus";
    state.menuTabs[1].tab = "tab2";
  } else {
    state.menuTabs[0].link = "/home/jobs";
    state.menuTabs[0].tab = "tab11";
    state.menuTabs[1].link = "/search/jobs";
    state.menuTabs[1].tab = "tab22";
  }

  if (nType_Profil.value == "parent") {
    state.menuTabs[state.menuTabs.length].link = `/profil/parent`;
  } else if (nType_Profil.value == "nounu") {
    if (state.menuTabs.length == 5) {
      state.menuTabs.splice(2, 1);
    }
    state.menuTabs[3].link = `/profil/nounu`;
  }
  return state.menuTabs;
});

// Méthodes utilitaires pour les classes et icônes
const getIconName = (tab: any) =>
  tab.link === route.path ? tab.iconFull : tab.icon;

const getIconClass = (tab: any) => {
  return tab.link === route.path ? "text-primary" : "text-gray-400";
};

const getTextClass = (tab: any) =>
  tab.link === route.path
    ? "text-primary font-extrabold"
    : "font-bold text-zinc-400";
</script>
