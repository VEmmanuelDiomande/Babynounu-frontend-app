<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center">
      <HeadingText text="Tarifications" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputForm
        label="Tarif Horaire "
        LabelSub="Indiquez combien vous facturez par heure pour vos services."
        type="number"
        name="hourlyRate"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        :modelValue="useProfiNounulStore().state.PricingValue.hourlyRate"
        @update:modelValue="
          useProfiNounulStore().state.PricingValue.hourlyRate =
            $event.target.value
        "
        :error="useProfiNounulStore().state.in_error"
      />

      <InputForm
        label="Tarif Mensuel "
        LabelSub="Si vous offrez des services de garde à temps plein, indiquez un tarif mensuel."
        type="number"
        name="monthlyRate"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        :modelValue="useProfiNounulStore().state.PricingValue.monthlyRate"
        @update:modelValue="
          useProfiNounulStore().state.PricingValue.monthlyRate =
            $event.target.value
        "
        :error="useProfiNounulStore().state.in_error"
      />

      <SelectForm
        :options="DataFlexiblePrice"
        optionName="name"
        label="Flexible Tarifaire"
        LabelSub="Précisez si vos tarifs sont négociables."
        type="text"
        name="flexiblePrice"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        :modelValue="useProfiNounulStore().state.PricingValue.flexiblePrice"
        @update:modelValue="
          useProfiNounulStore().state.PricingValue.flexiblePrice =
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

const DataFlexiblePrice = [
  {
    name: "Oui, mes tarifs sont négociables",
  },
  {
    name: "Non, mes tarifs ne sont pas négociables",
  },
];
</script>
