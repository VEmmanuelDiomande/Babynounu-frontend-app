<template>
  <IonContent class="ion-padding h-full gap-8">
    <div class="flex justify-center mb-8">
      <HeadingText text="Informations sur les Enfants" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
     

      <InputForm
        label="Nombre d'enfants"
        type="number"
        name="numberOfChildren"
        placeholder="5 Enfants"
        :modelValue="useProfilStore().state.ChildrenInfoProfilValue?.numberOfChildren"
        @update:modelValue="
          useProfilStore().state.ChildrenInfoProfilValue.numberOfChildren =
            $event.target.value
        "
        :error="useProfilStore().state.in_error"
      />

      <InputForm
        label="Âge des enfants"
        type="text"
        name="agesOfChildrens"
        placeholder="Préscolaire"
        :data="DataSettingAgesOfChildrens"
        dataName="name"
        v-model="useProfilStore().state.ChildrenInfoProfilValue.agesOfChildrens"
        :error="useProfilStore().state.in_error"
      />

      <InputForm
        label="Besoins spécifiques "
        type="text"
        name="specificNeeds"
        placeholder="Support émotionnel, Gestion des comportements"
        :error="useProfilStore().state.in_error"
        :data="DataSettingSpecificNeeds"
        v-model="useProfilStore().state.ChildrenInfoProfilValue.specificNeeds"
        dataName="name"
      />
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputForm from "@/components/forms/inputForm.vue";
// import IcIcons from "@/components/icons/IcIcons.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent } from "@ionic/vue";
import { useQuery } from "@tanstack/vue-query";
import { reactive, ref } from "vue";

// data, error, isLoading, isError
const ListAgesOfChildrens = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_AGE_OF_CHILDRENS);
const {
  data: DataSettingAgesOfChildrens,
  error: ErrorSettingAgesOfChildren,
  isLoading: LoadingSettingAgesOfChildren,
  isError: ISErrorSettingAgesOfChildren,
} = useQuery({
  queryKey: ["ListAgesOfChildrens"],
  queryFn: ListAgesOfChildrens,
});

const ListSpecificNeeds = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_SPECIFIC_NEEDS);
const {
  data: DataSettingSpecificNeeds,
  error: ErrorSettingSpecificNeeds,
  isLoading: LoadingSettingSpecificNeeds,
  isError: ISErrorSettingSpecificNeeds,
} = useQuery({
  queryKey: ["ListSpecificNeeds"],
  queryFn: ListSpecificNeeds,
});

</script>
