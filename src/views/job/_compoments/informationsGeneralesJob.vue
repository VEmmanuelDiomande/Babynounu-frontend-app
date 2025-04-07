<template>
  <IonContent class="ion-padding h-full gap-8">
    <div class="flex justify-center mb-8">
      <HeadingText text="Informations Générales" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputForm
        label="Titre"
        type="text"
        name="titre"
        placeholder="Je recherche une nounu"
        v-model="useJobStore().state.informationsGenerales.titre"
        :error="useJobStore().state.in_error"
      />

      <TextareaAjustForm
        label="Description"
        name="description"
        placeholder="Donnez une description de votre mission"
        v-model="useJobStore().state.informationsGenerales.description"
        :error="useJobStore().state.in_error"
      />

      <SelectForm
        :options="useJobStore().DataMoyensContact"
        optionName="name"
        label="Quel est votre moyen de contact préféré ? "
        name="moyens_de_contact"
        placeholder="bin@gmail.com"
        v-model="useJobStore().state.informationsGenerales.moyens_de_contact"
        :error="useJobStore().state.in_error"
      />

      <SelectForm
        :options="DataLocalizations?.parameter"
        optionName="name"
        label="Dans quelle ville êtes-vous situé(e) ?  "
        name="adress"
        placeholder="bin@gmail.com"
        v-model="useJobStore().state.informationsGenerales.adress"
        :error="useJobStore().state.in_error"
      />

      <InputBoxForm
        :options="DataLocalizations?.parameter"
        optionName="name"
        label="Dans quel quartier ou zone souhaitez-vous que le service soit effectué ?  "
        name="zone_de_travail"
        placeholder="bin@gmail.com"
        v-model="useJobStore().state.informationsGenerales.zone_de_travail"
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
<style></style>
