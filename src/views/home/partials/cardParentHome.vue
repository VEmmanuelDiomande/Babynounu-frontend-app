<template>
    <RouterLink
      v-if="data"
      :to="{ name: 'PROFIL_DETAIL_PARENT', params: { id: data.id } }"
      class="bg-gradient-to-r h-full rounded-lg active:opacity-80 relative font-love"
    >
      <!-- Badge expérience -->
      <div
        class="bg-orange-500 rounded-lg hidden absolute top-2 right-2 px-2 py-1 flex items-center"
      >
        <IcIcons
          name="RiFlaskLine"
          :size="12"
          class="text-white flex-shrink-0"
        />
        <span class="text-white font-love text-xs  font-extrabold ml-1">
          {{ data.annees_experience }} ans
        </span>
      </div>
  
      <!-- Badge disponibilité -->
      <div
        class="bg-zinc-500/40  hidden rounded-lg absolute top-2 left-2 px-2 py-1 flex items-center"
      >
        <div class="inline-flex w-2 h-2 bg-green-500 rounded-full"></div>
        <span class="text-white font-love text-xs font-extrabold ml-1">
          Disponible
        </span>
      </div>
  
      <!-- Image de profil -->
      <img
        v-lazy="data.image?.originalUrl"
        alt="Profil photo"
        class="w-full h-[220px] rounded-lg object-cover"
      />
  
      <!-- Informations -->
      <div
        class="flex flex-col gap-1 rounded-b-lg bg-gradient-to-t from-black via-black to-transparent absolute bottom-0 z-40 p-3 w-full"
      >
        <!-- Nom et âge -->
        <div class="flex items-center gap-1 w-full">
          <span class="text-base font-love font-extrabold text-white truncate">
            {{ data.fullname }}
          </span>
          <span class="text-sm font-love font-bold text-white min-w-max flex">
            
          </span>
        </div>
  
        <!-- Adresse -->
        <div class="flex items-center gap-1">
          <IcIcons name="RiMapPin2Line" :size="12" class="text-white" />
          <span class="text-sm font-love text-white">
            {{ data.preferences?.adress[0]?.name }}
          </span>
        </div>
  
        <!-- Tarif horaire -->
        <div class="flex items-center gap-1">
          <IcIcons name="RiUser6Line" :size="12" class="text-white" />
          <div class="flex items-center gap-1">
            <span class="font-bold text-white">
              {{ data.number_of_children }}
            </span>
            <span class="text-sm font-love text-white italic">
              Enfants
            </span>
          </div>
        </div>
  
        <!-- Disponibilité horaire -->
        <div class="flex items-center gap-1">
          <IcIcons name="RiBriefcaseLine" :size="12" class="text-white" />
          <span class="text-sm font-love text-white font-bold">
            {{ data.preferences?.horaire_souhaites[0]?.name || 'Non spécifié' }}
          </span>
        </div>
      </div>
    </RouterLink>
  </template>
  
  <script lang="ts" setup>
  import IcIcons from "@/components/icons/IcIcons.vue";
  import { BASE_URL_CENTER } from "@/routes/_requests/index.request";
  import { RouterLink } from "vue-router";
  
  defineProps({
    data: {
      type: Object,
      required: true,
    },
    RouteName: {
      type: String,
      default: "PROFIL_DETAIL",
    },
    index: {
      type: Number,
      default: 0,
    },
  });
  </script>
  