<template>
  <ion-header class="shadow-none border-b-[1px] w-full h-12 items-center flex  bg-white">
    <IonToolbar class="shadow-none bg-white" color="white"  style="--background: #3498db; --color: #ffffff;">
      <div class="shadow-none bg-white flex justify-between  px-4 w-full items-center ">
      <ion-buttons slot="start" class="relative right-3">
        <ion-menu-button>
          <div class="border-[1px] size-8 flex items-center justify-center absolute top-2 z-40 rounded-full">
            <RiUserLine size="18px" color="#27272a" className="text-zinc-800" />
          </div>
        </ion-menu-button>
      </ion-buttons>

      <ion-img class="h-7" src="/src/assets/images/logos/Baby Nounu.png" />

      <ion-buttons slot="end">
        <RiBardLine size="28px" color="#27272a" className="text-zinc-800" />
      </ion-buttons>
    </div>
    </IonToolbar>
  
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonButtons, IonMenuButton, IonToolbar } from "@ionic/vue";
import {  RiBardLine, RiUserLine } from "@remixicon/vue";

</script>
