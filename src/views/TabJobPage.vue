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
          <div v-else class="flex flex-col justify-center items-center">
            <IcIcons
              :name="getIconName(tab)"
              :size="tab.name ? 28 : 38"
              :class="getIconClass(tab)"
            />
            <p class="text-xr font-love" :class="getTextClass(tab)">
              {{ tab.name }} {{ nPageType }}
            </p>
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

// Tabs dynamiques basées sur le type de page
const { state } = useTabHook();
const tabs = computed(() => {
  if (nType_Profil.value == "parent") {
    state.menuTabs[4].link = `/profil/parent`;
  } else if (nType_Profil.value == "nounu") {
    state.menuTabs[4].link = `/profil/nounu`;
  }
  return state.menuJobTabs;
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
</script>
