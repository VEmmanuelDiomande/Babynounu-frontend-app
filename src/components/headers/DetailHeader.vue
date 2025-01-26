<template>
    <IonHeader>
      <div
        class="flex items-center justify-between px-2 py-2 border-b-[1px] text-zinc-800 shadow"
      >
        
      <div class="flex gap-0">
          <!-- Back Button -->
        <button class=" rounded hover:bg-primary" @click="$router.go(-1)">
          <IcIcons name="RiArrowLeftSLine" :size="32"></IcIcons>
        </button>
  
      </div>

      
        <!-- Chat Info -->
        <div class="flex items-center">
          
            <h1 class="text-lg font-bold"> Details </h1>
            
        </div>
  
        <!-- Options Button -->
        <button class="p-2 rounded hover:bg-blue-600" @click="openOptions">
          <IcIcons name="RiMore2Line" :size="20"></IcIcons>
        </button>
      </div>
    </IonHeader>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import IcIcons from "../icons/IcIcons.vue";
  
  const chatName = ref("John Doe"); // Nom de l'utilisateur ou du groupe
  const chatStatus = ref("En ligne"); // Statut du chat
  const avatar = ref("https://via.placeholder.com/150"); // Avatar par défaut
  
  const goBack = () => {
    // Fonction pour revenir en arrière
  
    console.log("Retour !");
  };
  
  const openOptions = () => {
    // Fonction pour ouvrir les options du chat
    console.log("Options ouvertes !");
  };
  </script>
  
  <style scoped>
  /* Style supplémentaire (si besoin) */
  </style>
  