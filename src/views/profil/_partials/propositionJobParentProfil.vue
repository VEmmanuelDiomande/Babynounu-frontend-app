<template>
 
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
