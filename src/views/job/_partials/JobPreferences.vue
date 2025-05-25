<template>
  <section class="divide-y divide-gray-200">
    <div v-for="(pref, index) in preferencesList" :key="index">
      <div
        class="mt-2 bg-white rounded-xl p-6 flex flex-col gap-2 animate-fade-in-up shadow-sm"
        v-if="pref.isActive"
      >
        <Heading2Text :title="pref.title" :icon="pref.icon" />
        <ul class="list-disc list-inside text-gray-700 flex flex-col gap-1">
          <li
            v-for="(avantage, idx) in pref.list"
            :key="idx"
            class="text-sm"
          >
            {{ avantage.name }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Heading2Text from "@/components/texts/heading2Text.vue";

const props = defineProps({
  preferences: {
    type: Object,
    required: true
  }
});

const preferencesList = computed(() => {
  const pref = props.preferences;
  
  return [
    {
      title: "Besoin spécifique",
      list: pref?.besions_specifiques,
      isActive: pref?.besions_specifiques?.length > 0,
      icon: "RiUserHeartLine",
    },
    {
      title: "Certifications",
      list: pref?.certifications_criteres,
      isActive: pref?.certifications_criteres?.length > 0,
      icon: "RiMedalFill",
    },
    {
      title: "Compétences spécifiques",
      list: pref?.competance_specifique,
      isActive: pref?.competance_specifique?.length > 0,
      icon: "RiLightbulbFlashLine",
    },
    {
      title: "Critères de sélection",
      list: pref?.criteres_selections,
      isActive: pref?.criteres_selections?.length > 0,
      icon: "RiCheckLine",
    },
    {
      title: "Equipement ménager",
      list: pref?.equipement_menager,
      isActive: pref?.equipement_menager?.length > 0,
      icon: "RiHomeLine",
    },
    {
      title: "Fréquence des services",
      list: pref?.frequence_des_services,
      isActive: pref?.frequence_des_services?.length > 0,
      icon: "RiCalendarLine",
    },
    {
      title: "Garde des enfants",
      list: pref?.garde_enfants,
      isActive: pref?.garde_enfants?.length > 0,
      icon: "RiParentLine",
    },
    {
      title: "Horaire souhaités",
      list: pref?.horaire_souhaites,
      isActive: pref?.horaire_souhaites?.length > 0,
      icon: "RiTimeLine",
    },
    {
      title: "Langue parlée",
      list: pref?.langue_parler,
      isActive: pref?.langue_parler?.length > 0,
      icon: "RiSpeakLine",
    },
    {
      title: "Type de services",
      list: pref?.type_services,
      isActive: pref?.type_services?.length > 0,
      icon: "RiBriefcaseLine",
    },
    {
      title: "Zone de travail",
      list: pref?.zone_de_travail,
      isActive: pref?.zone_de_travail?.length > 0,
      icon: "RiMapPinLine",
    },
  ];
});
</script>