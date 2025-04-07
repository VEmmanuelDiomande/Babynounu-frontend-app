<script setup lang="ts">
import IcIcons from '../icons/IcIcons.vue';
defineProps(["nameIcons", "heading", "subHeading"]);
</script>

<template>
  <div class="max-h-screen  inset-0 h-full flex flex-col items-center justify-center font-love ">
    <IcIcons :name="'RiErrorWarningLine'" :size="100" class="text-primary" />
    <h1 class="text-xl font-anton "> Erreur ! </h1>
    <p class="text-center text-sm">{{"Une erreur est survenue lors du chargement de cette page. Veuillez réessayer plus tard.." }} </p>
  </div>
</template>

<style scoped>
</style>
