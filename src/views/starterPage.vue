<template>
  <IonPage>

    <IonContent>  
      <div
    class="w-full h-screen bg-gray-100 flex flex-col items-center justify-center"
  >
    <!-- Swiper Component -->
    <swiper
      :modules="[Pagination]"
      :pagination="{ clickable: true, el: '.custom-pagination' }"
      class="w-full h-screen flex flex-col justify-between max-w-md"
      loop
    >
      <!-- Slide 1 -->
      <swiper-slide>
        <CardSlider
          heading="Babysitters professionnels"
          subHeading="Touves des Babysitters professionnels près de chez vous."
          img="/images/sliders/dlx_babysitter.png"
        />
      </swiper-slide>

      <!-- Slide 2 -->
      <swiper-slide>
        <CardSlider
          heading="Proposition d'offre et discutions"
          subHeading="Faite des proposition d'offre et discutez avec les nounus"
          img="/images/sliders/dlx_babysitter_2.png"
        />
      </swiper-slide>

      <!-- Slide 3 -->
      <swiper-slide>
        <CardSlider
          heading="Profils ideals"
          subHeading="Des profils adapter au besoin de vos enfants"
          img="/images/sliders/dlx_babysitter_3.svg"
        />
      </swiper-slide>
    </swiper>

    <!-- Custom Pagination -->
    <div class="custom-pagination flex justify-center gap-2 pt-10 pb-4"></div>

    <RouterLink :to="{ name: 'STARTER_DESTINATION' }" class="mt-4 mb-4 font-love text-xl w-11/12 text-center rounded-2xl bg-secondary text-white py-3 px-4 font-bold">
      Commencer
    </RouterLink>
  </div>
    </IonContent>

  </IonPage>
  
</template>

<script setup lang="ts">
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import CardSlider from "@/components/cards/sliders/CardSlider.vue";
import { IonContent, IonFooter, IonPage } from "@ionic/vue";
</script>

<style>
/* Personnalisation des bulles */
.custom-pagination .swiper-pagination-bullet {
  width: 24px;
  height: 8px;
  background-color: gray;
  border: 2px solid white;
  border-radius: 12px;
  transition: transform 0.8s, background-color 0.8s;
}
.custom-pagination .swiper-pagination-bullet-active {
  background-color: #55c4bd; /* Couleur active */
  width: 34px !important; /* Largeur élargie */
  border-radius: 12px; /* Ajustement pour une forme plus elliptique */
  transform: scale(1.2); /* Effet de zoom */
}
.custom-pagination .swiper-pagination-bullet .swiper-pagination-bullet-active {
  width: 34px !important; /* Largeur élargie */
  transition: width 0.3s ease-in-out, background-color 0.3s, transform 0.3s;
}
</style>
