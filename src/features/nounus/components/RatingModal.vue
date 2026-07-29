<template>
  <Drawer :show="show" :title="title" max-height="80%" @close="close">
    <div class="space-y-5">
      <!-- Nounu info -->
      <div v-if="nounuName" class="flex items-center gap-3 p-3 rounded-2xl bg-rose-50">
        <div class="h-12 w-12 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img v-if="nounuAvatar" :src="nounuAvatar" alt="" class="h-full w-full object-cover" />
          <i v-else class="ri ri-user-heart-line text-rose-400" style="font-size: 24px;"></i>
        </div>
        <div>
          <p class="font-love text-xs text-gray-400">Vous notez</p>
          <p class="font-anton text-base text-gray-900">{{ nounuName }}</p>
        </div>
      </div>

      <!-- Star rating -->
      <div>
        <label class="block font-love text-xs font-medium text-gray-700 mb-3">Votre note</label>
        <div class="flex items-center gap-2 justify-center">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="rating = star"
            @mouseenter="hoverRating = star"
            @mouseleave="hoverRating = 0"
            class="transition-transform active:scale-90"
          >
            <i
              :class="[
                'ri',
                star <= (hoverRating || rating) ? 'ri-star-fill text-yellow-400' : 'ri-star-line text-gray-300'
              ]"
              style="font-size: 36px;"
            ></i>
          </button>
        </div>
        <p v-if="rating > 0" class="text-center font-love text-xs text-gray-500 mt-2">{{ ratingLabel }}</p>
      </div>

      <!-- Comment -->
      <div>
        <label class="block font-love text-xs font-medium text-gray-700 mb-2">Commentaire (optionnel)</label>
        <textarea
          v-model="comment"
          rows="4"
          placeholder="Partagez votre expérience..."
          class="w-full font-love text-sm bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 p-4 placeholder:text-gray-400 text-gray-700 resize-none"
        ></textarea>
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-50 border border-red-100 rounded-2xl p-3 flex items-center gap-2">
        <i class="ri ri-close-circle-line text-red-500" style="font-size: 18px;"></i>
        <p class="text-sm text-red-600 font-love">{{ error }}</p>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3">
        <button
          @click="close"
          class="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-love font-semibold text-sm hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
        <button
          @click="submit"
          :disabled="rating === 0 || submitting"
          class="flex-1 py-3 rounded-2xl bg-rose-400 text-white font-love font-semibold text-sm hover:bg-rose-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <i v-if="submitting" class="ri ri-loader-4-line animate-spin" style="font-size: 16px;"></i>
          {{ submitting ? 'Envoi...' : 'Publier' }}
        </button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Drawer } from '@/components/ui';

const props = defineProps<{
  show: boolean;
  nounuName?: string;
  nounuAvatar?: string;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: { rating: number; comment: string }): void;
}>();

const rating = ref(0);
const hoverRating = ref(0);
const comment = ref('');
const error = ref('');
const submitting = ref(false);

const ratingLabels: Record<number, string> = {
  1: 'Très déçu(e)',
  2: 'Déçu(e)',
  3: 'Correct',
  4: 'Satisfait(e)',
  5: 'Excellent !',
};

const ratingLabel = computed(() => ratingLabels[rating.value] || '');

const title = computed(() => props.title || 'Évaluer la nounu');

const close = () => {
  rating.value = 0;
  hoverRating.value = 0;
  comment.value = '';
  error.value = '';
  emit('close');
};

const submit = () => {
  if (rating.value === 0) {
    error.value = 'Veuillez sélectionner une note';
    return;
  }
  submitting.value = true;
  emit('submit', { rating: rating.value, comment: comment.value.trim() });
};

watch(() => props.show, (val) => {
  if (val) {
    rating.value = 0;
    hoverRating.value = 0;
    comment.value = '';
    error.value = '';
    submitting.value = false;
  }
});

defineExpose({ setSubmitting: (val: boolean) => { submitting.value = val; }, setError: (msg: string) => { error.value = msg; submitting.value = false; } });
</script>
