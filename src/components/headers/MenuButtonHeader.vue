<template>
  <ion-buttons slot="start">
    <IonMenuButton
      slot="start"
      class="flex gap-2 relative -left-2 z-40"
      v-if="isLogged"
    >
      <div
        class="border-[1px] h-8 gap-1 px-2 flex items-center border-primary/50 justify-center z-40 rounded-full"
      >
        <IcIcons name="RiUserLine" :size="18" class="text-primary" />
      </div>
    </IonMenuButton>

    <RouterLink :to="{ name: 'STARTER_DESTINATION' }" v-else-if="isAdmin" >
      <div
        class="border-[1px] h-8 gap-1 px-2 flex items-center border-primary/50 justify-center z-40 rounded-full"
      >
        <IcIcons name="RiHomeLine" :size="18" class="text-primary" />
      </div>
    </RouterLink>

    <RouterLink :to="{ name: 'SignAuth' }" v-else>
      <div
        class="border-[1px] h-8 gap-1 px-2 flex items-center border-primary/50 justify-center z-40 rounded-full"
      >
        <IcIcons name="RiUserLine" :size="18" class="text-primary" />
      </div>
    </RouterLink>
  </ion-buttons>
</template>

<script setup lang="ts">
import { IonHeader, IonButtons, IonMenuButton } from "@ionic/vue";
import { RiBardLine, RiUserLine } from "@remixicon/vue";
import IcIcons from "../icons/IcIcons.vue";
defineProps(["isLogged", "isAdmin"]);
</script>
