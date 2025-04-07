<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center">
      <HeadingText text="Galeries" size="medium" />
    </div>

    <div class="flex flex-col font-love gap-2">
      <InputFilesForm
        label="Images"
        name="gallery"
        LabelSub="Fournissez des images de haute qualité mettant en valeur vos photos professionnelle, afin de renforcer votre crédibilité et d'accroître votre visibilité.."
        v-model="
          useProfiNounulStore().state.Galery.gallery
        "
      />
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import HeadingText from "@/components/texts/headingText.vue";
import { ref } from "vue";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import IcIcons from "@/components/icons/IcIcons.vue";
import { IonContent } from "@ionic/vue";
import InputFilesForm from "@/components/forms/inputFilesForm.vue";
</script>
