<script setup lang="ts">
import AuthButton from "@/components/buttons/authButton.vue";
import InputForm from "@/components/forms/inputForm.vue";
import { useAuthSignInHook } from "@/hooks/authHooks/signIn.hook";
import SignInLayout from "@/layouts/auth/signInLayout.vue";
import { useAuthStore } from "@/stores/auth.store";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent, IonPage } from "@ionic/vue";
import CreateProfilModal from "./profils/createProfilModal.vue";
import ParentProfilAuth from "./profils/parentProfilAuth.vue";
import NounuProfilAuth from "./profils/nounuProfilAuth.vue";

const { state, Login } = useAuthSignInHook();
</script>

<template>
  <IonPage>
    <IonContent>
      <SignInLayout
        heading="Se connecter"
        subHeading="Connectez-vous pour retrouver vos nounous favorites et gérer vos réservations en un clic."
        btnName="Se connecter"
        bgColor="bg-gradient-to-r to-yellow-400 from-yellow-500"
      >
        <template v-slot:content>
          <InputForm
            label="Adresse email"
            type="email"
            name="email"
            placeholder="chap@gmail.com"
            :modelValue="state.in_login.email"
            @update:modelValue="state.in_login.email = $event.target.value"
            :error="useAuthStore().state.in_error_login"
          />
          <InputForm
            label="Mot de passe"
            type="password"
            name="password"
            placeholder="Mot de passe"
            :modelValue="state.in_login.password"
            @update:modelValue="state.in_login.password = $event.target.value"
            :error="useAuthStore().state.in_error_login"
          />
        </template>

        <template v-slot:ContentTerms>
          <AuthButton
            title="Se connecter"
            setcolor="bg-secondary"
            @click="Login(state.in_login)"
            :loading="state.loading"
          />
        </template>
      </SignInLayout>

      <ion-button id="open-modal-auth-profil" class="hidden" expand="block"
        >Open</ion-button
      >

      <CreateProfilModal
        v-if="
          useProfilStore().state.ChildrenInfoProfilValue &&
          useProfiNounulStore().state
        "
        :StepProfil="
          useProfilStore().state.activeMenu_typeOfProfil ==
          'open-modal-auth-profil-parent'
            ? useProfilStore().state.stepProfil
            : useProfiNounulStore().state.StepProfil
        "
        :LessStepProfil="
          useProfilStore().state.activeMenu_typeOfProfil ==
          'open-modal-auth-profil-parent'
            ? useProfilStore().state.LessStepProfil
            : useProfiNounulStore().LessStepProfil
        "
      >
        <template v-slot:content>
          <ParentProfilAuth
            v-if="
              useProfilStore().state.activeMenu_typeOfProfil ==
              'open-modal-auth-profil-parent'
            "
          />
          <NounuProfilAuth
            v-if="
              useProfilStore().state.activeMenu_typeOfProfil ==
              'open-modal-auth-profil-nounu'
            "
          />
        </template>
      </CreateProfilModal>
    </IonContent>
  </IonPage>
</template>
