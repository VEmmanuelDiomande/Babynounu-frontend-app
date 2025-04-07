<template>
  <!-- Proposition -->
  <section class="flex w-full  mx-auto flex-col mt-4 mb-8 gap-4 font-love">
 

    <!-- Liste des propositions -->
    <CardJob :JobData="DataJobs" />

 
  </section>
</template>

<script setup lang="ts">
import IcIcons from "@/components/icons/IcIcons.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import CardJob from "@/views/job/_partiels/cardJob.vue";
import { useQuery } from "@tanstack/vue-query";
import { reactive } from "vue";

defineProps(["DataJobs"]);
</script>
