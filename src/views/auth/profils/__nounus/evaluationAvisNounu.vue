<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center">
      <HeadingText text="Evaluation et Avis" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputEvaluationAvis
      label="Evaluation Prédentes"
      -label-sub="Indiquez les services et les avis des personnes qui vous ont recommandé."
      name="evaluation_precedentes"
        v-model="
          useProfiNounulStore().state.EvaluationEtAvis.evaluation_precedentes
        "
        :errors="useProfiNounulStore().state.in_error"
        :max-contacts="8"
      />
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputEvaluationAvis from "@/components/forms/InputEvaluationAvis.vue";

// import IcIcons from "@/components/icons/IcIcons.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent } from "@ionic/vue";
// data, error, isLoading, isError
</script>
