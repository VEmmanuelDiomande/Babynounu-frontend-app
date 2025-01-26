<script setup lang="ts">
import IcIcons from "@/components/icons/IcIcons.vue";
import { IonImg } from "@ionic/vue";
defineProps(["heading", "subHeading", "btnName", "bgColor", "submitForm"]);
</script>

<template>
  <div
    class="min-h-screen z-40 flex flex-col font-love justify-center items-center bg-white p-4"
  >
    <div class="fixed inset-0">
      <IonImg
        src="https://img.freepik.com/premium-vector/gradient-holographic-texture-background_23-2151737372.jpg?ga=GA1.1.1435509380.1718711816"
        class="w-full h-full object-cover opacity-20"
        alt=""
      >
      </IonImg>
    </div>
    <!-- Close Button -->
    <button
      class="absolute top-4 left-4 text-gray-500 hover:text-gray-900"
      @click="$router.go(-1)"
    >
      <div class="flex items-center gap-8">
        <IcIcons name="RiCloseLine" :size="28" />
      </div>
    </button>

    <div class="flex flex-col gap-8">
      <!-- Title -->
      <IonImg
        src="/images/logos/bn_logo.png"
        class="size-24 object-cover"
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
