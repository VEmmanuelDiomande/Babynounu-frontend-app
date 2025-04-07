<script setup lang="ts">
import IcIcons from '../icons/IcIcons.vue';
defineProps(["nameIcons", "heading", "subHeading"]);
</script>

<template>
  <div class="max-h-screen absolute inset-0 h-full flex flex-col items-center justify-center font-love w-10/12 m-auto">
    <IcIcons :name="nameIcons" :size="70" class="text-primary" />
    <h1 class="text-xl font-anton "> {{ heading }} </h1>
    <p class="text-center text-sm">{{ subHeading ? subHeading : "Aucun élément trouvé." }} </p>
  </div>
</template>

<style scoped>
</style>
