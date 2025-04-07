<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center mb-8">
      <HeadingText text="Présentation du personnel" size="medium" />
    </div>

    <div class="flex flex-col gap-2">
      <TextareaAjustForm
      label="Autres informations"
        class="resize-none w-full p-2 rounded-lg border-[1px]"
        placeholder="Tapez votre texte ici..."
        name="informations_complementaires"
        v-model="useProfilStore().state.AutreInformations.informations_complementaires"
        :error="useProfilStore().state.in_error?.message"
      >
      
      </TextareaAjustForm>
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
