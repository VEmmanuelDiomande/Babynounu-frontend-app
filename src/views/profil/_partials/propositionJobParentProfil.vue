<template>
  <!-- Proposition -->
  <section class="flex w-full  mx-auto flex-col mt-4 mb-8 gap-4 font-love">
    <!-- Header caché -->
    <div class="flex justify-between hidden w-11/12 m-auto">
      <span class="text-lg font-anton">Proposition d'offres</span>
      <button class="rounded-xl text-ng font-anton text-secondary">
        Voir +
      </button>
    </div>

    <!-- Liste des propositions -->
    <CardJob :JobData="seedDataProfilOffre" />

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

// Données simulées pour les icônes
const seedDataInfo = reactive([
  { icon: "RiCoinsFill", name: "20 000 Fcfa/mois" },
  { icon: "RiBriefcaseFill", name: "Freelance" },
  { icon: "RiMapPin2Fill", name: "Abidjan, Marcory" },
  { icon: "RiTimeFill", name: "Ponctuelle" },
]);

// Données simulées pour les profils
const seedDataProfilOffre = reactive(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    first_name: ["Diallo", "Koné", "Coulibaly", "Yao", "Traoré"][Math.floor(Math.random() * 5)],
    last_name: ["Adama", "Aïcha", "Bintou", "Demba", "Fatou"][Math.floor(Math.random() * 5)],
    commune: ["Bingerville", "Adjamé", "Cocody", "Marcory", "Yopougon"][Math.floor(Math.random() * 5)],
    description:
      "Je recherche une nounou sérieuse et expérimentée pour la garde de mes enfants. N'hésitez pas à postuler.",
  }))
);
</script>
