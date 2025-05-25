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
            @click="logout(tab)"
          >
            <IcIcons
              :name="getIconName(tab)"
              :size="tab.name ? 28 : 38"
              :class="getIconClass(tab)"
            />
            <p class="text-xr font-love" :class="getTextClass(tab)">
              {{ tab.name }}
            </p>
          </div>
          <div
            v-if="
              tab.tab == 'tab_admin_chats' &&
              useNotificationStore().state.countMessage?.totalUnread > 0
            "
            class="absolute top-1 ring-2 ring-white right-1 size-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-semibold text-white"
          >
            {{ useNotificationStore().state.countMessage?.totalUnread }}
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
import { useNotificationStore } from "@/stores/notificationStore";

// State
const route = useRoute();
const nPageType = ref<string | null>(null);

// Tabs dynamiques basées sur le type de page
const { state } = useTabHook();
const tabs = computed(() => {
  return state.menuAdminTabs;
});

// Méthodes utilitaires pour les classes et icônes
const getIconName = (tab: any) =>
  tab.link === route.path ? tab.iconFull : tab.icon;

const getIconClass = (tab: any) =>
  tab.link === route.path ? "text-primary" : "text-gray-400";

const getTextClass = (tab: any) =>
  tab.link === route.path
    ? "text-primary font-extrabold"
    : "font-bold text-zinc-400";

const logout = async (tab: any) => {
  console.log(tab);
  if (tab.tab == "tab_admin_logout") {
    await StorageUtils().clearStore();
    window.location.href = "/auth/sign";
  }
};
</script>
