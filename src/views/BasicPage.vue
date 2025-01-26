<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts" setup>
import { IonPage, IonTabs, IonRouterOutlet } from "@ionic/vue";
</script>
