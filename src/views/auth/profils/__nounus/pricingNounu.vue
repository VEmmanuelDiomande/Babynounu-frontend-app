<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center">
      <HeadingText text="Tarifications" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputCurrencyForm
        label="Tarif Horaire "
        currency="XOF"
        LabelSub="Indiquez combien vous facturez par heure pour vos services."
        type="number"
        name="tarif_horaire"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        v-model="useProfiNounulStore().state.Tarifications.tarif_horaire"
        :error="useProfiNounulStore().state.in_error"
      />

      <InputCurrencyForm
        label="Tarif Mensuel "
        currency="XOF"
        LabelSub="Si vous offrez des services de garde à temps plein, indiquez un tarif mensuel."
        type="number"
        name="tarif_mensuel"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        v-model="useProfiNounulStore().state.Tarifications.tarif_mensuel"
        :error="useProfiNounulStore().state.in_error"
      />

      <SelectForm
        :options="useProfiNounulStore().DataFlexiblePrice"
        optionName="name"
        label="Flexible Tarifaire"
        LabelSub="Précisez si vos tarifs sont négociables."
        type="text"
        name="flexiblePrice"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        v-model="useProfiNounulStore().state.Tarifications.flexibilite_tarifaire"
        :error="useProfiNounulStore().state.in_error"
      >
      </SelectForm>
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputCurrencyForm from "@/components/forms/inputCurrencyForm.vue";
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
