<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center">
      <HeadingText text="Vérifications et Références" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <!-- <InputForm
        label="Vérification des confirmés "
        LabelSub="Fournissez des documents prouvant votre identité (pièce d'identité, casier judiciaire vierge si disponible)."
        type="file"
        name="verificationOfConfirmed"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        :modelValue="useProfiNounulStore().state.VerificationValue.verificationOfConfirmed"
        @update:modelValue="
          useProfiNounulStore().state.VerificationValue.verificationOfConfirmed =
            $event.target.value
        "
        :error="useProfiNounulStore().state.in_error"
      /> -->

      <div class="flex flex-col font-love gap-1">
        <label for="id_input_verificationOfConfirmed" class="text-label font-love font-semibold text-zinc-800 rounded-md z-50 py-1"> Documents</label>
        <span class="text-sm font-love font-normal text-zinc-500 mb-2" >Fournissez des documents prouvant votre identité (pièce d'identité, casier judiciaire vierge si disponible).</span>
        <input accept="image/*" type="file" id="id_input_verificationOfConfirmed" @change="onFileChange" />
        <span
          class="text-sm text-red-500"
          v-if="useProfiNounulStore().state.in_error?.path == 'verificationOfConfirmed'"
        >
          {{ useProfiNounulStore().state.in_error?.message }}
        </span>
      </div>

      <div class="flex flex-col gap-2 mt-2">
        <div class="flex flex-col gap-2">
          <HeadingText text="Services recherchés" size="small" />
          <span class=" text-sm font-love text-zinc-500 "
            >Indiquez les contacts des familles ou employeurs précédents qui
            peuvent attester de la qualité de vos services.</span
          >
        </div>

        <InputForm
          label="Contact 1"
          type="number"
          name="refrence_1"
          placeholder="+225 06 00 00 00 00"
          :modelValue="useProfiNounulStore().state.VerificationValue.refrence_1"
          @update:modelValue="
            useProfiNounulStore().state.VerificationValue.refrence_1 =
              $event.target.value
          "
          :error="useProfiNounulStore().state.in_error"
        />

        <InputForm
          label="Contact 2"
          type="number"
          name="refrence_2"
          placeholder="+25 06 00 00 00 00"
          :modelValue="useProfiNounulStore().state.VerificationValue.refrence_2"
          @update:modelValue="
            useProfiNounulStore().state.VerificationValue.refrence_2 =
              $event.target.value
          "
          :error="useProfiNounulStore().state.in_error"
        />

        <InputForm
          label="Contact 3"
          type="number"
          name="refrence_3"
          placeholder="+225 06 00 00 00 00"
          :modelValue="useProfiNounulStore().state.VerificationValue.reference_3"
          @update:modelValue="
            useProfiNounulStore().state.VerificationValue.reference_3 =
              $event.target.value
          "
          :error="useProfiNounulStore().state.in_error"
        />
      </div>

      <InputForm
        label="Certifications"
        LabelSub="Si vous avez des certifications spécifiques (formation en premiers secours, diplôme en petite enfance), assurez-vous de les identifier."
        type="text"
        name="certifications"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        v-model="useProfiNounulStore().state.VerificationValue.certifications"
        :error="useProfiNounulStore().state.in_error"
        :data="DataCertification"
        dataName="name"
      />
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
  useProfiNounulStore().state.VerificationValue.verificationOfConfirmed = file;
  console.log(useProfiNounulStore().state.VerificationValue.verificationOfConfirmed);
};
</script>
