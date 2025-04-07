<template>
  <IonContent class="ion-padding h-full gap-8">
    <div class="flex justify-center mb-8">
      <HeadingText text="Rémunération" size="medium" />
    </div>

    <div class="flex flex-col gap-4">

      <InputDateForm
        label="Quand souhaitez-vous que la mission commence ? "
        name="dateDebut"
        v-model="useJobStore().state.dateDebut.dateDebut"
        :min-date="new Date().toISOString().split('T')[0]"
        max-date="2027-12-31"
        :error="useJobStore().state.in_error"
      />

    

      <SelectForm
        :options="useJobStore().DataUrgence"
        optionName="name"
        label="Souhaitez-vous publier cette annonce pour une mission urgente ? "
        name="missionUrgente"
        placeholder="3 Enfants"
        v-model="useJobStore().state.dateDebut.missionUrgente"
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


const dateDebut = ref(useJobStore().state.dateDebut.dateDebut);

</script>
<style></style>
