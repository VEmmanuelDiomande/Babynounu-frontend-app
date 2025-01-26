<script setup lang="ts">
const props = defineProps([
  "heading",
  "MhandleScroll",
  "PageCurrent",
  "OnReresh",
]);

const handleScroll = (e: any) => {
    console.log(e)
};

import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonPage,
} from "@ionic/vue";

const handleRefresh = (event: any) => {
  setTimeout(() => {
    event.target.complete();
  }, 2000);
  props.OnReresh();
};
</script>

<template>
  <ion-page>

    <slot name="toolbar" />

    <ion-content :scroll-y="true" class="scrollbar-hide" >
      <ion-refresher
        slot="fixed"
        :pull-factor="0.5"
        :pull-min="40"
        :pull-max="60"
        @ionRefresh="handleRefresh($event)"
        class="py-20"
      >
        <ion-refresher-content class="z-50"></ion-refresher-content>
      </ion-refresher>

      <div
        class="font-love mainLayout ion-content-scroll-host  h-[100vh]"
        v-on:scroll="[handleScroll($event)]"
      >
        <div class="lg:w-4/12 m-auto">
          <slot name="content" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.ion-content-scroll-host {
  position: absolute;
  top: 0;
  left: 0;
  /* height: 150%; */
  width: 100%;
  overflow-y: auto;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;  /* Internet Explorer */
    scrollbar-width: none;  /* Firefox */
  }
</style>
