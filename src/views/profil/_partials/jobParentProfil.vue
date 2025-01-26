<template>
    <!-- Proposition -->
    <section class="flex w-full mx-auto flex-col mt-4 mb-8 gap-4 font-love">
      <!-- Header caché -->
      <div class="flex justify-between w-11/12 m-auto">
        <span class="text-lg font-anton">Mes Offres d'emploi</span>
        <button class="rounded-xl text-ng font-anton text-secondary flex ">
          <IcIcons name="RiAddFill" />
          <span>Creer</span>
        </button>
      </div>
  
      <!-- Liste des propositions -->
      <CardJob :JobData="5" :isOwer="true" />
  
      <!-- Bouton caché -->
      <div class="flex w-full hidden">
        <button
          class="flex items-center gap-1 bg-secondary w-full py-4 justify-center rounded-xl text-ng font-anton text-white"
        >
          Faire une offre
        </button>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import IcIcons from "@/components/icons/IcIcons.vue";
import CardJob from "@/views/job/_partiels/cardJob.vue";
  import { useQuery } from "@tanstack/vue-query";
  import { reactive } from "vue";

  defineProps(["JobData"]);
  
  // Données simulées pour les icônes
  const seedDataInfo = reactive([
    { icon: "RiCoinsFill", name: "20 000 Fcfa/mois" },
    { icon: "RiBriefcaseFill", name: "Freelance" },
    { icon: "RiMapPin2Fill", name: "Abidjan, Marcory" },
    { icon: "RiTimeFill", name: "Ponctuelle" },
  ]);
  
  
  </script>
  