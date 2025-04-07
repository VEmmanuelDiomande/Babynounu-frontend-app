<template>
  <IonContent class="ion-padding h-full gap-8">
    <div class="flex justify-center mb-8">
      <HeadingText text="Pour une Femme de Ménage" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputBoxForm
        :options="DataAideMenagere?.parameter"
        optionName="name"
        label="Quelles tâches souhaitez-vous que la femme de ménage effectue ? "
        name="aide_menagere"
        placeholder="3 Enfants"
        v-model="useJobStore().state.femmeDeMenage.aide_menagere"
        :error="useJobStore().state.in_error"
      />

      <InputBoxForm
        option-name="name"
        :options="DataEquipementMenager?.parameter"
        label="Souhaitez-vous fournir les équipements et produits nécessaires ?"
        placeholder=""
        name="equipement_menager"
        v-model="useJobStore().state.femmeDeMenage.equipement_menager"
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

const ListAideMenagere = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_HOUSEKEEPER);
const {
  data: DataAideMenagere,
  error: ErrorAideMenagere,
  isLoading: LoadingAideMenagere,
  isError: ISErrorAideMenagere,
} = useQuery({
  queryKey: ["ListAideMenagere"],
  queryFn: ListAideMenagere,
});

const ListEquipementMenager = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_EQUIPMENT);
const {
  data: DataEquipementMenager,
  error: ErrorEquipementMenager,
  isLoading: LoadingEquipementMenager,
  isError: ISErrorEquipementMenager,
} = useQuery({
  queryKey: ["ListEquipementMenager"],
  queryFn: ListEquipementMenager,
});
</script>
<style></style>
