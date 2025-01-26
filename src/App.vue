<template>
   
  <ion-app>
    <MainSideBar />
    <ion-router-outlet id="main-content" />
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonRouterOutlet,
  // useBackButton,
  // useIonRouter,
} from "@ionic/vue";
import MainSideBar from "@/components/headers/sidebars/MainSideBar.vue";
import { useUserHook } from "./hooks/userHooks/userHook";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

onMounted(() => {
  useUserHook().isUserLogged();
});

// App.addListener("backButton", () => {
//   console.log(router.currentRoute.value);
//   if (router.currentRoute.value.name === "/") {
//     // Quitte l'application si on est à la racine
//     App.exitApp();
//   } else {
//     // Sinon, revient à la page précédente
//     router.back();
//   }
// });
</script>
