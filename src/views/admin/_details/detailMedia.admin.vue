<template>
  <ion-page>
    <ion-header class="shadow-none border-b-[1px]">
      <div class="flex justify-between h-12 items-center">
        <ion-buttons slot="start">
          <ion-button @click="$router.go(-1)">
            <IcIcons name="RiArrowLeftLine" :size="24" />
          </ion-button>
        </ion-buttons>
        <ion-title class="font-anton">Documents</ion-title>
        <ion-buttons slot="end"> </ion-buttons>
      </div>
    </ion-header>

    <ion-content class="">
      <!-- Swiper Container -->

      <div class="flex h-[85vh] items-center justify-center">
        <Swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="20"
          :pagination="{ clickable: true }"
          :loop="false"
          class="shadow-lg"
          @slide-change="onSlideChange"
        >
          <swiper-slide
            v-for="(image, index) in useMediaStore().state.mediaDocuments"
            :key="index"
          >
            <div class="relative h-64 md:h-96">
              <img
                :src="image.originalUrl"
                :alt="image.alt"
                class="w-full h-full object-cover"
              />
              <!-- <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 class="text-white font-bold text-lg">{{ image.title }}</h3>
                <p class="text-white/80 text-sm">{{ image.description }}</p>
              </div> -->
            </div>
          </swiper-slide>
        </Swiper>
      </div>

      <!-- Thumbnail Navigation -->
      <div class="grid grid-cols-4 gap-2 mt-4 hidden">
        <div
          v-for="(image, index) in useMediaStore().state.mediaDocuments"
          :key="'thumb-' + index"
          @click="swiper?.slideTo(index)"
          class="cursor-pointer h-20 overflow-hidden rounded-md transition-all hover:opacity-80"
          :class="{ 'ring-2 ring-primary-500': activeIndex === index }"
        >
          <img
            :src="image.originalUrl"
            :alt="'Thumbnail ' + image.alt"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  IonPage,
  IonHeader,
  IonButton,
  IonButtons,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { useMediaStore } from "@/stores/mediaStore";
import IcIcons from "@/components/icons/IcIcons.vue";

// Types
interface ImageItem {
  url: string;
  alt: string;
  title: string;
  description: string;
}

// Swiper modules
const modules = [Pagination, Autoplay];

// Images data
const images = ref<ImageItem[]>([
  {
    url: "https://images.unsplash.com/photo-1741986947217-d1a0ecc39149?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
    alt: "Nature",
    title: "Beautiful Nature",
    description: "Explore the wonders of nature",
  },
  {
    url: "https://images.unsplash.com/photo-1741986947217-d1a0ecc39149?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
    alt: "City",
    title: "Urban Landscape",
    description: "Discover vibrant city life",
  },
  {
    url: "https://images.unsplash.com/photo-1741986947217-d1a0ecc39149?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
    alt: "Mountain",
    title: "Mountain Views",
    description: "Breathtaking mountain scenery",
  },
  {
    url: "https://images.unsplash.com/photo-1741986947217-d1a0ecc39149?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
    alt: "Beach",
    title: "Tropical Beach",
    description: "Relax on pristine sandy beaches",
  },
]);

// Swiper instance and active index
const swiper = ref<SwiperType | null>(null);
const activeIndex = ref(0);

const onSwiper = (instance: SwiperType) => {
  swiper.value = instance;
};

const onSlideChange = () => {
  if (swiper.value) {
    activeIndex.value = swiper.value.realIndex;
  }
};
</script>

<style>
/* Custom swiper pagination color */
.swiper-pagination-bullet-active {
  background-color: #3880ff !important; /* Ionic primary color */
}

/* Ionic variables for Tailwind */
/* @layer utilities {
    .bg-primary-500 {
      --tw-bg-opacity: 1;
      background-color: rgba(var(--ion-color-primary-rgb), var(--tw-bg-opacity));
    }
    .ring-primary-500 {
      --tw-ring-color: rgba(var(--ion-color-primary-rgb), var(--tw-ring-opacity));
    }
  } */
</style>
