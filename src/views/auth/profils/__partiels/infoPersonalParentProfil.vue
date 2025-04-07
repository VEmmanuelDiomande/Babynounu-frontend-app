<template>
  <IonContent class="ion-padding h-full gap-8">
    <div class="flex justify-center mb-8">
      <HeadingText text="Informations personnelles" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputFileForm
        class="mt-4"
        name="image_profil"
        v-model="useProfilStore().state.InformationPersonnelle.image_profil"
        :error="useProfilStore().state.in_error"
      />

      <InputForm
        label="Nom complete"
        type="text"
        name="fullname"
        placeholder="Fatou Koné Binaté"
        v-model="useProfilStore().state.InformationPersonnelle.fullname"
        :error="useProfilStore().state.in_error"
      />

      <InputForm
        label="Adresse e-mail"
        type="email"
        name="adresse_mail"
        placeholder="bin@gmail.com"
        v-model="useProfilStore().state.InformationPersonnelle.adresse_mail"
        :error="useProfilStore().state.in_error"
      />

      <PhoneForm
        id="phone"
        label="Numéro de téléphone"
        name="phone"
        v-model="useProfilStore().state.InformationPersonnelle.phone"
        placeholder="Entrez votre numéro de téléphone"
        :error="useProfilStore().state.in_error"
      />
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputFileForm from "@/components/forms/inputFileForm.vue";
import InputForm from "@/components/forms/inputForm.vue";
import PhoneForm from "@/components/forms/phoneForm.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent } from "@ionic/vue";
import { reactive, ref } from "vue";

const state = reactive({
  InfoPersonalParentProfil: {
    fullname: "",
    email: "",
    phone: "",
  },
  in_error: {
    path: "",
    message: "",
  },
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
    useProfilStore().state.InformationPersonnelle.image_profil = file;
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
}
</style>
