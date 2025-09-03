<script setup lang="ts">
import AuthButton from "@/components/buttons/authButton.vue";
import InputForm from "@/components/forms/inputForm.vue";
import { useAuthSignUpHook } from "@/hooks/authHooks/signUp.hook";
import SignInLayout from "@/layouts/auth/signInLayout.vue";
import { IonContent, IonPage } from "@ionic/vue";
import ParentProfilAuth from "./profils/parentProfilAuth.vue";
import NounuProfilAuth from "./profils/nounuProfilAuth.vue";
import { useProfilStore } from "@/stores/authProfilStore";
import CreateProfilModal from "./profils/createProfilModal.vue";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { useAuthStore } from "@/stores/auth.store";

const { Register, state, ToggleActiveMenu_typeOfProfil } = useAuthSignUpHook();
const { state: authState } = useAuthStore();
</script>

<template>
  <IonPage ref="page">
    <IonContent>
      <SignInLayout
        heading="S'inscrire"
        subHeading="Inscrivez-vous maintenant et trouvez la nounou idéale pour votre enfant en quelques minutes."
      >
        <template v-slot:content>
          <div class="flex flex-col gap-4">
            <InputForm
              label="Adresse email"
              name="email"
              type="text"
              placeholder="Adresse email"
              v-model="authState.email"
              :error="useAuthStore().state.in_error"
            />
            <InputForm
              label="Mot de passe"
              type="password"
              name="password"
              placeholder="Mot de passe"
              v-model="authState.in_register.password"
              :error="useAuthStore().state.in_error"
            />

            <div class="flex flex-col w-full mt-4 gap-2 z-40">
              <label
                class="text-label font-love font-semibold text-zinc-800 rounded-md z-50 py-1"
                >Type de profil</label
              >

              <div class="grid grid-cols-2 gap-2 p-1 w-full bg-slate-50">
                <div
                  v-for="(item, index) in state.type_of_profil"
                  :key="index"
                  class="flex gap-2"
                >
                  <div
                    @click="ToggleActiveMenu_typeOfProfil(index)"
                    class="flex justify-center font-love text-sm font-semibold p-2 w-full text-center  rounded-lg"
                    :class="
                      item.actived ? 'bg-primary border-[1px] text-white' : 'border-[0px]'
                    "
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
              <span
                class="text-red-400 text-sm font-bold"
                v-if="useAuthStore().state.in_error?.path == 'type'"
              >
                {{ useAuthStore().state.in_error?.message }}
              </span>
            </div>
          </div>
        </template>

        <template v-slot:ContentTerms>
          <AuthButton
            title="S'inscrire"
            setcolor="bg-primary"
            :actions="() => Register(authState.in_register)"
            :loading="state.loading"
          />

          <!-- Terms -->
          <div class="text-center font-love gap-1 flex flex-row flex-wrap">
            <p class="font-f400 text-xs">
              En vous inscrivant, vous acceptez nos
            </p>
            <RouterLink
              class="font-love text-zinc-800 font-extrabold text-xs"
              :to="'/'"
            >
              Conditions générales,
            </RouterLink>

            <p class="font-f400 text-xs">notre</p>
            <RouterLink
              class="font-love text-zinc-800 font-extrabold text-xs"
              :to="'/'"
            >
              Politique de confidentialité
            </RouterLink>

            <p class="font-f400 text-xs">et</p>
            <RouterLink
              class="font-love text-zinc-800 font-extrabold text-xs"
              :to="'/'"
            >
              Avis de cookies.
            </RouterLink>
          </div>

          <div class="flex flex-col gap-4 mt-4">
  <p class="text-sm text-gray-600 text-center">
    Vous avez dèja un compte ?
  </p>
  <router-link 
    to="/auth/sign-in"
    class="text-primary hover:text-primary-dark text-center font-medium"
  >
    Connectez-vous
  </router-link>
</div>
        </template>
      </SignInLayout>

  

    
    </IonContent>
  </IonPage>
</template>
