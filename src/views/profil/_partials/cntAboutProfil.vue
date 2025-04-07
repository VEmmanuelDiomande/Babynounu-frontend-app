<template>
  <section>
    <div class="flex flex-col gap-6">
      <div class="h-full flex flex-col gap-1 text-sm">
        <Heading2Text title="Biographie" />
        <span class="">{{
          Data.courte_biographie
            ? Data.courte_biographie
            : Data.informations_complementaires
        }}</span>
      </div>

      <!-- Reference Utilisateur -->
      <div class="h-full flex flex-col gap-1 text-sm">
        <Heading2Text title="Reference" />

        <CardAboutContact :Data="Data.references" v-if="Data.references"  />
      </div>


       <!-- Reference Utilisateur -->
       <div class="h-full flex flex-col gap-1 text-sm" v-if="Data.evaluation_precedentes" >
        <Heading2Text title="Evaluation Prédentes " />

        <CardAboutContact :Data="Data.evaluation_precedentes" />
      </div>

      <div class="bg-slate-100 rounded-lg p-4 flex flex-col gap-2">
        <div
          v-for="(item, index) in [
            Data.preferences?.adress[0]?.name,
            Data.createdAt,
          ]"
          key=""
        >
          <div class="flex items-center gap-2">
            <IcIcons
              :name="index == 0 ? 'RiMapPin2Line' : 'RiUserLine'"
              :size="20"
              class="text-zinc-800"
            />
            <span class="text-sm">
              {{ index == 0 ? item : "Membre depuis le " + formatDate(item) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import IcIcons from "@/components/icons/IcIcons.vue";
import Heading2Text from "@/components/texts/heading2Text.vue";
import { useProfilHook } from "@/hooks/Profile/profil.hook";
import { formatDate } from "@/utils/date.utils";
import CardAboutContact from "@/views/job/_partiels/cardAboutContact.vue";

const { GetName, GetIcon } = useProfilHook();

defineProps(["MenuActive", "Data"]);
</script>
