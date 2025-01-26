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
</script>

<template>
  <IonPage ref="page">
    <IonContent>
      <SignInLayout
        heading="S'inscrire"
        subHeading="Inscrivez-vous maintenant et trouvez la nounou idéale pour votre enfant en quelques minutes."
      >
        <template v-slot:content>
          <div class="flex flex-col gap-1">
            <!-- <InputForm
              label="Nom complete"
              type="text"
              name="fullname"
              placeholder="Nom complete"
              :modelValue="state.in_register.fullname"
              @update:modelValue="
                state.in_register.fullname = $event.target.value
              "
              :error="useAuthStore().state.in_error"
            /> -->
            <InputForm
              label="Adresse email"
              type="email"
              name="email"
              placeholder="Adresse email"
              :modelValue="state.in_register.email"
              @update:modelValue="state.in_register.email = $event.target.value"
              :error="useAuthStore().state.in_error"
            />
            <InputForm
              label="Mot de passe"
              type="password"
              name="password"
              placeholder="Mot de passe"
              :modelValue="state.in_register.password"
              @update:modelValue="
                state.in_register.password = $event.target.value
              "
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
            @click="Register(state.in_register)"
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
        </template>
      </SignInLayout>

      <ion-button id="open-modal-auth-profil" class="hidden" expand="block">Open</ion-button>

      <CreateProfilModal
        v-if="
          useProfilStore().state.ChildrenInfoProfilValue &&
          useProfiNounulStore().state
        "
        :StepProfil="
          useProfilStore().state.activeMenu_typeOfProfil == 'open-modal-auth-profil-parent'
            ? useProfilStore().state.stepProfil
            : useProfiNounulStore().state.StepProfil
        "
        :LessStepProfil="
          useProfilStore().state.activeMenu_typeOfProfil == 'open-modal-auth-profil-parent'
            ? useProfilStore().state.LessStepProfil
            : useProfiNounulStore().LessStepProfil
        "
      >
        <template v-slot:content>
          <ParentProfilAuth
            v-if="
              useProfilStore().state.activeMenu_typeOfProfil == 'open-modal-auth-profil-parent'
            "
          />
          <NounuProfilAuth
            v-if="
              useProfilStore().state.activeMenu_typeOfProfil == 'open-modal-auth-profil-nounu'
            "
          />
        </template>
      </CreateProfilModal>
    </IonContent>
  </IonPage>
</template>
