<template>
  <IonContent class="ion-padding h-full gap-8">
    <div class="flex justify-center mb-8">
      <HeadingText text="Type de Service Recherché" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <SelectForm
        option-name="name"
        :options="DataTypeServices?.parameter"
        label="Pour quel type de service avez-vous besoin ? "
        -label-sub="Cochez les options pertinentes"
        type="text"
        name="type_services"
        placeholder="Je recherche une nounu"
        v-model="useJobStore().state.typeService.type_services"
        :error="useJobStore().state.in_error"
      />

      <SelectForm
        option-name="name"
        :options="useJobStore().DataCombinationServices"
        label="Recherchez vous une combinaison des deux services ?"
        name="combinaison_service"
        placeholder="bin@gmail.com"
        v-model="useJobStore().state.typeService.combinaison_service"
        :error="useJobStore().state.in_error"
      />

      <InputBoxForm
        :options="DataTaches?.parameter"
        optionName="name"
        label="Précisez les tâches souhaitées."
        type="email"
        name="taches"
        placeholder="bin@gmail.com"
        v-model="useJobStore().state.typeService.taches"
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

const ListTypeServices = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_TYPE_OF_SERVICE_PROVIDER);
const {
  data: DataTypeServices,
  error: ErrorTypeServices,
  isLoading: LoadingTypeServices,
  isError: ISErrorTypeServices,
} = useQuery({
  queryKey: ["ListTypeServices"],
  queryFn: ListTypeServices,
});

const ListTaches = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_TASKS);
const {
  data: DataTaches,
  error: ErrorTaches,
  isLoading: LoadingTaches,
  isError: ISErrorTaches,
} = useQuery({
  queryKey: ["ListTaches"],
  queryFn: ListTaches,
});



</script>
<style></style>
