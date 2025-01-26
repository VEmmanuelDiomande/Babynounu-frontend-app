<template>
  <ion-page  :id="$route.name">
    <!-- Header -->
    <HomeHeader title="Baby Nounu" />

    <ion-content class=" font-love">
      <PropositionJobParentProfil />
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts" >
import HomeHeader from "@/components/headers/HomeHeader.vue";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue"
import PropositionJobParentProfil from "../profil/_partials/propositionJobParentProfil.vue";
</script>