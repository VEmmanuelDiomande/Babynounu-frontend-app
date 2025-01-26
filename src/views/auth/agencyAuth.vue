<script setup lang="ts">
import InputForm from "@/components/forms/inputForm.vue";
import SignInLayout from "@/layouts/auth/signInLayout.vue";
import { IonContent, IonPage } from "@ionic/vue";
</script>

<template>
  <IonPage>
    <IonContent>
    <SignInLayout
      heading="S'inscrire à Baby Nounu"
      subHeading="Profitez de la large game de service Baby Nounu et faitez-vous de l'argent."
      btnName="S'inscrire"
    >
      <template v-slot:content>
        <InputForm
          label="Nom complete"
          type="text"
          name="email"
          placeholder="chap@gmail.com"
        />
        <InputForm
          label="Adresse email"
          type="password"
          name="email"
          placeholder="Mot de passe"
        />
        <InputForm
          label="Numero telephone"
          type="tel"
          name="email"
          placeholder="Mot de passe"
        />
        <InputForm
          label="Mot de passe"
          type="password"
          name="email"
          placeholder="Mot de passe"
        />
      </template>

      <template v-slot:ContentTerms>
          <!-- Terms -->
          <div
            class=" text-center gap-1 flex flex-row flex-wrap "
          >
            <p class="font-f400 text-xs">
              En vous inscrivant, vous acceptez nos
            </p>
            <RouterLink
              class="font-f700 text-zinc-800 font-extrabold text-xs"
              :to="'/'"
            >
              Conditions générales,
            </RouterLink>

            <p class="font-f400 text-xs">notre</p>
            <RouterLink
              class="font-f700 text-zinc-800 font-extrabold text-xs"
              :to="'/'"
            >
              Politique de confidentialité
            </RouterLink>

            <p class="font-f400 text-xs">et</p>
            <RouterLink
              class="font-f700 text-zinc-800 font-extrabold text-xs"
              :to="'/'"
            >
              Avis de cookies.
            </RouterLink>
          </div>
        </template>
    </SignInLayout>
  </IonContent>
</IonPage>
</template>
