<template>
  <div class="ion-page">
    <header class="ion-no-border">
      <div class="bg-transparent">
        <div class="ion-buttons">
          <button @click="goBack" class="text-gray-900">
            <IcIcons name="arrow-left" :size="24" />
          </button>
        </div>
        <div class="ion-buttons">
          <button @click="toggleFavorite">
            <IcIcons
              :name="isFavorite ? 'star-fat' : 'heart'"
              :size="24"
              :color="isFavorite ? '#F77C3D' : '#6B7280'"
            />
          </button>
          <button>
            <IcIcons name="share-1" :size="24" color="#6B7280" />
          </button>
        </div>
      </div>
    </header>

    <div class="ion-content bg-gray-50">
      <div
        v-if="isLoading"
        class="h-[80vh] flex items-center justify-center"
      >
        <i class="ri ri-loader-4-line ri-spin text-4xl text-primary"></i>
      </div>

      <div v-else-if="nounu" class="pb-24">
        <div class="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            v-if="nounu.avatar"
            :src="nounu.avatar"
            :alt="nounu.fullname"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div class="absolute bottom-6 left-6 right-6">
            <div class="flex items-center gap-2 mb-2">
              <Badge variant="success" size="md">
                {{ availabilityLabel }}
              </Badge>
              <Badge v-if="isVerified" variant="info" size="md">
                <IcIcons name="check-circle-1" :size="14" color="currentColor" class="mr-1" />
                Vérifiée
              </Badge>
            </div>
            <h1 class="text-3xl font-anton text-white mb-1">
              {{ nounu.fullname }}
            </h1>
            <div class="flex items-center gap-4 text-white/90">
              <div class="flex items-center gap-1">
                <IcIcons name="map-marker-1" :size="16" />
                <span class="font-love text-sm">{{ nounu.city || 'Abidjan' }}</span>
              </div>
              <div class="flex items-center gap-1">
                <IcIcons name="star-fat" :size="16" color="#FFD700" />
                <span class="font-love text-sm font-semibold">{{ nounu.rating || '5.0' }}</span>
                <span class="font-love text-sm">({{ nounu.reviewCount || 0 }} avis)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-6 space-y-6">
          <Card variant="elevated" class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-love text-gray-600 mb-1">Tarif horaire</p>
                <p class="text-3xl font-anton text-primary">
                  {{ formatPrice(nounu.hourlyRate) }}
                  <span class="text-lg text-gray-600">/heure</span>
                </p>
              </div>
              <Button variant="primary" size="lg" rounded @click="contactNounu">
                Contacter
              </Button>
            </div>
          </Card>

          <div v-if="nounu.bio">
            <h2 class="text-xl font-anton text-gray-900 mb-3">À propos</h2>
            <Card variant="filled" class="p-4">
              <p class="font-love text-gray-700 leading-relaxed">
                {{ nounu.bio }}
              </p>
            </Card>
          </div>

          <div v-if="nounu.experience">
            <h2 class="text-xl font-anton text-gray-900 mb-3">Expérience</h2>
            <Card variant="filled" class="p-4">
              <div class="flex items-center gap-3">
                <div class="p-3 rounded-full bg-primary/10">
                  <IcIcons name="briefcase-1" :size="24" color="#F77C3D" />
                </div>
                <div>
                  <p class="font-love font-semibold text-gray-900">
                    {{ nounu.experience }} ans d'expérience
                  </p>
                  <p class="font-love text-sm text-gray-600">
                    Professionnelle certifiée
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div v-if="nounu.specialties && nounu.specialties.length > 0">
            <h2 class="text-xl font-anton text-gray-900 mb-3">Spécialités</h2>
            <Card variant="filled" class="p-4">
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="specialty in nounu.specialties"
                  :key="specialty"
                  variant="primary"
                  size="md"
                >
                  {{ specialty }}
                </Badge>
              </div>
            </Card>
          </div>

          <div v-if="nounu.languages && nounu.languages.length > 0">
            <h2 class="text-xl font-anton text-gray-900 mb-3">Langues parlées</h2>
            <Card variant="filled" class="p-4">
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="language in nounu.languages"
                  :key="language"
                  variant="secondary"
                  size="md"
                >
                  {{ language }}
                </Badge>
              </div>
            </Card>
          </div>

          <div v-if="nounu.certifications && nounu.certifications.length > 0">
            <h2 class="text-xl font-anton text-gray-900 mb-3">Certifications</h2>
            <Card variant="filled" class="p-4 space-y-3">
              <div
                v-for="cert in nounu.certifications"
                :key="cert"
                class="flex items-center gap-3"
              >
                <IcIcons name="check-circle-1" :size="20" color="#10B981" />
                <span class="font-love text-gray-700">{{ cert }}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div v-else class="h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <i class="ri ri-search-line text-6xl text-gray-300 mb-4"></i>
        <h2 class="text-2xl font-anton text-gray-900">Non trouvée</h2>
        <p class="font-love text-gray-500 mt-2">La nounou demandée n'existe pas.</p>
      </div>
    </div>

    <footer class="ion-no-border bg-white shadow-lg">
      <div class="px-6 py-4 flex gap-3">
        <Button
          variant="outline"
          size="lg"
          class="flex-1"
          @click="sendMessage"
        >
          <IcIcons name="comment-1" :size="20" color="#F77C3D" class="mr-2" />
          Message
        </Button>
        <Button
          variant="primary"
          size="lg"
          class="flex-1"
          @click="bookNounu"
        >
          <IcIcons name="calendar-days" :size="20" color="white" class="mr-2" />
          Réserver
        </Button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNounu } from '@/features/nounus/hooks/useNounus';
import type { Nounu } from '@/features/nounus/types';
import { Card, Badge, Button } from '@/components/ui';
import IcIcons from '@/components/icons/IcIcons.vue';

const router = useRouter();
const route = useRoute();

const nounuId = ref(route.params.id as string);
interface DisplayNounu extends Nounu {
  city: string;
  hourlyRate: number;
  experience: number;
  specialties: string[];
  languages: string[];
  certifications: string[];
  availability: 'available' | 'busy' | 'unavailable';
}

function getPrefNames(n: Nounu, keys: string[]): string[] {
  const prefs = n.preferences;
  if (!prefs) return [];
  const all = Array.isArray(prefs) ? prefs : [prefs];
  const names = keys.flatMap((key) => {
    return (all as any[])
      .flatMap((p: any) => p[key] || [])
      .map((item: any) => item.name)
      .filter(Boolean);
  });
  return [...new Set(names)];
}

const isFavorite = ref(false);
const isVerified = ref(true);

const { data: rawNounu, isLoading } = useNounu(nounuId);

const nounu = computed<DisplayNounu | undefined>(() => {
  if (!rawNounu.value) return undefined;
  const raw = rawNounu.value;
  return {
    ...raw,
    city: getPrefNames(raw, ['adress'])[0] || 'Abidjan',
    hourlyRate: Number(raw.tarif_horaire) || 0,
    experience: Number(raw.annees_experience) || 0,
    specialties: getPrefNames(raw, ['type_services', 'competance_specifique', 'competences_specifiques']),
    languages: getPrefNames(raw, ['langues_parlees', 'langue_parler']),
    certifications: getPrefNames(raw, ['certifications']),
    availability: raw.status === 'disponible' ? 'available' : raw.status === 'busy' ? 'busy' : 'unavailable',
  };
});

const availabilityLabel = computed(() => {
  switch (nounu.value?.availability) {
    case 'available':
      return 'Disponible';
    case 'busy':
      return 'Occupée';
    default:
      return 'Indisponible';
  }
});

const formatPrice = (price?: number) => {
  if (!price) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(price) + ' FCFA';
};

const goBack = () => {
  router.back();
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

const contactNounu = () => {
  console.log('Contact nounu');
};

const sendMessage = () => {
  router.push({ name: 'CHAT_MESSAGE_DETAIL', params: { id: nounuId.value } });
};

const bookNounu = () => {
  router.push({ name: 'BOOKING_CREATE', params: { nounuId: nounuId.value } });
};
</script>
