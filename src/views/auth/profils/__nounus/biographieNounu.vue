<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8 font-love">
    <div class="flex justify-center">
      <HeadingText text="Présentation du personnel" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <TextareaAjustForm
        label="Décrivez-vous en quelque mots..."
        name="courte_biographie"
        placeholder="Tapez votre texte ici..."
        v-model="
          useProfiNounulStore().state.PresentationDuPersonnel.courte_biographie
        "
        :error="
          useProfiNounulStore().state.in_error
        "
      />
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputForm from "@/components/forms/inputForm.vue";
import TextareaAjustForm from "@/components/forms/textareaAjustForm.vue";
// import IcIcons from "@/components/icons/IcIcons.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent } from "@ionic/vue";
// data, error, isLoading, isError
</script>
