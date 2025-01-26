<template>
    <IonContent class="ion-padding h-full gap-8">
      <div class="flex justify-center mb-8">
        <HeadingText text="Informations personnelles" size="medium" />
      </div>
  
      <div class="flex flex-col gap-4">
   
        <InputForm
          label="Titre de poste"
          type="text"
          name="title"
          placeholder="Fatou Koné Binaté"
          :modelValue="useProfilStore().state.InfoPersonalParentProfilValue?.fullName"
          @update:modelValue="
            useProfilStore().state.InfoPersonalParentProfilValue.fullName =
              $event.target.value
          "
          :error="useProfilStore().state.in_error"
        />
  
        <InputForm
          label="Adresse e-mail"
          type="email"
          name="emailAdress"
          placeholder="bin@gmail.com"
          :modelValue="useProfilStore().state.InfoPersonalParentProfilValue?.emailAdress"
          @update:modelValue="
            useProfilStore().state.InfoPersonalParentProfilValue.emailAdress =
              $event.target.value
          "
          :error="useProfilStore().state.in_error"
        />
  
        <InputForm
          label="Numéro de téléphone"
          type="number"
          name="phone"
          placeholder="+225 00 00 00 00"
          info="Ajoutez l'indicatif du pays"
          :modelValue="useProfilStore().state.InfoPersonalParentProfilValue?.phone"
          @update:modelValue="
            useProfilStore().state.InfoPersonalParentProfilValue.phone =
              $event.target.value
          "
          :error="useProfilStore().state.in_error"
        />
      </div>
    </IonContent>
  </template>
  
  <script setup lang="ts">
  import InputForm from "@/components/forms/inputForm.vue";
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
      useProfilStore().state.InfoPersonalParentProfilValue.image_profil = file;
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
  