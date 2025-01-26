<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center">
      <HeadingText text="Informations personnelles" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <!-- <InputForm
        label="Photo de profil"
        LabelSub="Fournissez des documents prouvant votre identité (pièce d'identité, casier judiciaire vierge si disponible)."
        type="file"
        name="photo"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        @change="onFileChange"
        :error="useProfiNounulStore().state.in_error"
      /> -->



  <div class="flex flex-col font-love gap-1">
    <!-- Étiquette de champ -->
    <label for="id_input_image_profil" class="text-label font-love font-semibold text-zinc-800 rounded-md z-50 py-1">
      Photo de profil
    </label>

    <!-- Champ de fichier -->
    <input
      accept="image/*"
      type="file"
      id="id_input_image_profil"
      name="image_profil"
      @change="onFileChange"
      class="cursor-pointer"
    />

    <!-- Aperçu de l'image -->
    <div v-if="selectedImage" class="mt-2 size-14 bg-gray-100 border border-gray-300 rounded-md overflow-hidden">
      <img :src="selectedImage" alt="Aperçu de l'image" class="object-cover w-full h-full" />
    </div>

    <!-- Message d'erreur -->
    <span
      class="text-sm text-red-500"
      v-if="useProfiNounulStore().state.in_error?.path == 'image_profil'"
    >
      {{ useProfiNounulStore().state.in_error?.message }}
    </span>
  </div>


      <InputForm
        label="Nom complete"
        type="text"
        name="fullName"
        placeholder="Fatou Koné Binaté"
        :modelValue="useProfiNounulStore().state.InfoPersonalValue?.fullName"
        @update:modelValue="
          useProfiNounulStore().state.InfoPersonalValue.fullName =
            $event.target.value
        "
        :error="useProfiNounulStore().state.in_error"
      />

      <InputForm
        label="Age"
        type="number"
        name="age"
        placeholder="26 ans"
        :modelValue="useProfiNounulStore().state.InfoPersonalValue?.age"
        @update:modelValue="
          useProfiNounulStore().state.InfoPersonalValue.age =
            $event.target.value
        "
        :error="useProfiNounulStore().state.in_error"
      />

      <InputForm
        label="Numéro de téléphone"
        type="text"
        name="phone"
        placeholder="+225 00 00 00 00"
        info="Ajoutez l'indicatif du pays"
        :modelValue="useProfiNounulStore().state.InfoPersonalValue?.phone"
        @update:modelValue="
          useProfiNounulStore().state.InfoPersonalValue.phone =
            $event.target.value
        "
        :error="useProfiNounulStore().state.in_error"
      />

      <SelectForm
        :options="DataLocalizations"
        optionName="name"
        label="Votre Localisation"
        LabelSub="Indiquez votre localisation pour permettre aux prestataires de vous trouver plus facilement."
        type="text"
        name="address"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        :modelValue="useProfiNounulStore().state.InfoPersonalValue.address"
        @update:modelValue="
          useProfiNounulStore().state.InfoPersonalValue.address =
            $event.target.value
        "
        :error="useProfiNounulStore().state.in_error"
      >
      </SelectForm>

      <!-- <InputForm
        label="Zone géographique de prestation"
        type="text"
        name="prestation_zone"
        placeholder="Abidjan, Bouaké, Marcory, Bingerville"
        v-model="useProfilStore().LocalizationProfilValue.prestation_zone"
        :error="useProfilStore().state.in_error"
        :data="DataLocalizations"
        dataName="name"
      /> -->
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

// Référence pour l'image sélectionnée
const selectedImage = ref<string | null>(null);

// Fonction pour gérer le changement de fichier
const onFileChange = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files ? fileInput.files[0] : null;

  if (file) {
    // Créer un objet URL pour afficher l'image sélectionnée
    selectedImage.value = URL.createObjectURL(file);
    useProfiNounulStore().state.InfoPersonalValue.image_profil = file
  }
};

</script>
<style>
/* Ajoutez des styles supplémentaires si nécessaire */
input[type="file"] {
  display: block;
  margin-top: 10px;
}

img {
  object-fit: cover;
}</style>