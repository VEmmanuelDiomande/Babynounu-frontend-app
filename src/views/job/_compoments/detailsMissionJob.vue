<template>
  <IonContent class="ion-padding h-full gap-8">
    <div class="flex justify-center mb-8">
      <HeadingText text="Détails sur la Mission" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputBoxForm
        option-name="name"
        :options="DataFrequenceDesServices?.parameter"
        label="Quelle est la durée de la mission ? "
        type="text"
        name="frequence_des_services"
        placeholder="Je recherche une nounu"
        v-model="useJobStore().state.detailsMission.frequence_des_services"
        :error="useJobStore().state.in_error"
      />

      <InputBoxForm
        option-name="name"
        :options="DataHoraireSouhaites?.parameter"
        label="Quels sont les horaires de travail souhaités ?"
        name="horaire_souhaites"
        placeholder=""
        v-model="useJobStore().state.detailsMission.horaire_souhaites"
        :error="useJobStore().state.in_error"
      />

      <SelectForm
        :options="DataInclusWeekend"
        optionName="name"
        label="La mission inclut-elle des week-ends"
        name="inclus_weekend"
        placeholder="bin@gmail.com"
        v-model="useJobStore().state.detailsMission.inclus_weekend"
        :error="useJobStore().state.in_error"
      />
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputBoxForm from "@/components/forms/inputBoxForm.vue";
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

const ListHoraireSouhaites = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_DESIRED_TIMES);
const {
  data: DataHoraireSouhaites,
  error: ErrorHoraireSouhaites,
  isLoading: LoadingHoraireSouhaites,
  isError: ISErrorHoraireSouhaites,
} = useQuery({
  queryKey: ["ListHoraireSouhaites"],
  queryFn: ListHoraireSouhaites,
});

const ListFrequenceDesServices = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_SERVICE_FREQUENCY);
const {
  data: DataFrequenceDesServices,
  error: ErrorFrequenceDesServices,
  isLoading: LoadingFrequenceDesServices,
  isError: ISErrorFrequenceDesServices,
} = useQuery({
  queryKey: ["ListFrequenceDesServices"],
  queryFn: ListFrequenceDesServices,
});

const DataCombinationServices = [
  {
    name: "Oui, je veux une combinaison des deux services",
    value: true,
    id: 1,
  },
  {
    name: "Non, je ne veux pas une combinaison des deux services",
    value: false,
    id: 2,
  },
];

const DataTypeServices = [
  { name: "Nounu", value: "nounu", id: 1 },
  { name: "Femme de ménage", value: "menagere", id: 2 },
];


const DataInclusWeekend = [
  {
    name: "Oui, la missions inclus des week-ends",
    value: true,
    id: 1,
  },
  {
    name: "Non, la missions ne inclus pas des week-ends",
    value: false,
    id: 2,
  },
];
</script>
<style></style>
