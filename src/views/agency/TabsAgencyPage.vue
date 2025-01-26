<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" class="border-t-[1px] font-love">
        <ion-tab-button
          :tab="tab.tab"
          class="flex gap-2"
          :href="tab.link"
          v-for="(tab, index) in state.menuTabs"
          :key="index"
        >
       
          <div
            class="w-14 h-10 bg-gray-100 flex justify-center items-center rounded-xl"
            v-if="!tab.name"
          >
            <RiAddLine size="28" class="text-gray-400" />
          </div>
          <div class="flex flex-col justify-center items-center" v-else>
            <IcIcons
              :name="tab.link == route.path ? tab.iconFull : tab.icon"
              :size="tab.name ? 28 : 38"
              class=""
              :class="
                tab.link == route.path ? 'text-primary' : 'text-gray-400'
              "
            />
            <p
              class="text-xr font-bold"
              :class="
                tab.link == route.path
                  ? 'font-extrabold text-primary'
                  : 'text-gray-400'
              "
            >
              {{ tab.name }}
            </p>
          </div>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts" setup>
import IcIcons from "@/components/icons/IcIcons.vue";
import { useTabHook } from "@/hooks/menuHooks/useTab.hook";
import {
  IonPage,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
} from "@ionic/vue";
import { RiAddLine } from "@remixicon/vue";
import { useRoute } from "vue-router";

const route = useRoute();

const { state } = useTabHook();
</script>
