<template>
  <RouterLink
    v-if="data"
    :to="{ name: RouteName || 'PROFIL_DETAIL', params: { id: data.id } }"
    class="bg-gradient-to-r h-full rounded-lg active:opacity-80 relative font-love"
  >
    <!-- Badges supérieurs -->
    <div class="absolute top-2 right-2 flex gap-2">
      <!-- Badge expérience (uniquement pour les nounous) -->
      <div
        v-if="isNounu"
        class="bg-orange-500 rounded-lg px-2 py-1 flex items-center"
      >
        <IcIcons
          name="RiFlaskLine"
          :size="12"
          class="text-white flex-shrink-0"
        />
        <span class="text-white font-love text-xs font-extrabold ml-1">
          {{ data.annees_experience }} ans
        </span>
      </div>
    </div>

    <!-- Badge disponibilité -->
    <div
      class="bg-zinc-500/40 rounded-lg absolute top-2 left-2 px-2 py-1 flex items-center"
    >
      <div
        class="inline-flex w-2 h-2 rounded-full"
        :class="data.status === 'disponible' ? 'bg-green-500' : 'bg-red-500'"
      ></div>
      <span class="text-white font-love text-xs font-extrabold ml-1">
        {{ data.status === "disponible" ? "Disponible" : "Indispo" }}
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
      <!-- Badge vérifié (pour tous) -->
      <div
        v-if="data.certif == 'Accepted'"
        class="bg-yellow-500 rounded-lg px-2 py-1 flex w-16 font-love justify-center items-center"
      >
        <IcIcons
          name="RiCheckboxCircleFill"
          :size="12"
          class="text-white flex-shrink-0"
        />
        <span class="text-white font-love text-xs font-extrabold ml-1">
          Vérifié
        </span>
      </div>
      <!-- Nom et âge -->
      <div class="flex items-center gap-1 w-full">
        <span class="text-base font-love font-extrabold text-white truncate">
          {{ data.fullname }}
        </span>
        <span class="text-sm font-love font-bold text-white min-w-max flex">
          ({{ data.age }} ans)
        </span>
      </div>

      <!-- Adresse -->
      <div class="flex items-center gap-1">
        <IcIcons name="RiMapPin2Line" :size="12" class="text-white" />
        <span class="text-sm font-love text-white">
          {{ data.preferences?.adress[0]?.name }}
        </span>
      </div>

      <!-- Informations spécifiques selon le type de profil -->
      <template v-if="isNounu">
        <!-- Tarif horaire (uniquement pour les nounous) -->
        <div class="flex items-center gap-1">
          <IcIcons name="RiPaypalLine" :size="12" class="text-white" />
          <div class="flex items-center gap-1">
            <span class="font-bold text-white">
              {{
                new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                }).format(Number(data.tarif_horaire))
              }}
            </span>
            <span class="text-sm font-love text-white italic"> .Hrs </span>
          </div>
        </div>

        <!-- Disponibilité horaire (uniquement pour les nounous) -->
        <div class="flex items-center gap-1">
          <IcIcons name="RiBriefcaseLine" :size="12" class="text-white" />
          <span class="text-sm font-love text-white font-bold">
            {{
              data.preferences?.horaire_disponible[0]?.name || "Non spécifié"
            }}
          </span>
        </div>
      </template>

      <template v-else>
        <!-- Informations spécifiques aux parents -->
        <div class="flex items-center gap-1">
          <IcIcons name="RiUserLine" :size="12" class="text-white" />
          <span class="text-sm font-love text-white font-bold">
            {{
              data.enfants ? `${data.enfants.length} enfant(s)` : "Aucun enfant"
            }}
          </span>
        </div>

        <!-- Type de service recherché -->
        <div v-if="data.service_recherche" class="flex items-center gap-1">
          <IcIcons name="RiSearchLine" :size="12" class="text-white" />
          <span class="text-sm font-love text-white font-bold">
            {{ data.service_recherche }}
          </span>
        </div>
      </template>
    </div>
  </RouterLink>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { RouterLink } from "vue-router";

// Types
interface ProfileData {
  id: string;
  fullname: string;
  age: number;
  status: string;
  image?: {
    originalUrl: string;
  };
  preferences?: {
    adress: Array<{ name: string }>;
    horaire_disponible: Array<{ name: string }>;
  };
  // Propriétés spécifiques aux nounous
  annees_experience?: number;
  tarif_horaire?: string;
  // Propriétés spécifiques aux parents
  enfants?: Array<any>;
  service_recherche?: string;
  // Propriétés communes
  certif?: "Accepted" | "Pending";
  type?: "nounu" | "parent";
}

// Props
const props = defineProps({
  data: {
    type: Object as () => ProfileData,
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

// Computed properties
const isNounu = computed(() => {
  // Déterminer si c'est un profil de nounu basé sur les propriétés disponibles
  return (
    props.data.type === "nounu" ||
    (props.data.annees_experience !== undefined &&
      props.data.tarif_horaire !== undefined)
  );
});
</script>

<style scoped>
/* Vous pouvez ajouter des styles spécifiques ici si nécessaire */
.parent-card {
  border-left: 4px solid #8b5cf6; /* Bordure violette pour les parents */
}

.nounu-card {
  border-left: 4px solid #3b82f6; /* Bordure bleue pour les nounous */
}
</style>
