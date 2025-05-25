<script setup lang="ts">
import IcIcons from "@/components/icons/IcIcons.vue";
import { RouterLink } from "vue-router";
import { IonContent, IonImg, IonPage } from "@ionic/vue";
import InputForm from "@/components/forms/inputForm.vue";
import AuthButton from "@/components/buttons/authButton.vue";
import { useSignRedirectHook } from "@/hooks/authHooks/signRedirect.hook";
import { useAuthStore } from '@/stores/auth.store';

const { GlobalRedirect } = useSignRedirectHook();
const { state: authState } = useAuthStore();
</script>

<template>
  <IonPage>
    <IonContent>
      <div
        class="min-h-screen flex flex-col font-love justify-center items-center bg-white p-4"
      >
        <div class="fixed inset-0">
          <IonImg
            src="/images/backgrounds/bynu_background_auth.png"
            class="w-full h-full object-cover opacity-20"
            alt=""
          >
          </IonImg>
        </div>
        <!-- Close Button -->
        <button
          class="absolute top-4 left-4 text-gray-500 hover:text-gray-900"
          @click="$router.push({name: 'STARTER_DESTINATION'})"
        >
          <IcIcons name="RiCloseLine" :size="28" />
        </button>

        <!-- Title -->
        <div class="flex flex-col text-center justify-center gap-2">
          
          <div class="flex justify-center w-full h-full">
            <img v-lazy="'/images/logos/logo_babynounu_2.png'" class="h-[150px]" alt="" />
          </div>

          <span class="text-3xl  font-bold"
            >Trouver la Nounou / Ménagère idéale
          </span>
          <span class="text-base font-normal w-11/12 mx-auto"
            >Avec BabyNounu, accédez à des professionnelles de confiance pour le bien-être de votre enfant et votre maison.
            </span
          >
        </div>

        <!-- Buttons -->
        <div class="flex flex-col w-full mt-8 gap-2 z-40">
          <div class="flex flex-col gap-1">
            <InputForm label="Email" name="email" type="email" v-model="authState.email"  placeholder="infos@chay.com"  />
            <AuthButton
              title="S'inscrire"
              setcolor=" bg-primary"
              :actions="() => GlobalRedirect($router, 'SignUpAuth')"
            />
          </div>

          <div
            class="border-t-[1px] flex justify-center items-center relative w-full my-4"
          >
            <span
              class="flex absolute text-xs text-zinc-400 font-bold px-4 bg-white"
              >OU - Restez connecter</span
            >
          </div>

          <AuthButton
            title="Se connecter"
            setcolor=" bg-secondary"
            :actions="() => GlobalRedirect($router, 'SginInAuth')"
          />

          <RouterLink
            :to="{ name: 'HOME' }"
            class="w-full flex items-center justify-center gap-1 bg-gradient-to-r to-white from-white text-zinc-700 font-light border-[1px] py-4 rounded-xl hover:bg-blue-600 transition duration-300"
          >
            <IcIcons name="RiUserLine" :size="20" />
            <span class="text-lg font-bold relative"> Mode invité</span>
          </RouterLink>
        </div>

        <!-- Footer -->
        <footer class="mt-8 hidden">
          <!-- Product  -->
          <div
            className="flex flex-row justify-center items-center gap-2 mt-8 mb-2 h-full "
          >
            <div className="h-8 w-8">
              <ion-img
                className=" w-full h-full"
                src="/src/assets/images/logos/dlx.png"
              ></ion-img>
            </div>

            <div class="flex flex-col justify-center gap-1">
              <p class="text-xr pt-1">Product by</p>
              <p class="relative -top-1 font-extrabold text-base text-primary">
                Dolubux
              </p>
            </div>
          </div>
        </footer>
      </div>
    </IonContent>
  </IonPage>
</template>
