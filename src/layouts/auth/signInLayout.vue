<script setup lang="ts">
import IcIcons from "@/components/icons/IcIcons.vue";
import { IonImg } from "@ionic/vue";
import { useRouter } from "vue-router";
defineProps(["heading", "subHeading", "btnName", "bgColor", "submitForm"]);

const router = useRouter()

const toRedirect = () => {
  router.push({name: 'STARTER_DESTINATION'})
}
</script>

<template>
  <div
    class="min-h-screen z-40 flex flex-col font-love justify-center items-center bg-white p-4"
  >
    <div class="fixed inset-0">
      <IonImg
        :src="'/images/backgrounds/bn_background_auth.jpg'"
        class="w-full h-full object-cover opacity-20"
        alt=""
      >
      </IonImg>
    </div>
    <!-- Close Button -->
    <button
      class="absolute top-4 left-4 text-gray-500 hover:text-gray-900"
      @click="toRedirect"
    >
      <div class="flex items-center gap-8">
        <IcIcons name="RiCloseLine" :size="28" />
      </div>
    </button>

    <div class="flex flex-col gap-8">
      <!-- Title -->
      <IonImg
        src="/images/logos/logo_babynounu_1.png"
        class="h-32 w-32 object-cover"
        alt=""
      >
      </IonImg>
      <div class="flex flex-col  gap-2">
        <span class="text-3xl text-primary font-anton">
          {{ heading }}
        </span>
        <span class="text-base font-normal w-11/12 ">
          {{ subHeading }}
        </span>
      </div>

      <div class="flex flex-col w-full">
        <slot name="content"></slot>
      </div>

      <div class="flex flex-col z-40 gap-2 font-love">
        <slot name="ContentTerms" />
      </div>
    </div>

   
  </div>

  
</template>
