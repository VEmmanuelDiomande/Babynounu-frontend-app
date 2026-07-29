<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="show" class="fixed inset-0 z-50 flex items-end justify-center">
        <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
        <div
          ref="drawerRef"
          class="relative w-full max-w-3xl bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto drawer-panel"
          :style="{ transform: dragTranslate > 0 ? `translateY(${dragTranslate}px)` : '', transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <!-- Handle -->
          <div class="sticky top-0 bg-white pt-3 pb-2 px-4 z-10 touch-none">
            <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="h-9 w-9 rounded-full bg-rose-100 flex items-center justify-center">
                  <i class="ri ri-hand-heart-line text-rose-400" style="font-size: 18px;"></i>
                </div>
                <div>
                  <h2 class="font-anton text-base text-gray-900">Nouvelle proposition</h2>
                  <p class="text-xs font-love text-gray-400">{{ subtitle }}</p>
                </div>
              </div>
              <button @click="$emit('close')" class="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <i class="ri ri-close-line text-gray-500" style="font-size: 20px;"></i>
              </button>
            </div>
          </div>

          <!-- Form -->
          <div class="px-4 pb-6 pt-3 space-y-4">
            <!-- Type de prestation -->
            <div>
              <label class="text-xs font-love font-medium text-gray-600 mb-1.5 block">Type de prestation</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="t in prestationsTypes"
                  :key="t.value"
                  @click="propositionType = t.value"
                  :class="[
                    'flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all',
                    propositionType === t.value
                      ? 'border-rose-300 bg-rose-50 text-rose-500'
                      : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                  ]"
                >
                  <i :class="`ri ${t.icon}`" style="font-size: 20px;"></i>
                  <span class="text-xs font-love font-medium">{{ t.label }}</span>
                </button>
              </div>
            </div>

            <!-- Titre -->
            <div>
              <label class="text-xs font-love font-medium text-gray-600 mb-1.5 block">Objet</label>
              <input
                v-model="propositionTitre"
                type="text"
                placeholder="Ex: Garde d'enfants à domicile"
                class="w-full text-sm font-love bg-gray-50 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="text-xs font-love font-medium text-gray-600 mb-1.5 block">Description</label>
              <textarea
                v-model="propositionDescription"
                rows="3"
                placeholder="Détaillez votre proposition..."
                class="w-full text-sm font-love bg-gray-50 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all resize-none"
              ></textarea>
            </div>

            <!-- Montant + Nombre de mois -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-love font-medium text-gray-600 mb-1.5 block">Montant (FCFA)</label>
                <div class="relative">
                  <i class="ri ri-wallet-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style="font-size: 16px;"></i>
                  <input
                    v-model="montantInput"
                    type="number"
                    step="1"
                    placeholder="0"
                    class="w-full text-sm font-love bg-gray-50 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>
              </div>
              <div>
                <label class="text-xs font-love font-medium text-gray-600 mb-1.5 block">Nombre de mois</label>
                <div class="relative">
                  <i class="ri ri-calendar-2-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style="font-size: 16px;"></i>
                  <input
                    v-model="nbMoisInput"
                    type="number"
                    min="1"
                    placeholder="Ex: 3"
                    class="w-full text-sm font-love bg-gray-50 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>
              </div>
            </div>

            <!-- Date de début -->
            <div>
              <label class="text-xs font-love font-medium text-gray-600 mb-1.5 block">Date de début de la prestation</label>
              <div class="relative">
                <i class="ri ri-calendar-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style="font-size: 16px;"></i>
                <input
                  v-model="propositionStartDate"
                  type="date"
                  class="w-full text-sm font-love bg-gray-50 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>
            </div>

            <!-- Expiration info -->
            <div class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-100">
              <i class="ri ri-timer-line text-amber-500" style="font-size: 16px;"></i>
              <span class="text-xs font-love text-amber-700">La proposition expirera automatiquement dans 1 heure.</span>
            </div>

            <!-- Submit -->
            <button
              @click="handleSubmit"
              :disabled="!propositionDescription.trim()"
              class="w-full py-3 rounded-2xl text-sm font-love font-semibold text-white bg-rose-400 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-sm"
            >
              <i class="ri ri-send-2-line mr-1" style="font-size: 16px;"></i>
              Envoyer la proposition
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { prestationsTypes, useChatUtils } from '@/composables/useChatUtils';

const props = defineProps<{
  show: boolean;
  subtitle?: string;
}>();

const emit = defineEmits<{
  close: [];
  send: [data: {
    content: string;
    montant?: number;
    periode?: string;
    expired?: string;
  }];
}>();

const { formatDate } = useChatUtils();

const propositionTitre = ref('');
const propositionDescription = ref('');
const propositionType = ref('garde');
const montantInput = ref('');
const nbMoisInput = ref('');
const propositionStartDate = ref('');

// ── Drag-to-close ──
const drawerRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const dragTranslate = ref(0);
let startY = 0;
let drawerHeight = 0;

const onTouchStart = (e: TouchEvent) => {
  const drawer = drawerRef.value;
  if (!drawer) return;
  // Only start drag if scrolled to top
  if (drawer.scrollTop > 0) return;
  startY = e.touches[0].clientY;
  drawerHeight = drawer.offsetHeight;
  isDragging.value = true;
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  const delta = e.touches[0].clientY - startY;
  if (delta > 0) {
    dragTranslate.value = delta;
  }
};

const onTouchEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  const threshold = drawerHeight * 0.4;
  if (dragTranslate.value > threshold) {
    dragTranslate.value = drawerHeight;
    nextTick(() => {
      emit('close');
      dragTranslate.value = 0;
    });
  } else {
    dragTranslate.value = 0;
  }
};

const handleSubmit = () => {
  const description = propositionDescription.value.trim();
  if (!description) return;
  const parts: string[] = [];
  if (propositionTitre.value.trim()) parts.push(`Objet: ${propositionTitre.value.trim()}`);
  const typeLabel = prestationsTypes.find(t => t.value === propositionType.value)?.label || propositionType.value;
  parts.push(`Type: ${typeLabel}`);
  parts.push(description);
  if (propositionStartDate.value) parts.push(`Début: ${formatDate(propositionStartDate.value)}`);
  if (nbMoisInput.value) parts.push(`Mois: ${nbMoisInput.value}`);
  const content = parts.join('\n');
  const montant = montantInput.value ? parseFloat(montantInput.value) : undefined;
  const periode = nbMoisInput.value ? `${nbMoisInput.value} mois` : undefined;
  const expired = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  emit('send', {
    content,
    montant,
    periode,
    expired,
  });
  // Reset form
  propositionTitre.value = '';
  propositionDescription.value = '';
  propositionStartDate.value = '';
  montantInput.value = '';
  nbMoisInput.value = '';
  propositionType.value = 'garde';
};

// Reset form when drawer is closed
watch(() => props.show, (newVal) => {
  if (!newVal) {
    propositionTitre.value = '';
    propositionDescription.value = '';
    propositionStartDate.value = '';
    montantInput.value = '';
    nbMoisInput.value = '';
    propositionType.value = 'garde';
  }
});
</script>

<style scoped>
.drawer-enter-active {
  transition: opacity 0.3s ease;
}
.drawer-leave-active {
  transition: opacity 0.25s ease 0.05s;
}
.drawer-enter-active .drawer-panel {
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-leave-active .drawer-panel {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateY(100%);
}
</style>
