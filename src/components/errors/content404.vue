<template>
  <ContentLoader v-if="Loading" size="large" />

  <ContentEmpty
    v-else-if="!Loading && Data?.length == 0"
    heading="Aucune notification"
    subHeading="Aucune notification disponible. Interagissez avec les autres utilisateurs !"
  />

  <ContentE404 v-if="ISError" />
</template>

<script setup lang="ts">
import ContentE404 from "@/components/errors/contentE404.vue";
import ContentEmpty from "@/components/errors/contentEmpty.vue";
import ContentLoader from "@/components/loaders/contentLoader.vue";

defineProps(["Loading", "ISError", "Data"]);
</script>
