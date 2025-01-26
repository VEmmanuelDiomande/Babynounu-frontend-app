<template>
    <IonPage id="main-content">
      <HeaderMenuLayout Title="Rechercher" PlaceholderSearch="Rechercher..." :countScroll="countScroll" >
      </HeaderMenuLayout>
      <IonContent :scroll-events="true" @ionScroll="onScroll($event)" >
        <PropositionJobParentProfil />
      </IonContent>
    </IonPage>
  </template>
  
  <script lang="ts" setup>
  import MainSideBar from "@/components/headers/sidebars/MainSideBar.vue";
  import { useSearchHook } from "@/hooks/searchHooks/search.hook";
  import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
  import { IonContent, IonPage } from "@ionic/vue";
  import CardAccessHome from "../home/partials/cardAccessHome.vue";
  import { useNounuHook } from "@/hooks/nounuHooks/nounu.hooks";
  import { ref } from "vue";
  import IcIcons from "@/components/icons/IcIcons.vue";
  import { ScrollUtils } from "@/utils/scroll.utils";
import PropositionJobParentProfil from "../profil/_partials/propositionJobParentProfil.vue";
  
  const { state } = useSearchHook();
  const { state: stateNounu } = useNounuHook();
  
  const {  countScroll, onScroll} = ScrollUtils();
  
  // Ecrire une fonction qui permet de modifier la valeur de actived l'element actif dans state.verticalMenu
  
  const toggleActiveMenu = (index: number) => {
    state.verticalMenu.forEach((menu, i) => {
      menu.actived = i === index;
    });
  };
  
  defineProps(["Type"]);
  </script>
  <style scoped></style>
  