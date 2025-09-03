<template>
  <ion-header
    class=" shadow-none border-b-[0px] w-full items-center flex font-love bg-white"
  >
    <div
      color="white"
      class="shadow-none h-12 w-full bg-white border-b-[1px] flex gap-4 m-auto items-center justify-between px-4"
    >
      <MenuButtonHeader :isLogged="useUserStore().isLogged" />

      <IonButtons class="flex justify-center">
        <RouterLink class="flex" :to="{ name: 'STARTER_DESTINATION' }">
          <span class="font-anton text-xl text-primary">Baby Nounu</span>
        </RouterLink>
      </IonButtons>

      <ion-buttons slot="end" class="flex gap-2">
        <RouterLink
          :to="{ name: 'NOTIFICATIONS' }"
          v-if="useUserStore().isLogged"
        >
          <div
            class="border-[1px] h-8 gap-1 px-2 flex items-center border-primary/50 justify-center z-40 rounded-full"
          >
            <IcIcons
              name="RiNotification2Line"
              :size="18"
              class="text-primary"
            />
          </div>
        </RouterLink>
      </ion-buttons>
    </div>
  </ion-header>
</template>

<script lang="ts" setup>
import { IonButtons, IonHeader, IonMenuButton, IonToolbar } from "@ionic/vue";
// import { RiMegaphoneLine } from "@remixicon/vue";
import { RouterLink } from "vue-router";
import IcIcons from "../icons/IcIcons.vue";
import { useUserStore } from "@/stores/user.store";
import MenuButtonHeader from "./MenuButtonHeader.vue";

defineProps(["title"]);
</script>

<style>
.non-fixed-header {
  position: static !important; /* Retirer la position fixe */
}
</style>
