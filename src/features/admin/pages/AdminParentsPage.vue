<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="font-anton text-xl text-gray-900">Parents</h2>
      <p class="text-sm text-gray-500 font-love mt-1">
        <span class="inline-flex items-center gap-1.5">
          <span class="h-2 w-2 rounded-full bg-indigo-500"></span>
          {{ adminStore.parentsTotal }} parent(s) au total
        </span>
      </p>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
    </div>

    <!-- Cards -->
    <div v-else-if="adminStore.parents.length > 0" class="space-y-3">
      <div
        v-for="parent in adminStore.parents"
        :key="parent.id"
        class="bg-white rounded-2xl border border-primary/10 overflow-hidden hover:border-indigo-300 transition-all shadow-sm"
      >
        <div class="p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 border border-transparent">
              <span class="font-anton text-base text-indigo-600">{{ getInitials(parent) }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ parent.fullname || parent.email }}</div>
              <div class="text-xs text-gray-500 font-love truncate">{{ parent.user?.email || parent.email }}</div>
            </div>
            <span v-if="parent.restricted" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-orange-50 text-orange-700">
              <span class="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
              Restreint
            </span>
            <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-green-50 text-green-700">
              <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Actif
            </span>
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-500 font-love mb-3">
            <span class="flex items-center gap-1">
              <i class="ri ri-phone-line" style="font-size: 14px;"></i>
              {{ parent.phone || '—' }}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri ri-user-heart-line" style="font-size: 14px;"></i>
              {{ parent.numberOfChildren || '—' }} enfant(s)
            </span>
            <span class="flex items-center gap-1">
              <i class="ri ri-wallet-line" style="font-size: 14px;"></i>
              {{ parent.budgetEstimated || '—' }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button @click="handleToggleRestrict(parent)" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all">
              {{ parent.restricted ? 'Lever' : 'Restreindre' }}
            </button>
            <button @click="openDetail(parent)" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 active:scale-95 transition-all">
              <i class="ri ri-eye-line" style="font-size: 14px;"></i>
              Détails
            </button>
            <button @click="handleDelete(parent.id)" class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all">
              <i class="ri ri-delete-bin-line" style="font-size: 14px;"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div class="flex items-center justify-center pt-2">
        <button @click="loadMore" :disabled="adminStore.parents.length < limit" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-indigo-600 bg-white border border-primary/10 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <i class="ri ri-add-line" style="font-size: 16px;"></i>
          Voir plus
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-3xl">
      <div class="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
        <i class="ri ri-heart-line text-indigo-400" style="font-size: 32px;"></i>
      </div>
      <p class="text-sm text-gray-900 font-love font-semibold">Aucun parent trouvé</p>
      <p class="text-xs text-gray-500 font-love mt-1">Les parents inscrits apparaîtront ici</p>
    </div>

    <div v-if="adminStore.error" class="bg-red-50 border border-red-200 rounded-3xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 24px;"></i>
      <p class="text-sm text-red-600 font-love">{{ adminStore.error }}</p>
    </div>

    <!-- Detail Drawer -->
    <Drawer :show="showDetail" title="Détail du parent" maxHeight="85vh" @close="closeDetail">
      <div v-if="selectedParent" class="space-y-5">
        <div class="flex items-center gap-3">
          <div class="h-14 w-14 rounded-full bg-indigo-100 overflow-hidden flex items-center justify-center flex-shrink-0 border border-transparent">
            <img v-if="avatarUrl" :src="avatarUrl" class="h-full w-full object-cover" alt="" />
            <span v-else class="font-anton text-base text-indigo-600">{{ getInitials(selectedParent) }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ selectedParent.fullname || selectedParent.email }}</div>
            <div class="text-xs text-gray-500 font-love truncate">{{ selectedParent.user?.email || selectedParent.email }}</div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <span v-if="selectedParent.restricted" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-orange-50 text-orange-700">
            <span class="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
            Restreint
          </span>
          <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-green-50 text-green-700">
            <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            Actif
          </span>
        </div>

        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm text-gray-700 font-love">
            <i class="ri ri-phone-line text-indigo-500" style="font-size: 16px;"></i>
            <span>{{ selectedParent.phone || '—' }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-700 font-love">
            <i class="ri ri-mail-line text-indigo-500" style="font-size: 16px;"></i>
            <span>{{ selectedParent.user?.email || selectedParent.email || '—' }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-700 font-love">
            <i class="ri ri-calendar-line text-indigo-500" style="font-size: 16px;"></i>
            <span>Inscrit le {{ formatDate(selectedParent.createdAt) }}</span>
          </div>
          <div v-if="selectedParent.updatedAt && selectedParent.updatedAt !== selectedParent.createdAt" class="flex items-center gap-2 text-sm text-gray-700 font-love">
            <i class="ri ri-refresh-line text-indigo-500" style="font-size: 16px;"></i>
            <span>Mis à jour le {{ formatDate(selectedParent.updatedAt) }}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="bg-gray-50 rounded-xl p-3">
            <div class="flex items-center gap-1.5 mb-1">
              <i class="ri ri-user-heart-line text-indigo-500" style="font-size: 16px;"></i>
              <span class="text-xs font-love font-medium text-gray-500">Enfants</span>
            </div>
            <p class="text-sm font-anton text-gray-900">{{ selectedParent.numberOfChildren || '—' }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-3">
            <div class="flex items-center gap-1.5 mb-1">
              <i class="ri ri-wallet-line text-indigo-500" style="font-size: 16px;"></i>
              <span class="text-xs font-love font-medium text-gray-500">Budget</span>
            </div>
            <p class="text-sm font-anton text-gray-900">{{ selectedParent.budgetEstimated || '—' }}</p>
          </div>
        </div>

        <div v-if="selectedParent.informationsComplementaires" class="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100">
          <div class="flex items-center gap-2 mb-2">
            <i class="ri ri-quote-text text-indigo-500" style="font-size: 18px;"></i>
            <h4 class="font-love text-sm font-semibold text-gray-900">Informations complémentaires</h4>
          </div>
          <p class="text-sm font-love text-gray-600 leading-relaxed">{{ selectedParent.informationsComplementaires }}</p>
        </div>

        <div class="space-y-4">
          <div v-for="group in preferenceGroups" :key="group.key">
            <div v-if="getPrefNames(group.key).length > 0">
              <h4 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <i class="ri" :class="`ri-${group.icon}`" style="font-size: 14px;"></i>
                {{ group.label }}
              </h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="item in getPrefNames(group.key)" :key="item" class="px-2.5 py-1 rounded-full text-xs font-love font-medium flex items-center gap-1.5" :class="[group.bg, group.text]">
                  <i class="ri ri-check-line" style="font-size: 10px;"></i>
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { ConfirmModal } from '@/components/ui';
import { useConfirmModal } from '@/composables/useConfirmModal';
import { usePullToRefresh } from '@/composables/usePullToRefresh';
import Drawer from '@/components/ui/Drawer/Drawer.vue';
import { getAvatarUrl } from '@/utils/media.utils';

const adminStore = useAdminStore();
const { showConfirm, confirmTitle, confirmMessage, confirmIcon, confirmIconBg, confirmIconClass, confirmLabel, confirmBgClass, requestConfirm, onConfirm, onCancel } = useConfirmModal();
const currentPage = ref(1);
const limit = 20;
const showDetail = ref(false);
const selectedParent = ref<any>(null);

const getInitials = (parent: any) => {
  const name = parent.fullname || parent.email || '';
  return name.substring(0, 2).toUpperCase();
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const avatarUrl = computed(() => {
  if (!selectedParent.value) return '';
  const medias = selectedParent.value.user?.medias || [];
  return getAvatarUrl(medias);
});

const getPrefNames = (key: string) => {
  if (!selectedParent.value?.preferences) return [];
  const seen = new Set<string>();
  return selectedParent.value.preferences
    .map((p: any) => p[key]?.name)
    .filter((name: any) => {
      if (!name) return false;
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });
};

const preferenceGroups = [
  { key: 'typeServices', label: 'Types de services', icon: 'service-line', bg: 'bg-rose-50', text: 'text-rose-500' },
  { key: 'gardeEnfants', label: 'Garde d\'enfants', icon: 'parent-line', bg: 'bg-blue-50', text: 'text-blue-500' },
  { key: 'aideMenagere', label: 'Aide ménagère', icon: 'home-gear-line', bg: 'bg-teal-50', text: 'text-teal-600' },
  { key: 'competanceSpecifique', label: 'Compétences recherchées', icon: 'star-smile-line', bg: 'bg-teal-50', text: 'text-teal-600' },
  { key: 'besionsSpecifiques', label: 'Besoins spécifiques', icon: 'heart-line', bg: 'bg-orange-50', text: 'text-orange-600' },
  { key: 'taches', label: 'Tâches', icon: 'task-line', bg: 'bg-purple-50', text: 'text-purple-600' },
  { key: 'criteresSelections', label: 'Critères de sélection', icon: 'filter-3-line', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { key: 'horaireSouhaites', label: 'Horaires souhaités', icon: 'time-line', bg: 'bg-gray-50', text: 'text-gray-600' },
  { key: 'frequenceDesServices', label: 'Fréquence', icon: 'repeat-line', bg: 'bg-gray-50', text: 'text-gray-600' },
  { key: 'disponibilityPrestataire', label: 'Disponibilité', icon: 'flashlight-line', bg: 'bg-gray-50', text: 'text-gray-600' },
  { key: 'modeDePaiement', label: 'Mode de paiement', icon: 'wallet-line', bg: 'bg-gray-50', text: 'text-gray-600' },
  { key: 'adress', label: 'Adresse', icon: 'home-4-line', bg: 'bg-rose-50', text: 'text-rose-500' },
  { key: 'zoneGeographiquePrestataire', label: 'Zones d\'intervention', icon: 'map-pin-2-line', bg: 'bg-rose-50', text: 'text-rose-500' },
  { key: 'langueParler', label: 'Langues', icon: 'translate-2', bg: 'bg-blue-50', text: 'text-blue-600' },
];

const openDetail = (parent: any) => {
  selectedParent.value = parent;
  showDetail.value = true;
};

const closeDetail = () => { showDetail.value = false; selectedParent.value = null; };

const handleDelete = (id: string) => {
  requestConfirm('Voulez-vous vraiment supprimer ce parent ?', async () => {
    try { await adminStore.removeParent(id); } catch { /* error in store */ }
  }, { icon: 'delete-bin-line', iconBgClass: 'bg-red-50', iconClass: 'text-red-500', confirmBgClass: 'bg-red-500 hover:bg-red-600 shadow-red-200' });
};

const handleToggleRestrict = (parent: any) => {
  const next = !parent.restricted;
  const message = next ? 'restreindre' : 'lever la restriction de';
  requestConfirm(`Voulez-vous vraiment ${message} ce parent ?`, async () => {
    try { await adminStore.restrictParent(parent.id, next); } catch { /* error in store */ }
  }, { icon: 'shield-line', iconBgClass: 'bg-orange-50', iconClass: 'text-orange-500', confirmBgClass: 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' });
};

const loadMore = () => { currentPage.value++; adminStore.fetchParents(currentPage.value, limit); };

usePullToRefresh(() => adminStore.fetchParents(currentPage.value, limit));

onMounted(() => { adminStore.fetchParents(currentPage.value, limit); });
</script>
