<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center">
      <HeadingText text="Vérifications et Références" size="medium" />
    </div>

    <div class="flex flex-col gap-2 mt-2">
      <InputFilesForm v-if="!useAuthStore().isUpdateProfil"
        label="Documents"
        name="verification_confirmer"
        LabelSub="Fournissez des documents prouvant votre identité (pièce d'identité, casier judiciaire vierge si disponible)."
        v-model="
          useProfiNounulStore().state.VerificationEtReferences
            .verification_confirmer
        "
      />

      <InputContactReferencesForm
        label="Références"
        LabelSub="Indiquez les contacts des familles ou employeurs précédents qui peuvent attester de la qualité de vos services."
        name="references"
        v-model="
          useProfiNounulStore().state.VerificationEtReferences.references
        "
        :errors="useProfiNounulStore().state.in_error"
      />

      <InputBoxForm
        label="Certifications"
        LabelSub="Si vous avez des certifications spécifiques (formation en premiers secours, diplôme en petite enfance), assurez-vous de les identifier."
        name="certifications"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        v-model="
          useProfiNounulStore().state.VerificationEtReferences.certifications
        "
        :error="useProfiNounulStore().state.in_error"
        :options="DataCertification?.parameter"
        optionName="name"
      />
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputBoxForm from "@/components/forms/inputBoxForm.vue";
import InputContactReferencesForm from "@/components/forms/inputContactReferencesForm.vue";
import InputFilesForm from "@/components/forms/inputFilesForm.vue";
import InputForm from "@/components/forms/inputForm.vue";
import SelectForm from "@/components/forms/selectForm.vue";
// import IcIcons from "@/components/icons/IcIcons.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { useAuthStore } from "@/stores/auth.store";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent } from "@ionic/vue";
import { useQuery } from "@tanstack/vue-query";
import { Input } from "postcss";
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

const ListCertifications = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_CERTIFICATIONS);
const {
  data: DataCertification,
  error: ErrorCertification,
  isLoading: LoadingCertification,
  isError: ISErrorCertification,
} = useQuery({
  queryKey: ["ListCertifications"],
  queryFn: ListCertifications,
});

const DataFlexiblePrice = [
  {
    name: "Oui, mes tarifs sont négociables",
  },
  {
    name: "Non, mes tarifs ne sont pas négociables",
  },
];

const onFileChange = (event: any) => {
  const file = event.target.files[0];
  useProfiNounulStore().state.VerificationEtReferences.verificationOfConfirmed =
    file;
  console.log(
    useProfiNounulStore().state.VerificationEtReferences.verificationOfConfirmed
  );
};
</script>
