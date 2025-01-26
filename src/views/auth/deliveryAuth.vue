<script setup lang="ts">
import InputForm from "@/components/forms/inputForm.vue";
import SignInLayout from "@/layouts/auth/signInLayout.vue";
import { IonContent, IonPage } from "@ionic/vue";
</script>

<template>
  <IonPage>
    <IonContent>
    <SignInLayout
      heading="Livreur"
      subHeading="Accède à ton espace, consulte et gère toutes les livraisons qui te sont assignées."
    >
      <template v-slot:content>
        <InputForm
          label="Adresse email"
          type="email"
          name="email"
          placeholder="chap@gmail.com"
        />
        <InputForm
          label="Mot de passe"
          type="password"
          name="email"
          placeholder="Mot de passe"
        />
      </template>
    </SignInLayout>
  </IonContent>
</IonPage>
</template>
