<template>
  <div class="grid grid-cols-1 gap-2 divide-y-[1px]">
    <RouterLink
      v-for="(item, index) in JobData"
      :key="index"
      :to="{ name: 'DetailPropositionProfil', params: { id: item.id || 1 } }"
      class="w-11/12 m-auto border-[0px] border-primary/50 text-black flex flex-col gap-4 px-3 py-4"
    >
      <!-- En-tête : Photo et informations -->
      <div class="flex items-center w-full" v-if="!isOwer">
        <div class="size-16 rounded-full overflow-hidden">
          <img
            v-lazy="'https://i.pravatar.cc/' + (index + 1) + '00'"
            alt="Photo de {{ item.first_name }}"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="flex flex-col items-start  gap-[2px] ml-4">
          <div class="text-base font-extrabold">
            {{ item.first_name }} {{ item.last_name }}
          </div>
          <div class="text-sm opacity-70 font-semibold">
            {{ item.commune }}, Abidjan
          </div>
          <div class="flex justify-center items-center text-xs mt-1 bg-red-400 text-white py-1 px-2 rounded-xl opacity-70 font-medium">
            <span class="">{{ "3" }} Enfants</span>
          </div>
        </div>
      </div>

      <!-- Description et détails -->
      <div class="flex flex-col gap-1">
        <div>
          <span class="text-base opacity-80 font-bold line-clamp-3 mb-1">
            Recherche Femme de Ménage à {{ item.commune }}
          </span>
          <p class="text-sm opacity-70 font-medium line-clamp-3">
            {{ item.description }}
          </p>
        </div>

        <!-- Informations complémentaires -->
        <div class="grid grid-cols-2 gap-2 mt-2">
          <div
            v-for="(info, i) in seedDataInfo"
            :key="i"
            class="flex items-center gap-1"
          >
            <IcIcons :name="info.icon" class="text-primary" :size="20" />
            <span class="text-sm opacity-70 font-medium">
              {{ info.name }}
            </span>
          </div>
        </div>
      </div>
    </RouterLink>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import IcIcons from "@/components/icons/IcIcons.vue";

defineProps(["JobData", "isOwer"]);

// Données simulées pour les icônes
const seedDataInfo = reactive([
  { icon: "RiCoinsFill", name: "20 000 Fcfa/mois" },
  { icon: "RiBriefcaseFill", name: "Freelance" },
  { icon: "RiMapPin2Fill", name: "Abidjan, Marcory" },
  { icon: "RiTimeFill", name: "Ponctuelle" },
]);
</script>
