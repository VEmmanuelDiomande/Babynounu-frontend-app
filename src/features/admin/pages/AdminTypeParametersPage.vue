<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div>
        <h2 class="font-anton text-xl text-gray-900">Types de paramètres</h2>
        <p class="text-sm text-gray-500 font-love mt-1">
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-secondary"></span>
            {{ adminStore.typeParametersTotal }} type(s) au total
          </span>
        </p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-white text-sm font-love font-medium hover:bg-secondary/80 active:scale-95 transition-all shadow-sm shadow-secondary/20"
      >
        <i class="ri ri-add-line" style="font-size: 16px;"></i>
        <span>Nouveau type</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-secondary border-t-transparent"></div>
    </div>

    <!-- Cards -->
    <div v-else-if="adminStore.typeParameters.length > 0" class="space-y-3">
      <div
        v-for="tp in adminStore.typeParameters"
        :key="tp.id"
        class="bg-white rounded-2xl border border-primary/10 overflow-hidden hover:border-secondary/30 transition-all shadow-sm"
      >
        <div class="p-4">
          <div class="flex items-start gap-3 mb-3">
            <div class="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <i class="ri ri-paragraph text-secondary" style="font-size: 18px;"></i>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ tp.name }}</div>
              <div class="text-xs text-gray-500 font-love truncate">ID: {{ tp.id }}</div>
            </div>
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-500 font-love mb-3">
            <span class="flex items-center gap-1">
              <i class="ri ri-hashtag" style="font-size: 14px;"></i>
              {{ tp.slug || '—' }}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri ri-list-check" style="font-size: 14px;"></i>
              {{ tp.parameters?.length || 0 }} paramètre(s)
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button @click="openEditModal(tp)" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-secondary border border-secondary/10 hover:bg-secondary/10 active:scale-95 transition-all">
              Modifier
            </button>
            <button @click="handleDelete(tp.id)" class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all">
              <i class="ri ri-delete-bin-line" style="font-size: 14px;"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div class="flex items-center justify-center pt-2">
        <button @click="loadMore" :disabled="adminStore.typeParameters.length < limit" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-secondary bg-white border border-primary/10 hover:bg-secondary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <i class="ri ri-add-line" style="font-size: 16px;"></i>
          Voir plus
        </button>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-3xl">
      <div class="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
        <i class="ri ri-paragraph text-secondary/50" style="font-size: 32px;"></i>
      </div>
      <p class="text-sm text-gray-900 font-love font-semibold">Aucun type de paramètre trouvé</p>
      <p class="text-xs text-gray-500 font-love mt-1">Créez votre premier type de paramètre</p>
    </div>

    <!-- Error -->
    <div v-if="adminStore.error" class="bg-red-50 border border-red-200 rounded-3xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 24px;"></i>
      <p class="text-sm text-red-600 font-love">{{ adminStore.error }}</p>
    </div>

    <!-- Drawer -->
    <Drawer :show="showModal" :title="editingId ? 'Modifier' : 'Nouveau' + ' type de paramètre'" maxHeight="80vh" @close="closeModal">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-love font-medium text-gray-700 mb-1.5">Nom</label>
          <input v-model="form.name" type="text" required placeholder="Ex: role, abonnement..." class="w-full text-sm font-love border border-primary/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all" />
        </div>
        <div>
          <label class="block text-sm font-love font-medium text-gray-700 mb-1.5">Slug (optionnel)</label>
          <input v-model="form.slug" type="text" placeholder="Ex: role" class="w-full text-sm font-love border border-primary/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all" />
        </div>
      </form>
      <template #footer>
        <div class="flex items-center gap-3">
          <button type="submit" @click="handleSubmit" :disabled="adminStore.isLoading" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-white text-sm font-love font-medium hover:bg-secondary/80 disabled:opacity-50 active:scale-95 transition-all">
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
const showModal = ref(false);
const editingId = ref<number | null>(null);

const form = reactive({ name: '', slug: '' });

const openCreateModal = () => {
  editingId.value = null;
  form.name = '';
  form.slug = '';
  showModal.value = true;
};

const openEditModal = (tp: any) => {
  editingId.value = tp.id;
  form.name = tp.name;
  form.slug = tp.slug || '';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingId.value = null;
};

const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await adminStore.updateTypeParameter(editingId.value, { ...form });
    } else {
      await adminStore.createTypeParameter({ ...form });
    }
    closeModal();
  } catch { /* error in store */ }
};

const handleDelete = (id: number) => {
  requestConfirm('Voulez-vous vraiment supprimer ce type de paramètre ?', async () => {
    try { await adminStore.removeTypeParameter(id); } catch { /* error in store */ }
  }, { icon: 'delete-bin-line', iconBgClass: 'bg-red-50', iconClass: 'text-red-500', confirmBgClass: 'bg-red-500 hover:bg-red-600 shadow-red-200' });
};

const loadMore = () => { currentPage.value++; adminStore.fetchTypeParameters(currentPage.value, limit); };

onMounted(() => { adminStore.fetchTypeParameters(currentPage.value, limit); });
</script>
