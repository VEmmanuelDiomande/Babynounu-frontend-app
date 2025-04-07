<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8font-love">
    <div class="flex justify-center">
      <HeadingText text="Informations personnelles" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputFileForm
        class="mt-4"
        name="image_profil"
        v-model="useProfiNounulStore().state.InformationPersonnelle.image_profil"
        :error="useProfiNounulStore().state.in_error"
      />

      <InputForm
        label="Nom complete"
        type="text"
        name="fullname"
        placeholder="Fatou Koné Binaté"
        v-model="useProfiNounulStore().state.InformationPersonnelle.fullname"
        :error="useProfiNounulStore().state.in_error"
      />

      <InputForm
        label="Age"
        type="number"
        name="age"
        placeholder="26 ans"
        v-model="useProfiNounulStore().state.InformationPersonnelle.age"
        :error="useProfiNounulStore().state.in_error"
      />

      <PhoneForm
        label="Numéro de téléphone"
        id="phone"
        name="phone"
        placeholder="+225 00 00 00 00"
        info="Ajoutez l'indicatif du pays"
        v-model="useProfiNounulStore().state.InformationPersonnelle.phone"
        :error="useProfiNounulStore().state.in_error"
      />

      <SelectForm
        :options="DataLocalizations?.parameter"
        optionName="name"
        label="Votre Localisation"
        LabelSub="Indiquez votre localisation pour permettre aux prestataires de vous trouver plus facilement."
        
        name="address"
        placeholder="Abidjan"
        v-model="useProfiNounulStore().state.InformationPersonnelle.address"
        :error="useProfiNounulStore().state.in_error"
      />
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputFileForm from "@/components/forms/inputFileForm.vue";
import InputForm from "@/components/forms/inputForm.vue";
import PhoneForm from "@/components/forms/phoneForm.vue";
import SelectForm from "@/components/forms/selectForm.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { IonContent } from "@ionic/vue";
import { useQuery } from "@tanstack/vue-query";
import { reactive, ref } from "vue";

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