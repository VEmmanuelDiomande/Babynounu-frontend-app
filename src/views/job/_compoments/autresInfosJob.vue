<template>
    <IonContent class="ion-padding h-full gap-8">
      <div class="flex justify-center mb-8">
        <HeadingText text="Autres Informations" size="medium" />
      </div>
  
      <div class="flex flex-col gap-4">
        <TextareaAjustForm
          label="Souhaitez-vous ajouter une description personnelle ou des détails supplémentaires pour la candidate ? "
          name="descriptionComplementaire"
          placeholder="Nous sommes une famille de 4 avec deux enfants joyeux et curieux…"
          v-model="useJobStore().state.autresInfos.descriptionComplementaire"
          :error="useJobStore().state.in_error"
        />
  
        <InputFilesForm
        v-if="!$route.query.id"
          label="Voulez-vous ajouter une photo ou une vidéo de présentation ? "
          -label-sub=""
          name="missionUrgente"
          placeholder="3 Enfants"
          v-model="useJobStore().state.autresInfos.photoVideo"
          :error="useJobStore().state.in_error"
        />
      </div>
    </IonContent>
  </template>
  
  <script setup lang="ts">
  import InputBoxForm from "@/components/forms/inputBoxForm.vue";
  import InputCurrencyForm from "@/components/forms/inputCurrencyForm.vue";
  import InputDateForm from "@/components/forms/inputDateForm.vue";
  import InputFileForm from "@/components/forms/inputFileForm.vue";
import InputFilesForm from "@/components/forms/inputFilesForm.vue";
  import InputForm from "@/components/forms/inputForm.vue";
  import PhoneForm from "@/components/forms/phoneForm.vue";
  import SelectForm from "@/components/forms/selectForm.vue";
  import TextareaAjustForm from "@/components/forms/textareaAjustForm.vue";
  import HeadingText from "@/components/texts/headingText.vue";
  import { URL_API_ROUTE } from "@/routes/_requests/index.request";
  import { SettingServices } from "@/services/setting.services";
  import { useProfilStore } from "@/stores/authProfilStore";
  import { useJobStore } from "@/stores/jobStore";
  import { IonContent } from "@ionic/vue";
  import { useQuery } from "@tanstack/vue-query";
  import { reactive, ref } from "vue";
  
  const DataUrgence = [
    { name: "Oui, ce post est très urgent ", value: true },
    { name: "Non, ce post n'est pas trop urgent", value: false },
  ];
  </script>
  <style></style>
  