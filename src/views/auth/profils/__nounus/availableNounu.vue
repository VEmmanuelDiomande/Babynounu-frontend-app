<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center">
      <HeadingText text="Disponibilités" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputForm
        label="Horaires disponibles  "
        type="text"
        name="schedulesAvailable"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        v-model="useProfiNounulStore().state.AvailabeValue.schedulesAvailable"
        :error="useProfiNounulStore().state.in_error"
        :data="DataSchedulesAvailable"
        dataName="name"
      />

      <SelectForm
        :options="DataEMERGENCIES"
        optionName="name" 
        label="Urgences"
        LabelSub="Spécifiez si vous êtes disponible pour des missions de dernière minute ou d'urgence."
        type="text"
        name="emergencie"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        :modelValue="useProfiNounulStore().state.AvailabeValue.emergencie"
        @update:modelValue="
          useProfiNounulStore().state.AvailabeValue.emergencie =
            $event.target.value
        "
        :error="useProfiNounulStore().state.in_error"
      >
      </SelectForm>
    </div>
  </IonContent>
</template>

<script setup lang="ts">
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


const DataEMERGENCIES = [
  {
    name: "Oui, je suis disponible pour des missions urgentes.",
  },
  {
    name: "Non, je ne suis pas disponible pour des missions urgentes.",
  }
]
</script>
