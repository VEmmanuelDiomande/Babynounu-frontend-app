<template>
  <section
    class="flex w-11/12 m-auto flex-col gap-4 font-love"
    v-if="dataCardInfo && dataCardInfo?.length != 0"
  >
    <div class="flex border-b-[1px] pb-2">
      <span class="text-sm font-anton font-normal text-zinc-600"> {{ title }} </span>
    </div>

    <div class="flex flex-wrap gap-1" >
      <div v-for="item in dataCardInfo.filter((item:any) => item[type] )">
        <div
          class="bg-zinc-100 text-zinc-800 px-2 py-2 rounded-lg text-sm font-medium"
        >
          {{ item[type]?.name }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import DetailHeader from "@/components/headers/DetailHeader.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { IonContent, IonFooter, IonPage } from "@ionic/vue";
import { ref } from "vue";

defineProps(["dataCardInfo", 'type', 'title']);
</script>

<style scoped></style>
