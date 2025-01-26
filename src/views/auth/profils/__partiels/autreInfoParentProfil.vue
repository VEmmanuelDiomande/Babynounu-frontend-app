<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center mb-8">
      <HeadingText text="Présentation du personnel" size="medium" />
    </div>

    <div class="flex flex-col gap-2">
      <textarea
        class="resize-none w-full p-2 rounded-lg border-[1px]"
        placeholder="Tapez votre texte ici..."
        v-model="useProfilStore().state.AutreInfoParentProfilValue.autre_infos"
        cols="30"
        rows="10"
      >
      <!-- Message d'erreur -->
      <span
          class="text-sm text-red-500"
          v-if="useProfilStore().state.in_error?.path == 'image_profil'"
        >
          {{ useProfilStore().state.in_error?.message }}
        </span>
      </textarea>
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputForm from "@/components/forms/inputForm.vue";
// import IcIcons from "@/components/icons/IcIcons.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent } from "@ionic/vue";
// data, error, isLoading, isError
</script>
