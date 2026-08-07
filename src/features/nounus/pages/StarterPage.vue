<template>
  <div class="flex-1 flex flex-col relative">
    <!-- Carousel -->
    <div class="px-6 mb-2 flex-1 flex items-center justify-center">
      <div class="relative rounded-3xl overflow-hidden shadow-lg shadow-rose-100 max-w-md w-full">
        <div class="relative h-56 sm:h-64">
          <transition-group name="carousel" tag="div" class="absolute inset-0">
            <div
              v-for="(slide, index) in slides"
              :key="slide.id"
              v-show="currentSlide === index"
              class="absolute inset-0"
            >
              <img
                :src="slide.image"
                :alt="slide.title"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3 class="font-love text-lg font-bold text-white mb-0.5">{{ slide.title }}</h3>
                <p class="font-love text-xs text-white/80">{{ slide.subtitle }}</p>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- Dots -->
        <div class="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
          <button
            v-for="(slide, index) in slides"
            :key="slide.id"
            @click="goToSlide(index)"
            :class="[
              'h-2 rounded-full transition-all duration-300',
              currentSlide === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
            ]"
            :aria-label="`Slide ${index + 1}`"
          ></button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col px-6 py-4 pb-32">
      <div class="max-w-md mx-auto w-full">
        <!-- Header text -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-4">
            <i class="ri ri-user-3-line" style="font-size: 14px;"></i>
            <span class="font-love text-[10px] font-bold uppercase tracking-wider">Bienvenue</span>
          </div>
          <h1 class="font-love text-3xl font-bold text-gray-900 mb-3">
            BabyNounu <span class="text-rose-400">à vos côtés</span>
          </h1>
          <p class="font-love text-sm text-gray-500 px-2">
            La plateforme qui connecte parents et nounous de confiance.
          </p>
        </div>

        <!-- Footer -->
        <div class="text-center mt-6">
          <p class="font-love text-xs text-gray-400">
            Vous avez déjà un compte ?
            <router-link :to="{ name: 'AUTH_SIGN_IN' }" class="text-rose-400 font-semibold hover:text-rose-500 transition-colors">
              Se connecter
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Fixed bottom button -->
    <div class="fixed bottom-0 left-0 right-0 bg-rose-50 px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div class="max-w-md mx-auto w-full">
        <button
          type="button"
          @click="goToChooseDestination"
          class="w-full bg-rose-400 text-white font-love text-base font-bold rounded-2xl py-4 hover:bg-rose-500 transition-colors shadow-lg shadow-rose-100"
        >
          Commencer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const slides = [
  { id: 0, image: '/images/sliders/dlx_babysitter.png', title: 'Des nounous de confiance', subtitle: 'Vérifiées et qualifiées près de chez vous' },
  { id: 1, image: '/images/sliders/dlx_babysitter_2.png', title: 'Trouvez la perle rare', subtitle: 'Filtrez selon vos critères et besoins' },
  { id: 2, image: '/images/sliders/dlx_babysitter_3.svg', title: 'En toute sérénité', subtitle: 'Paiement sécurisé et profils contrôlés' },
];

const currentSlide = ref(0);
let carouselInterval: ReturnType<typeof setInterval> | null = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
  resetInterval();
};

const resetInterval = () => {
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = setInterval(nextSlide, 4000);
};

const goToChooseDestination = () => {
  router.push({ name: 'STARTER_DESTINATION' });
};

onMounted(() => {
  resetInterval();
});

onUnmounted(() => {
  if (carouselInterval) clearInterval(carouselInterval);
});
</script>

<style scoped>
.carousel-enter-active,
.carousel-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.carousel-enter-from {
  opacity: 0;
  transform: scale(1.05);
}
.carousel-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
