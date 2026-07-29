<template>
  <div
    class="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-rose-50/50 hover:border-rose-100 group"
    @click="$emit('click', job.id)"
  >
    <div class="flex items-start gap-4">
      <!-- Family avatar -->
      <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-50 to-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-rose-50 group-hover:ring-rose-100 transition-all">
        <img v-if="avatarUrl" :src="avatarUrl" alt="" class="h-full w-full object-cover" />
        <span v-else class="font-anton text-lg text-primary/40">{{ initial }}</span>
      </div>

      <!-- Job info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3 class="font-anton text-base text-gray-900 leading-tight group-hover:text-rose-500 transition-colors">{{ job.titre }}</h3>
            <p class="font-love text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <i class="ri ri-user-line" style="font-size: 11px;"></i>
              {{ familyName }}
            </p>
          </div>
          <div class="flex flex-col items-end gap-1 flex-shrink-0">
            <span
              :class="[
                'px-2.5 py-1 rounded-full font-love text-xs font-medium flex items-center gap-1',
                job.missionUrgente ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
              ]"
            >
              <i class="ri" :class="job.missionUrgente ? 'ri-flashlight-line' : 'ri-checkbox-circle-line'" style="font-size: 11px;"></i>
              {{ job.missionUrgente ? 'Urgent' : 'Disponible' }}
            </span>
            <span v-if="job.isPriorityRequest" class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-love text-[10px] font-semibold flex items-center gap-1">
              <i class="ri ri-vip-crown-2-line" style="font-size: 10px;"></i>
              Prioritaire
            </span>
          </div>
        </div>

        <p class="font-love text-sm text-gray-600 line-clamp-2 mb-3">{{ job.description }}</p>

        <!-- Tags -->
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span v-if="job.periode" class="px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 font-love text-xs flex items-center gap-1">
            <i class="ri ri-time-line" style="font-size: 10px;"></i> {{ job.periode }}
          </span>
          <span v-if="job.nombreEnfants" class="px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 font-love text-xs flex items-center gap-1">
            <i class="ri ri-group-line" style="font-size: 10px;"></i> {{ job.nombreEnfants }} enfant(s)
          </span>
          <span v-if="job.inclusWeekend" class="px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 font-love text-xs flex items-center gap-1">
            <i class="ri ri-calendar-2-line" style="font-size: 10px;"></i> Week-end inclus
          </span>
          <span v-if="job.negociable" class="px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 font-love text-xs flex items-center gap-1">
            <i class="ri ri-hand-heart-line" style="font-size: 10px;"></i> Négociable
          </span>
          <span v-if="job.experienceMinimun" class="px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 font-love text-xs flex items-center gap-1">
            <i class="ri ri-graduation-cap-line" style="font-size: 10px;"></i> Exp. requise
          </span>
          <span v-if="job.combinaisonService" class="px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 font-love text-xs flex items-center gap-1">
            <i class="ri ri-layers-line" style="font-size: 10px;"></i> Combinaison
          </span>
        </div>

        <!-- Bottom row -->
        <div class="flex items-center justify-between pt-3 border-t border-rose-50">
          <div class="flex items-center gap-1">
            <i class="ri ri-calendar-2-line text-gray-400" style="font-size: 14px;"></i>
            <span class="font-love text-xs text-gray-500">{{ job.dateDebut || 'Date à définir' }}</span>
          </div>
          <div v-if="job.tarifPropose" class="flex items-center gap-1">
            <span class="font-anton text-base text-primary">{{ formatPrice(job.tarifPropose) }}</span>
            <span class="font-love text-xs text-gray-400">FCFA</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getAvatarUrl } from '@/utils/media.utils';

const props = defineProps<{
  job: any;
}>();

defineEmits<{
  click: [id: any];
}>();

const familyName = computed(() => {
  const user = props.job?.user;
  if (!user) return 'Famille';
  const parent = user?.parents?.[0];
  const nounu = user?.nounus?.[0];
  return parent?.fullname || nounu?.fullname || 'Famille';
});

const avatarUrl = computed(() => {
  const medias = props.job?.user?.medias;
  return getAvatarUrl(medias) || null;
});

const initial = computed(() => {
  return familyName.value?.[0]?.toUpperCase() || 'F';
});

const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseInt(price) : price;
  if (isNaN(num)) return price;
  return new Intl.NumberFormat('fr-FR').format(num);
};
</script>
