<template>
    <ion-header class="w-full shadow-none">
      <ion-toolbar class="pr-4 pl-2 shadow-none border-b-[1px]">
        <ion-buttons slot="start">
          <ion-button class="bg-gray-100 rounded-full  " >
            <RiUserLine size="18" />  
          </ion-button>
        </ion-buttons>
        <ion-title class="text-ng text-zinc-800 font-anton"> {{ title }} </ion-title>
        <ion-buttons slot="end"> 
            <RiNotification2Line size="24" />
        </ion-buttons>
      </ion-toolbar>
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
  import { RiNotification2Line, RiUserLine } from "@remixicon/vue";
  
  </script>
  