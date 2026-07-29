<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div>
        <h2 class="font-anton text-xl text-gray-900">Packs d'abonnement</h2>
        <p class="text-sm text-gray-500 font-love mt-1">
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-primary"></span>
            {{ adminStore.packsTotal }} pack(s) au total
          </span>
        </p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-love font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
      >
        <i class="ri ri-add-line" style="font-size: 18px;"></i>
        Ajouter un pack
      </button>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Cards -->
    <div v-else-if="adminStore.packs.length > 0" class="space-y-3">
      <div
        v-for="pack in adminStore.packs"
        :key="pack.id"
        class="bg-white rounded-2xl border border-primary/10 overflow-hidden hover:border-primary/30 transition-all shadow-sm"
      >
        <div class="p-4">
          <div class="flex items-start gap-3 mb-3">
            <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="ri ri-vip-crown-line text-primary" style="font-size: 18px;"></i>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ pack.name }}</div>
              <div class="text-xs text-gray-500 font-love truncate">{{ pack.description }}</div>
            </div>
            <span
              :class="[
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-love font-semibold',
                pack.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              ]"
            >
              <span :class="['h-1.5 w-1.5 rounded-full', pack.isActive ? 'bg-green-500' : 'bg-gray-400']"></span>
              {{ pack.isActive ? 'Actif' : 'Inactif' }}
            </span>
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-500 font-love mb-3">
            <span class="flex items-center gap-1">
              <i class="ri ri-coins-line" style="font-size: 14px;"></i>
              {{ formatPrice(pack.price) }} {{ pack.currency || 'FCFA' }}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri ri-calendar-line" style="font-size: 14px;"></i>
              <template v-if="pack.durationDays === 0 || !pack.durationDays">À vie</template>
              <template v-else>{{ pack.durationDays }} jours</template>
            </span>
            <span v-if="pack.priority > 0" class="flex items-center gap-1 text-amber-600">
              <i class="ri ri-star-fill" style="font-size: 14px;"></i>
              {{ pack.priority }}
            </span>
          </div>
          <div v-if="pack.features && Array.isArray(pack.features) && pack.features.length > 0" class="flex flex-wrap gap-1.5 mb-3">
            <span
              v-for="(feature, idx) in pack.features"
              :key="idx"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-love font-semibold"
            >
              <i class="ri ri-check-line" style="font-size: 10px;"></i>
              {{ featureLabels[feature] || feature }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="openEditModal(pack)"
              class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-primary border border-primary/10 hover:bg-primary/10 active:scale-95 transition-all"
            >
              <i class="ri ri-edit-line" style="font-size: 14px;"></i>
              Modifier
            </button>
            <button
              @click="confirmDelete(pack)"
              class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all"
            >
              <i class="ri ri-delete-bin-line" style="font-size: 14px;"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-primary/10">
      <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <i class="ri ri-vip-crown-line text-primary/40" style="font-size: 32px;"></i>
      </div>
      <p class="text-sm text-gray-500 font-love text-center mb-4">Aucun pack créé pour le moment.</p>
      <button
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-love font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
      >
        <i class="ri ri-add-line" style="font-size: 18px;"></i>
        Créer le premier pack
      </button>
    </div>

    <!-- Drawer -->
    <Drawer :show="showModal" :title="editingPack ? 'Modifier le pack' : 'Nouveau pack'" maxHeight="90vh" @close="closeModal">
      <div class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-xs font-love font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Nom *</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="ex: Pack Découverte"
            class="w-full text-sm font-love border border-primary/10 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
          />
        </div>

        <!-- Slug -->
        <div>
          <label class="block text-xs font-love font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Slug</label>
          <input
            v-model="formData.slug"
            type="text"
            placeholder="ex: pack-decouverte"
            class="w-full text-sm font-love border border-primary/10 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs font-love font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Description</label>
          <textarea
            v-model="formData.description"
            rows="2"
            placeholder="Description du pack"
            class="w-full text-sm font-love border border-primary/10 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all resize-none"
          ></textarea>
        </div>

        <!-- Price & Currency -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-love font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Prix *</label>
            <input
              v-model.number="formData.price"
              type="number"
              placeholder="2000"
              class="w-full text-sm font-love border border-primary/10 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
            />
          </div>
          <div>
            <label class="block text-xs font-love font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Devise</label>
            <input
              v-model="formData.currency"
              type="text"
              placeholder="FCFA"
              class="w-full text-sm font-love border border-primary/10 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        <!-- Duration & Priority -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-love font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Durée (jours, 0 = à vie)</label>
            <input
              v-model.number="formData.durationDays"
              type="number"
              placeholder="0"
              class="w-full text-sm font-love border border-primary/10 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
            />
          </div>
          <div>
            <label class="block text-xs font-love font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Priorité</label>
            <input
              v-model.number="formData.priority"
              type="number"
              placeholder="0"
              class="w-full text-sm font-love border border-primary/10 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        <!-- Features -->
        <div>
          <label class="block text-xs font-love font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Options du pack</label>
          <div class="space-y-2">
            <label
              v-for="key in allFeatureKeys"
              :key="key"
              class="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                :value="key"
                v-model="selectedFeatures"
                class="h-4 w-4 rounded border-primary/20 text-primary focus:ring-primary/30"
              />
              <span class="text-sm font-love text-gray-700">{{ featureLabels[key] }}</span>
            </label>
          </div>
        </div>

        <!-- Active -->
        <div class="flex items-center gap-2">
          <button
            @click="formData.isActive = !formData.isActive"
            :class="[
              'relative h-6 w-11 rounded-full transition-colors',
              formData.isActive ? 'bg-primary' : 'bg-gray-300'
            ]"
          >
            <span
              :class="[
                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                formData.isActive ? 'translate-x-5' : 'translate-x-0.5'
              ]"
            ></span>
          </button>
          <span class="text-sm font-love text-gray-700">Pack actif</span>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <button
            @click="closeModal"
            class="px-4 py-2.5 rounded-xl text-sm font-love font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="savePack"
            :disabled="saving"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-love font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-sm disabled:opacity-60"
          >
            <div v-if="saving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <i v-else class="ri ri-save-line" style="font-size: 18px;"></i>
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </template>
    </Drawer>

    <!-- Delete confirmation -->
    <div
      v-if="packToDelete"
      @click.self="packToDelete = null"
      class="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
        <div class="flex flex-col items-center text-center">
          <div class="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <i class="ri ri-delete-bin-line text-red-500" style="font-size: 28px;"></i>
          </div>
          <h3 class="font-anton text-lg text-gray-900 mb-2">Supprimer le pack ?</h3>
          <p class="text-sm text-gray-500 font-love mb-6">
            Êtes-vous sûr de vouloir supprimer « {{ packToDelete.name }} » ? Cette action est irréversible.
          </p>
          <div class="flex items-center gap-3 w-full">
            <button
              @click="packToDelete = null"
              class="flex-1 px-4 py-2.5 rounded-xl text-sm font-love font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="deletePack"
              :disabled="saving"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-love font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all shadow-sm disabled:opacity-60"
            >
              <div v-if="saving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span v-else>Supprimer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { usePullToRefresh } from '@/composables/usePullToRefresh';
import Drawer from '@/components/ui/Drawer/Drawer.vue';
import { FEATURE_LABELS, ALL_FEATURE_KEYS } from '@/composables/useFeatureGate';

const adminStore = useAdminStore();

const featureLabels = FEATURE_LABELS;
const allFeatureKeys = ALL_FEATURE_KEYS;

const showModal = ref(false);
const editingPack = ref<any>(null);
const saving = ref(false);
const packToDelete = ref<any>(null);
const selectedFeatures = ref<string[]>([]);

const defaultForm = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  currency: 'FCFA',
  durationDays: 30,
  priority: 0,
  isActive: true,
};

const formData = ref({ ...defaultForm });

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price);
};

const openCreateModal = () => {
  editingPack.value = null;
  formData.value = { ...defaultForm, durationDays: 0 };
  selectedFeatures.value = [];
  showModal.value = true;
};

const openEditModal = (pack: any) => {
  editingPack.value = pack;
  formData.value = {
    name: pack.name || '',
    slug: pack.slug || '',
    description: pack.description || '',
    price: pack.price || 0,
    currency: pack.currency || 'FCFA',
    durationDays: pack.durationDays || 30,
    priority: pack.priority || 0,
    isActive: pack.isActive ?? true,
  };
  selectedFeatures.value = pack.features && Array.isArray(pack.features)
    ? [...pack.features]
    : [];
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingPack.value = null;
};

const savePack = async () => {
  try {
    saving.value = true;
    const data = {
      ...formData.value,
      features: selectedFeatures.value.length > 0 ? selectedFeatures.value : undefined,
    };

    if (editingPack.value) {
      await adminStore.updatePack(editingPack.value.id, data);
    } else {
      await adminStore.createPack(data);
    }

    closeModal();
    await adminStore.fetchPacks();
  } catch (e: any) {
    console.error(e);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (pack: any) => {
  packToDelete.value = pack;
};

const deletePack = async () => {
  if (!packToDelete.value) return;
  try {
    saving.value = true;
    await adminStore.removePack(packToDelete.value.id);
    packToDelete.value = null;
    await adminStore.fetchPacks();
  } catch (e: any) {
    console.error(e);
  } finally {
    saving.value = false;
  }
};

usePullToRefresh(() => adminStore.fetchPacks());

onMounted(() => {
  adminStore.fetchPacks();
});
</script>
