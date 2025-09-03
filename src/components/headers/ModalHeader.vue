<template>
  <ion-header
    class="shadow-none border-b-[1px] w-full h-12 items-center flex font-love bg-white"
  >
    <ion-toolbar
      class="shadow-none bg-white flex gap-4 px-4 w-full items-center border-b-[1px]"
    >
      <ion-buttons slot="start" @click="GoBack($router)">
        <RiArrowLeftLine
          size="24"
          color="#27272a"
          className="text-zinc-800"
        />
      </ion-buttons>

      <ion-title class="text-ng font-bold text-zinc-800 font-love"> {{ title }} </ion-title>
    h-12
  </ion-header>
</template>

<script lang="ts" setup>
import { IonHeader, IonButtons, IonTitle, IonToolbar } from "@ionic/vue";
import { useNavigateGoBackHook } from "@/hooks/navigateHooks/goback.hook";
import { RiArrowLeftLine } from "@remixicon/vue";

defineProps(["title"]);

const { GoBack } = useNavigateGoBackHook();
</script>
