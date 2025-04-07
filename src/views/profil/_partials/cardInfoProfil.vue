<template>
  <section
    class="flex flex-col gap-2 font-love bg-slate-100 p-4 rounded-2xl"
    v-if="dataCardInfo && dataCardInfo?.length != 0"
  >
    <Heading2Text :title="title" :icon="GetIcon(type)" />

    <div class="flex flex-wrap gap-1">
      <div v-for="item in dataCardInfo">
        <div
          class="bg-zinc-100 text-zinc-800 px-2 py-2 rounded-lg text-sm font-medium"
        >
          {{ item?.name }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import DetailHeader from "@/components/headers/DetailHeader.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import Heading2Text from "@/components/texts/heading2Text.vue";
import { useProfilHook } from "@/hooks/Profile/profil.hook";
import { IonContent, IonFooter, IonPage } from "@ionic/vue";
import { ref } from "vue";

defineProps(["dataCardInfo", "type", "title"]);

const {GetIcon} = useProfilHook()

</script>

<style scoped></style>
