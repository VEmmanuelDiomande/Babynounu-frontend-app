<template>
  <ion-footer>
    <div class="border-t-[1px]">
      <ion-menu-button
        :tab="tab.tab"
        class=""
        :href="tab.link"
        v-for="(tab, index) in state.menuTabs"
        :key="index"
      >
        <div
          class="flex gap-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-150"
        >
         
        </div>
      </ion-menu-button>
    </div>
  </ion-footer>
</template>

<script setup lang="ts">
import { IonFooter, IonMenuButton } from "@ionic/vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { useTabHook } from "@/hooks/menuHooks/useTab.hook";
import { useRoute } from "vue-router";

const route = useRoute();

const { state } = useTabHook();
</script>
