<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center">
      <HeadingText text="Disponibilités" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputBoxForm
        label="Horaires disponibles  "
        type="text"
        name="horaire_disponible"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        v-model="useProfiNounulStore().state.Disponibilites.horaire_disponible"
        :error="useProfiNounulStore().state.in_error"
        :options="DataSchedulesAvailable?.parameter"
        option-name="name"
      />
      <SelectForm
        :options="useProfiNounulStore().DataEMERGENCIES"
        optionName="name" 
        label="Urgences"
        LabelSub="Spécifiez si vous êtes disponible pour des missions de dernière minute ou d'urgence."
        type="text"
        name="urgences"
        placeholder="Oui, je suis disponible pour des missions urgentes."
        v-model="useProfiNounulStore().state.Disponibilites.urgences"
        :error="useProfiNounulStore().state.in_error"
        
      >
      </SelectForm>
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputBoxForm from "@/components/forms/inputBoxForm.vue";
import InputForm from "@/components/forms/inputForm.vue";
import SelectForm from "@/components/forms/selectForm.vue";
// import IcIcons from "@/components/icons/IcIcons.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent } from "@ionic/vue";
import { useQuery } from "@tanstack/vue-query";
// data, error, isLoading, isError

const ListSchedulesAvailables = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_DESIRED_TIMES);
const {
  data: DataSchedulesAvailable,
  error: ErrorSchedulesAvailable,
  isLoading: LoadingSchedulesAvailable,
  isError: ISErrorSchedulesAvailable,
} = useQuery({
  queryKey: ["ListSchedulesAvailables"],
  queryFn: ListSchedulesAvailables,
});



</script>
