<template>
  <ion-header class="shadow-none">
    <div class="flex justify-between h-12 items-centershadow-none border-b-[1px]">
      <ion-buttons slot="start">
        <ion-button @click="$router.go(-1)">
          <RiCloseLargeLine size="20" />
        </ion-button>
      </ion-buttons>
      <ion-title class="text-ng text-zinc-800 font-anton"> {{ title }} </ion-title>
      <ion-buttons slot="end"> </ion-buttons>
    </div>
  </ion-header>
</template>

<script lang="ts" setup>
defineProps(["modal", "title"]);

import {
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons,
  IonTitle,
} from "@ionic/vue";
import { RiCloseLargeLine } from "@remixicon/vue";

</script>
