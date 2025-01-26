<template>
  <IonContent class="ion-padding h-full">
    <div class="flex justify-center mb-8">
      <HeadingText text="Localisation" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <SelectForm
        :options="DataLocalizations"
        optionName="name"
        label="Votre Localisation"
        LabelSub="Indiquez votre localisation pour permettre aux prestataires de vous trouver plus facilement."
        type="text"
        name="my_address"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        :modelValue="useProfilStore().state.LocalizationProfilValue.my_address"
        @update:modelValue="
          useProfilStore().state.LocalizationProfilValue.my_address =
            $event.target.value
        "
        :error="useProfilStore().state.in_error"
      >
      </SelectForm>

      <InputForm
        label="Zone géographique de prestation"
        type="text"
        name="prestation_zone"
        placeholder="Abidjan, Bouaké, Marcory, Bingerville"
        v-model="useProfilStore().state.LocalizationProfilValue.prestation_zone"
        :error="useProfilStore().state.in_error"
        :data="DataLocalizations"
        dataName="name"
      />
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputForm from "@/components/forms/inputForm.vue";
import SelectForm from "@/components/forms/selectForm.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent } from "@ionic/vue";
import { useQuery } from "@tanstack/vue-query";
import { reactive } from "vue";

const ListLocalizations = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_LOCALIZATION);
const {
  data: DataLocalizations,
  error: ErrorLocalizations,
  isLoading: LoadingLocalizations,
  isError: ISErrorLocalizations,
} = useQuery({
  queryKey: ["ListLocalizations"],
  queryFn: ListLocalizations,
});
</script>
