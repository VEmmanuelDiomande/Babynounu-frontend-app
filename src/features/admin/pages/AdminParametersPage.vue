<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div>
        <h2 class="font-anton text-xl text-gray-900">Paramètres</h2>
        <p class="text-sm text-gray-500 font-love mt-1">
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-primary"></span>
            {{ adminStore.parametersTotal }} paramètre(s) au total
          </span>
        </p>
      </div>
      <div class="flex items-center gap-2">
        <select v-model="typeFilter" @change="onFilterChange" class="text-sm font-love border border-primary/10 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all flex-1">
          <option :value="undefined">Tous les types</option>
          <option v-for="tp in adminStore.typeParameters" :key="tp.id" :value="tp.id">{{ tp.name }}</option>
        </select>
        <button @click="openCreateModal" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-love font-medium hover:bg-primary/90 active:scale-95 transition-all shadow-sm shadow-primary/20">
          <i class="ri ri-add-line" style="font-size: 16px;"></i>
          <span>Nouveau</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Cards -->
    <div v-else-if="adminStore.parameters.length > 0" class="space-y-3">
      <div
        v-for="p in adminStore.parameters"
        :key="p.id"
        class="bg-white rounded-2xl border border-primary/10 overflow-hidden hover:border-primary/30 transition-all shadow-sm"
      >
        <div class="p-4">
          <div class="flex items-start gap-3 mb-3">
            <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="ri ri-sliders-line text-primary" style="font-size: 18px;"></i>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ p.name }}</div>
              <div class="text-xs text-gray-500 font-love truncate">ID: {{ p.id }}</div>
            </div>
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-500 font-love mb-3">
            <span class="flex items-center gap-1">
              <i class="ri ri-hashtag" style="font-size: 14px;"></i>
              {{ p.slug || '—' }}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri ri-folder-line" style="font-size: 14px;"></i>
              {{ p.typeParameter?.name || 'N/A' }}
            </span>
            <span v-if="p.priority > 0" class="flex items-center gap-1 text-amber-600">
              <i class="ri ri-star-fill" style="font-size: 14px;"></i>
              {{ p.priority }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button @click="openEditModal(p)" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-primary border border-primary/10 hover:bg-primary/10 active:scale-95 transition-all">
              Modifier
            </button>
            <button @click="handleDelete(p.id)" class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all">
              <i class="ri ri-delete-bin-line" style="font-size: 14px;"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div class="flex items-center justify-center pt-2">
        <button @click="loadMore" :disabled="adminStore.parameters.length < limit" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-primary bg-white border border-primary/10 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <i class="ri ri-add-line" style="font-size: 16px;"></i>
          Voir plus
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-3xl">
      <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <i class="ri ri-sliders-line text-primary/50" style="font-size: 32px;"></i>
      </div>
      <p class="text-sm text-gray-900 font-love font-semibold">Aucun paramètre trouvé</p>
      <p class="text-xs text-gray-500 font-love mt-1">Créez votre premier paramètre</p>
    </div>

    <div v-if="adminStore.error" class="bg-red-50 border border-red-200 rounded-3xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 24px;"></i>
      <p class="text-sm text-red-600 font-love">{{ adminStore.error }}</p>
    </div>

    <!-- Drawer -->
    <Drawer :show="showModal" :title="editingId ? 'Modifier' : 'Nouveau' + ' paramètre'" maxHeight="85vh" @close="closeModal">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-love font-medium text-gray-700 mb-1.5">Nom</label>
          <input v-model="form.name" type="text" required class="w-full text-sm font-love border border-primary/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all" />
        </div>
        <div>
          <label class="block text-sm font-love font-medium text-gray-700 mb-1.5">Slug (optionnel)</label>
          <input v-model="form.slug" type="text" class="w-full text-sm font-love border border-primary/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all" />
        </div>
        <div>
          <label class="block text-sm font-love font-medium text-gray-700 mb-1.5">Description</label>
          <textarea v-model="form.description" rows="2" class="w-full text-sm font-love border border-primary/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all resize-none"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-love font-medium text-gray-700 mb-1.5">Priorité</label>
            <input v-model.number="form.priority" type="number" class="w-full text-sm font-love border border-primary/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all" />
          </div>
          <div>
            <label class="block text-sm font-love font-medium text-gray-700 mb-1.5">Type</label>
            <select v-model.number="form.typeParameterId" class="w-full text-sm font-love border border-primary/10 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all">
              <option :value="undefined">—</option>
              <option v-for="tp in adminStore.typeParameters" :key="tp.id" :value="tp.id">{{ tp.name }}</option>
            </select>
          </div>
        </div>
      </form>
      <template #footer>
        <div class="flex items-center gap-3">
          <button type="submit" @click="handleSubmit" :disabled="adminStore.isLoading" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-love font-medium hover:bg-primary/90 disabled:opacity-50 active:scale-95 transition-all">
            {{ adminStore.isLoading ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
          <button type="button" @click="closeModal" class="px-5 py-2.5 rounded-xl border border-primary/10 text-sm font-love font-medium text-gray-600 hover:bg-primary/5 transition-colors">Annuler</button>
        </div>
      </template>
    </Drawer>
  </div>

  <ConfirmModal
    :show="showConfirm"
    :title="confirmTitle"
    :message="confirmMessage"
    :icon="confirmIcon"
    :iconBgClass="confirmIconBg"
    :iconClass="confirmIconClass"
    :confirmLabel="confirmLabel"
    :confirmBgClass="confirmBgClass"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { ConfirmModal } from '@/components/ui';
import { useConfirmModal } from '@/composables/useConfirmModal';
import Drawer from '@/components/ui/Drawer/Drawer.vue';

const adminStore = useAdminStore();
const { showConfirm, confirmTitle, confirmMessage, confirmIcon, confirmIconBg, confirmIconClass, confirmLabel, confirmBgClass, requestConfirm, onConfirm, onCancel } = useConfirmModal();
const currentPage = ref(1);
const limit = 20;
const typeFilter = ref<number | undefined>(undefined);
const showModal = ref(false);
const editingId = ref<number | null>(null);

const form = reactive({ name: '', slug: '', description: '', priority: 0, typeParameterId: undefined as number | undefined });

const onFilterChange = () => { currentPage.value = 1; adminStore.fetchParameters(currentPage.value, limit, typeFilter.value); };
const openCreateModal = () => { editingId.value = null; Object.assign(form, { name: '', slug: '', description: '', priority: 0, typeParameterId: undefined }); showModal.value = true; };
const openEditModal = (p: any) => { editingId.value = p.id; Object.assign(form, { name: p.name, slug: p.slug || '', description: p.description || '', priority: p.priority || 0, typeParameterId: p.typeParameterId }); showModal.value = true; };
const closeModal = () => { showModal.value = false; editingId.value = null; };

const handleSubmit = async () => {
  try {
    if (editingId.value) { await adminStore.updateParameter(editingId.value, { ...form }); }
    else { await adminStore.createParameter({ ...form }); }
    closeModal();
  } catch { /* error in store */ }
};

const handleDelete = (id: number) => {
  requestConfirm('Voulez-vous vraiment supprimer ce paramètre ?', async () => {
    try { await adminStore.removeParameter(id); } catch { /* error in store */ }
  }, { icon: 'delete-bin-line', iconBgClass: 'bg-red-50', iconClass: 'text-red-500', confirmBgClass: 'bg-red-500 hover:bg-red-600 shadow-red-200' });
};

const loadMore = () => { currentPage.value++; adminStore.fetchParameters(currentPage.value, limit, typeFilter.value); };

onMounted(() => {
  adminStore.fetchTypeParameters(1, 100);
  adminStore.fetchParameters(currentPage.value, limit, typeFilter.value);
});
</script>
