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
import SelectForm from "@/components/forms/selectForm.vue";
import { useQuery } from "@tanstack/vue-query";
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import InputBoxForm from "@/components/forms/inputBoxForm.vue";
import { ref } from "vue";
import TextareaAjustForm from "@/components/forms/textareaAjustForm.vue";

const { state, Login } = useAuthSignInHook();
const selectedOptions = ref<string[]>([]);
const selectedValues = ref<string>("");
const textValue = ref<string>("");

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
          
          <div class="flex flex-col gap-4">
            <InputForm
            label="Adresse email"
            type="email"
            name="email"
            placeholder="chap@gmail.com"
            v-model="useAuthStore().state.email"
            :error="useAuthStore().state.in_error_login"
          />
          <InputForm
            label="Mot de passe"
            type="password"
            name="password"
            placeholder="Mot de passe"
            v-model="state.in_login.password"
            :error="useAuthStore().state.in_error_login"
          />

          <!-- {{ selectedValues }}
      <SelectForm
        :options="DataLocalizations"
        optionName="name"
        label="Votre Localisation"
        LabelSub="Indiquez votre localisation pour permettre aux prestataires de vous trouver plus facilement."
        type="text"
        name="address"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        v-model="selectedValues"
        :error="useProfiNounulStore().state.in_error"
      />

      {{ selectedOptions }}
      <InputBoxForm
        :options="DataLocalizations"
        label="Langues parlées"
        placeholder="Francais, Anglais, autres"
        v-model="selectedOptions"
        :error="useProfiNounulStore().state.in_error"
        option-name="name"
        name="languages"
      />

      <TextareaAjustForm
        v-model="textValue"
      label="Saisissez votre texte :"
        /> -->
          </div>

        </template>

        <template v-slot:ContentTerms>
          <AuthButton
            title="Se connecter"
            setcolor="bg-secondary"
            :actions="() => Login(state.in_login)"
            :loading="state.loading"
          />
<div class="flex flex-col gap-4 mt-4">
  <p class="text-sm text-gray-600 text-center">
    Vous n'avez pas encore de compte ?
  </p>
  <router-link 
    to="/auth/sign-up"
    class="text-primary hover:text-primary-dark text-center font-medium"
  >
    S'inscrire
  </router-link>
</div>
        </template>
      </SignInLayout>

     
    </IonContent>
  </IonPage>
</template>
