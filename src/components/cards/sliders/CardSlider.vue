<template>
  <div class="flex flex-col justify-center items-center font-love">
    <div class="h-[60vh] flex items-center justify-center">
      <!-- <IcIcons name="RiLightbulbLine" class="flex w-full" :size="108" /> -->
      <img v-lazy="img" class=" object-cover h-[250px]" alt="" />
    </div>

    <div class="flex flex-col justify-center items-center text-center w-10/12">
      <h1 class="text-3xl font-light"> {{ heading }} </h1>
      <p class="text-ng opacity-80 font-medium">{{ subHeading }}.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import IcIcons from "@/components/icons/IcIcons.vue";
defineProps(["heading", "subHeading", "img"]);
</script>
