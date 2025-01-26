<template>
  <IonPage>
    <ToolbarAgency title="Chap Chap Delivery" />
    <IonContent class="font-love py-16">
      <div class="flex flex-col mt-4 w-11/12 m-auto gap-4 font-love">
        <WelcomeAgencyHome />

        <StatsAgencyHome />

        <!-- AREA OF ACTIONS -->
        <ActionAgencyHome />

        <!-- LISTE OF LAST ORDERS -->
        <ActivityAgencyHome />
      </div>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
import { IonContent, IonPage } from "@ionic/vue";
import ToolbarAgency from "./partials/ToolbarAgency.vue";
import ActivityAgencyHome from "./partials/InPages/home/ActivityAgencyHome.vue";
import ActionAgencyHome from "./partials/InPages/home/ActionAgencyHome.vue";
import StatsAgencyHome from "./partials/InPages/home/StatsAgencyHome.vue";
import WelcomeAgencyHome from "./partials/InPages/home/WelcomeAgencyHome.vue";
</script>
<style scoped></style>
