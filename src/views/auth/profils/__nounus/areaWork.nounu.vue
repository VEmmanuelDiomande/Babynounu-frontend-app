<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center">
      <HeadingText text="Disponibilité géographique" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputForm
        label="Zone de travail"
        LabelSub="Indiquez la zone géographique où vous êtes prêt à travailler."
        type="text"
        name="areaWork"
        placeholder="Abidjan, Bouaké, Marcory, Bingerville"
        v-model="useProfiNounulStore().state.AreaWorkValue.areaWork"
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
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
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
