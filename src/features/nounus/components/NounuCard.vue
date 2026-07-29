<template>
  <div
    class="bg-white rounded-3xl overflow-hidden shadow-sm border border-rose-100 hover:shadow-md hover:border-rose-200 transition-all duration-300 cursor-pointer group"
    @click="$emit('click', nounu)"
  >
    <!-- Image section -->
    <div class="relative h-52 bg-rose-50 overflow-hidden">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="nounu.fullname"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-rose-50">
        <span class="font-anton text-4xl text-rose-300">{{ initials }}</span>
      </div>

      <!-- Status badge -->
      <div class="absolute top-3 left-3">
        <span
          :class="[
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-love font-medium backdrop-blur-sm',
            statusClass
          ]"
        >
          <span :class="['h-1.5 w-1.5 rounded-full', statusDot]"></span>
          {{ statusLabel }}
        </span>
      </div>

      <!-- Certification badge -->
      <div v-if="nounu.certif === 'Accepted'" class="absolute bottom-3 left-3">
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-love font-medium text-green-600">
          <i class="ri ri-checkbox-circle-line" style="font-size: 12px;"></i>
          Certifiée
        </span>
      </div>

      <!-- New badge (early access) -->
      <div v-if="showNewBadge" class="absolute top-3 right-12">
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/90 backdrop-blur-sm text-xs font-love font-medium text-white">
          <i class="ri ri-sparkling-line" style="font-size: 12px;"></i>
          Nouvelle
        </span>
      </div>

      <!-- Like button -->
      <button
        @click.stop="$emit('favorite', nounu)"
        class="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors active:scale-90"
      >
        <i
          :class="['ri transition-colors', isFavorite ? 'ri-heart-fill text-rose-500' : 'ri-heart-line text-gray-400']"
          style="font-size: 16px;"
        ></i>
      </button>

      <!-- Like count -->
      <div v-if="(likeCount || 0) > 0" class="absolute bottom-3 right-3">
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-love font-medium text-gray-600">
          <i class="ri ri-heart-fill text-rose-400" style="font-size: 10px;"></i>
          {{ likeCount }}
        </span>
      </div>

    </div>

    <!-- Info section -->
    <div class="p-4 space-y-3">
      <!-- Name & rating -->
      <div class="flex items-start justify-between">
        <div>
          <h3 class="font-love text-base font-bold text-gray-900 leading-tight">{{ nounu.fullname }}</h3>
          <p class="font-love text-xs text-gray-400 mt-0.5">
            {{ nounu.age ? nounu.age + ' ans' : '' }}
            <span v-if="zoneDeTravail">· {{ zoneDeTravail }}</span>
          </p>
        </div>
        <div v-if="nounu.rating" class="flex items-center gap-1 flex-shrink-0">
          <i class="ri ri-star-fill text-yellow-400" style="font-size: 14px;"></i>
          <span class="font-love text-xs font-semibold text-gray-700">{{ nounu.rating }}</span>
        </div>
      </div>

      <!-- Bio -->
      <p v-if="nounu.courte_biographie" class="font-love text-xs text-gray-500 line-clamp-2 leading-relaxed">
        {{ nounu.courte_biographie }}
      </p>

      <!-- Info row: experience · languages · address · horaires -->
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-500">
        <div v-if="nounu.annees_experience" class="flex items-center gap-1">
          <i class="ri ri-briefcase-line text-rose-300" style="font-size: 13px;"></i>
          <span class="font-love text-xs">{{ nounu.annees_experience }} ans</span>
        </div>
        <div v-if="address" class="flex items-center gap-1">
          <i class="ri ri-map-pin-line text-rose-300" style="font-size: 13px;"></i>
          <span class="font-love text-xs">{{ address }}</span>
        </div>
        <div v-if="horaires" class="flex items-center gap-1">
          <i class="ri ri-time-line text-rose-300" style="font-size: 13px;"></i>
          <span class="font-love text-xs">{{ horaires }}</span>
        </div>
        <div v-if="languages.length" class="flex items-center gap-1">
          <i class="ri ri-global-line text-rose-300" style="font-size: 13px;"></i>
          <span class="font-love text-xs">{{ languages.slice(0, 2).join(', ') }}{{ languages.length > 2 ? '...' : '' }}</span>
        </div>
      </div>

      <!-- Tags: specialties + tranche d'age -->
      <div v-if="allTags.length" class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in allTags.slice(0, 4)"
          :key="tag"
          class="px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 font-love text-xs font-medium"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Price & action -->
      <div class="flex items-center justify-between pt-2 border-t border-rose-50">
        <div>
          <span class="font-love text-base font-bold text-rose-400">{{ formatPrice(nounu.tarif_horaire) }}</span>
          <span class="font-love text-xs text-gray-400">/heure</span>
          <span v-if="nounu.tarif_mensuel" class="font-love text-xs text-gray-400 ml-1">· {{ formatPrice(nounu.tarif_mensuel) }}/mois</span>
        </div>
        <button
          @click.stop="$emit('contact', nounu)"
          class="px-4 py-2 rounded-xl bg-rose-400 text-white font-love text-xs font-bold hover:bg-rose-500 active:scale-95 transition-all"
        >
          Contacter
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Nounu } from '@/features/nounus/types';
import { buildImageUrl, getAvatarUrl } from '@/utils/media.utils';

const props = defineProps<{
  nounu: Nounu;
  isFavorite?: boolean;
  likeCount?: number;
  showNewBadge?: boolean;
}>();

defineEmits<{
  click: [nounu: Nounu];
  favorite: [nounu: Nounu];
  contact: [nounu: Nounu];
}>();

const initials = computed(() => {
  if (!props.nounu.fullname) return '?';
  const names = props.nounu.fullname.split(' ');
  if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
  return names[0][0].toUpperCase();
});

const imageUrl = computed(() => {
  const image = props.nounu.image;
  if (image?.deletedAt) return '';
  const raw = props.nounu.avatar || image?.originalUrl || image?.path || '';
  return buildImageUrl(raw);
});

const statusLabel = computed(() => {
  switch (props.nounu.status) {
    case 'disponible': return 'Disponible';
    case 'busy': return 'Occupée';
    default: return 'Indisponible';
  }
});

const statusClass = computed(() => {
  switch (props.nounu.status) {
    case 'disponible': return 'bg-green-50/90 text-green-700';
    case 'busy': return 'bg-yellow-50/90 text-yellow-700';
    default: return 'bg-white/90 text-gray-500';
  }
});

const statusDot = computed(() => {
  switch (props.nounu.status) {
    case 'disponible': return 'bg-green-500';
    case 'busy': return 'bg-yellow-500';
    default: return 'bg-gray-400';
  }
});

const flatPrefs = computed(() => {
  const prefs = props.nounu.preferences;
  if (Array.isArray(prefs)) {
    return prefs;
  }
  return prefs ? [prefs] : [];
});

const getPrefItems = (key: string): any[] => {
  return flatPrefs.value.flatMap((p: any) => p[key] || []).filter(Boolean);
};

const zoneDeTravail = computed(() => {
  return getPrefItems('zone_de_travail')[0]?.name || '';
});

const address = computed(() => {
  return getPrefItems('adress')[0]?.name || '';
});

const horaires = computed(() => {
  return getPrefItems('horaire_disponible')[0]?.name || '';
});

const languages = computed(() => {
  const langs = getPrefItems('langue_parler');
  return [...new Set(langs.map((l: any) => l.name).filter(Boolean))];
});

const specialties = computed(() => {
  const specs = getPrefItems('type_services').concat(getPrefItems('competance_specifique'));
  return [...new Set(specs.map((s: any) => s.name).filter(Boolean))];
});

const trancheAge = computed(() => {
  return [...new Set(getPrefItems('tranche_age_enfants').map((a: any) => a.name).filter(Boolean))];
});

const allTags = computed(() => {
  return [...specialties.value, ...trancheAge.value];
});

const formatPrice = (price?: number | string) => {
  if (!price) return '0 FCFA';
  const num = typeof price === 'string' ? parseInt(price) : price;
  return new Intl.NumberFormat('fr-FR').format(num) + ' FCFA';
};
</script>
