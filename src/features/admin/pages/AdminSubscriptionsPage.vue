<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-anton text-xl text-gray-900">Abonnements</h2>
          <p class="text-sm text-gray-500 font-love mt-1">
            <span class="inline-flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-primary"></span>
              {{ adminStore.subscriptionsTotal }} abonnement(s) au total
            </span>
          </p>
        </div>
        <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-love font-semibold text-white bg-secondary hover:bg-secondary/80 active:scale-95 transition-all"
        >
          <i class="ri ri-add-line" style="font-size: 16px;"></i>
          Créer un abonnement
        </button>
      </div>
      <select
        v-model="statusFilter"
        @change="onFilterChange"
        class="text-sm font-love border border-primary/10 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
      >
        <option :value="undefined">Tous les statuts</option>
        <option value="active">Actif</option>
        <option value="expired">Expiré</option>
        <option value="cancelled">Annulé</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Cards -->
    <div v-else-if="adminStore.subscriptions.length > 0" class="space-y-3">
      <div
        v-for="sub in adminStore.subscriptions"
        :key="sub.id"
        class="bg-white rounded-2xl border border-primary/10 overflow-hidden hover:border-primary/30 transition-all shadow-sm"
      >
        <div class="p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-transparent">
              <span class="font-anton text-base text-primary">{{ getInitials(sub.user) }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ getUserName(sub.user) }}</div>
              <div class="text-xs text-gray-500 font-love truncate">{{ sub.user?.email }}</div>
            </div>
            <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love', getStatusClass(sub.status)]">
              <span :class="['h-1.5 w-1.5 rounded-full', getStatusDot(sub.status)]"></span>
              {{ getStatusLabel(sub.status) }}
            </span>
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-500 font-love mb-3">
            <span class="flex items-center gap-1">
              <i class="ri ri-vip-crown-line" style="font-size: 14px;"></i>
              {{ sub.type?.name || '—' }}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri ri-calendar-line" style="font-size: 14px;"></i>
              {{ formatDate(sub.expiresAt) }}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri ri-time-line" style="font-size: 14px;"></i>
              {{ formatDate(sub.createdAt) }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="openEditModal(sub)"
              class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-love font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all"
            >
              <i class="ri ri-edit-line" style="font-size: 14px;"></i>
            </button>
            <button
              @click="openDeleteModal(sub)"
              class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-love font-semibold text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all"
            >
              <i class="ri ri-delete-bin-line" style="font-size: 14px;"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div class="flex items-center justify-center pt-2">
        <button @click="loadMore" :disabled="adminStore.subscriptions.length < limit" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-primary bg-white border border-primary/10 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <i class="ri ri-add-line" style="font-size: 16px;"></i>
          Voir plus
        </button>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-3xl">
      <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <i class="ri ri-vip-crown-line text-primary/50" style="font-size: 32px;"></i>
      </div>
      <p class="text-sm text-gray-900 font-love font-semibold">Aucun abonnement trouvé</p>
      <p class="text-xs text-gray-500 font-love mt-1">Les abonnements actifs apparaîtront ici</p>
    </div>

    <!-- Error -->
    <div v-if="adminStore.error" class="bg-red-50 border border-red-200 rounded-3xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 24px;"></i>
      <p class="text-sm text-red-600 font-love">{{ adminStore.error }}</p>
    </div>

    <!-- Create Subscription Modal -->
    <Drawer :show="showCreateModal" title="Créer un abonnement" maxHeight="85vh" @close="closeCreateModal">
      <div class="space-y-3">
        <div>
          <label class="text-xs text-gray-500 font-love mb-1 block">Utilisateur</label>
          <input
            v-model="userSearch"
            type="text"
            placeholder="Rechercher un utilisateur (email, nom...)"
            class="text-sm font-love border border-primary/10 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-primary/50 w-full"
          />
          <div v-if="searchLoading" class="flex items-center justify-center py-3">
            <div class="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
          </div>
          <div v-else-if="searchResults.length > 0" class="mt-2 max-h-40 overflow-y-auto border border-primary/10 rounded-xl divide-y divide-gray-100">
            <button
              v-for="user in searchResults"
              :key="user.id"
              @click="selectUser(user)"
              class="w-full text-left px-3 py-2 hover:bg-primary/5 transition-colors flex items-center gap-2"
            >
              <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span class="font-anton text-xs text-primary">{{ getInitials(user) }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-xs font-semibold text-gray-900 font-love truncate">{{ getUserName(user) }}</div>
                <div class="text-[10px] text-gray-500 font-love truncate">{{ user.email }}</div>
              </div>
              <i v-if="selectedUser?.id === user.id" class="ri ri-check-line text-primary" style="font-size: 16px;"></i>
            </button>
          </div>
        </div>
        <div v-if="selectedUser" class="p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span class="font-anton text-xs text-primary">{{ getInitials(selectedUser) }}</span>
            </div>
            <div class="min-w-0">
              <div class="text-xs font-semibold text-gray-900 font-love truncate">{{ getUserName(selectedUser) }}</div>
              <div class="text-[10px] text-gray-500 font-love truncate">{{ selectedUser.email }}</div>
            </div>
          </div>
          <button @click="clearUserSelection" class="h-6 w-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <i class="ri ri-close-line" style="font-size: 14px;"></i>
          </button>
        </div>
        <div>
          <label class="text-xs text-gray-500 font-love mb-1 block">Statut</label>
          <select v-model="createForm.status" class="text-sm font-love border border-primary/10 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-primary/50 w-full">
            <option value="active">Actif</option>
            <option value="expired">Expiré</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-gray-500 font-love mb-1 block">Durée (jours)</label>
          <input v-model="createForm.durationDays" type="number" placeholder="30" class="text-sm font-love border border-primary/10 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-primary/50 w-full" />
        </div>
        <button @click="createSubscription" :disabled="adminStore.isLoading" class="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-white bg-secondary hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <i v-if="adminStore.isLoading" class="ri ri-loader-4-line animate-spin" style="font-size: 16px;"></i>
          <span v-else>Créer</span>
        </button>
      </div>
    </Drawer>

    <!-- Edit Subscription Modal -->
    <Drawer :show="showEditModal" title="Modifier l'abonnement" maxHeight="85vh" @close="closeEditModal">
      <div v-if="selectedSubscription" class="space-y-3">
        <div>
          <label class="text-xs text-gray-500 font-love mb-1 block">Statut</label>
          <select v-model="editForm.status" class="text-sm font-love border border-primary/10 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-primary/50 w-full">
            <option value="active">Actif</option>
            <option value="expired">Expiré</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-gray-500 font-love mb-1 block">Date d'expiration</label>
          <input v-model="editForm.expiresAt" type="date" class="text-sm font-love border border-primary/10 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-primary/50 w-full" />
        </div>
        <button @click="updateSubscription" :disabled="adminStore.isLoading" class="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-white bg-secondary hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <i v-if="adminStore.isLoading" class="ri ri-loader-4-line animate-spin" style="font-size: 16px;"></i>
          <span v-else>Enregistrer</span>
        </button>
      </div>
    </Drawer>

    <!-- Delete Subscription Modal -->
    <Drawer :show="showDeleteModal" title="Supprimer l'abonnement" maxHeight="50vh" @close="closeDeleteModal">
      <div v-if="selectedSubscription" class="space-y-3">
        <p class="text-sm text-gray-700 font-love">Êtes-vous sûr de vouloir supprimer cet abonnement ?</p>
        <div class="flex items-center gap-2">
          <button @click="deleteSubscription" :disabled="adminStore.isLoading" class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            <i v-if="adminStore.isLoading" class="ri ri-loader-4-line animate-spin" style="font-size: 16px;"></i>
            <span v-else>Supprimer</span>
          </button>
          <button @click="closeDeleteModal" class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
            Annuler
          </button>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { usePullToRefresh } from '@/composables/usePullToRefresh';
import Drawer from '@/components/ui/Drawer/Drawer.vue';

const adminStore = useAdminStore();
const currentPage = ref(1);
const limit = 20;
const statusFilter = ref<string | undefined>(undefined);

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showCreateModal = ref(false);
const selectedSubscription = ref<any>(null);
const editForm = ref({ status: '', expiresAt: '' });
const createForm = ref({ userId: '', status: 'active', durationDays: 30 });
const userSearch = ref('');
const searchResults = ref<any[]>([]);
const searchLoading = ref(false);
const selectedUser = ref<any>(null);
let searchTimeout: any = null;

const getInitials = (user: any) => {
  const name = user?.email || '';
  return name.substring(0, 2).toUpperCase();
};

const getUserName = (user: any) => {
  if (user?.nounus?.[0]?.fullname) return user.nounus[0].fullname;
  if (user?.parents?.[0]?.fullname) return user.parents[0].fullname;
  return user?.email || 'Inconnu';
};

const formatDate = (date: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'Actif';
    case 'expired': return 'Expiré';
    case 'cancelled': return 'Annulé';
    default: return status || 'Inconnu';
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-50 text-green-700';
    case 'expired': return 'bg-gray-100 text-gray-600';
    case 'cancelled': return 'bg-red-50 text-red-700';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getStatusDot = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500';
    case 'expired': return 'bg-gray-400';
    case 'cancelled': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

const onFilterChange = () => {
  currentPage.value = 1;
  adminStore.fetchSubscriptions(currentPage.value, limit, statusFilter.value);
};

const loadMore = () => { currentPage.value++; adminStore.fetchSubscriptions(currentPage.value, limit, statusFilter.value); };

const searchUsers = async () => {
  if (!userSearch.value.trim()) {
    searchResults.value = [];
    return;
  }
  searchLoading.value = true;
  searchResults.value = await adminStore.searchUsers(userSearch.value.trim());
  searchLoading.value = false;
};

watch(userSearch, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchUsers();
  }, 300);
});

const selectUser = (user: any) => {
  selectedUser.value = user;
  createForm.value.userId = user.id;
  userSearch.value = '';
  searchResults.value = [];
};

const clearUserSelection = () => {
  selectedUser.value = null;
  createForm.value.userId = '';
};

const openCreateModal = () => {
  createForm.value = { userId: '', status: 'active', durationDays: 30 };
  selectedUser.value = null;
  userSearch.value = '';
  searchResults.value = [];
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  createForm.value = { userId: '', status: 'active', durationDays: 30 };
  selectedUser.value = null;
  userSearch.value = '';
  searchResults.value = [];
};

const createSubscription = async () => {
  try {
    await adminStore.createSubscription(createForm.value);
    closeCreateModal();
  } catch (e) {
    console.error('Erreur création abonnement:', e);
  }
};

const openEditModal = (sub: any) => {
  selectedSubscription.value = sub;
  editForm.value = {
    status: sub.status || 'active',
    expiresAt: sub.expiresAt ? new Date(sub.expiresAt).toISOString().split('T')[0] : '',
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedSubscription.value = null;
  editForm.value = { status: '', expiresAt: '' };
};

const updateSubscription = async () => {
  if (!selectedSubscription.value) return;
  try {
    const data: any = { status: editForm.value.status };
    if (editForm.value.expiresAt) {
      data.expiresAt = new Date(editForm.value.expiresAt);
    }
    await adminStore.updateSubscription(selectedSubscription.value.id, data);
    closeEditModal();
  } catch (e) {
    console.error('Erreur mise à jour abonnement:', e);
  }
};

const openDeleteModal = (sub: any) => {
  selectedSubscription.value = sub;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedSubscription.value = null;
};

const deleteSubscription = async () => {
  if (!selectedSubscription.value) return;
  try {
    await adminStore.deleteSubscription(selectedSubscription.value.id);
    closeDeleteModal();
  } catch (e) {
    console.error('Erreur suppression abonnement:', e);
  }
};

usePullToRefresh(() => adminStore.fetchSubscriptions(currentPage.value, limit, statusFilter.value));

onMounted(() => {
  adminStore.fetchSubscriptions(currentPage.value, limit);
});
</script>
