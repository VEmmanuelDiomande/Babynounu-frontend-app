<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div>
        <h2 class="font-anton text-xl text-gray-900">Utilisateurs</h2>
        <p class="text-sm text-gray-500 font-love mt-1">
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-primary"></span>
            {{ adminStore.usersTotal }} utilisateur(s) au total
          </span>
        </p>
      </div>
      <div class="flex items-center gap-2">
        <!-- Search -->
        <div class="relative flex-1">
          <i class="ri ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style="font-size: 16px;"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher..."
            class="text-sm font-love border border-primary/10 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all w-full"
          />
        </div>
        <select
          v-model="roleFilter"
          @change="onFilterChange"
          class="text-sm font-love border border-primary/10 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
        >
          <option :value="undefined">Tous</option>
          <option :value="1">Admin</option>
          <option :value="2">Nounu</option>
          <option :value="3">Parent</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Cards -->
    <div v-else-if="filteredUsers.length > 0" class="space-y-3">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="bg-white rounded-2xl border border-primary/10 overflow-hidden hover:border-primary/30 transition-all shadow-sm"
      >
        <div class="p-4">
          <div class="flex items-center gap-3 mb-3">
            <div :class="['h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 border border-transparent', getAvatarBgClass(user.role?.slug)]">
              <span :class="['font-anton text-base', getAvatarTextClass(user.role?.slug)]">{{ getInitials(user) }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ getUserDisplayName(user) }}</div>
              <div class="text-xs text-gray-500 font-love truncate">{{ user.email }}</div>
            </div>
            <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love', getRoleBadgeClass(user.role?.slug)]">
              <span :class="['h-1.5 w-1.5 rounded-full', getRoleDotClass(user.role?.slug)]"></span>
              {{ user.role?.slug || 'N/A' }}
            </span>
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-500 font-love mb-3">
            <span class="flex items-center gap-1">
              <i class="ri ri-user-line" style="font-size: 14px;"></i>
              {{ user.typeProfil?.slug || 'N/A' }}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri ri-calendar-line" style="font-size: 14px;"></i>
              {{ formatDate(user.createdAt) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span v-if="!user.deletedAt" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-green-50 text-green-700">
              <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Actif
            </span>
            <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-red-50 text-red-700">
              <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
              Suspendu
            </span>
            <div class="flex items-center gap-2">
              <router-link
                :to="{ name: 'ADMIN_USER_DETAIL', params: { id: user.id } }"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-primary border border-primary/10 hover:bg-primary/10 transition-colors"
              >
                Détails
              </router-link>
              <button
                v-if="!user.deletedAt"
                @click="handleDelete(user.id)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <i class="ri ri-delete-bin-line" style="font-size: 14px;"></i>
              </button>
              <button
                v-else
                @click="handleRestore(user.id)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
              >
                <i class="ri ri-check-line" style="font-size: 14px;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div class="flex items-center justify-center pt-2">
        <button
          @click="loadMore"
          :disabled="adminStore.users.length >= adminStore.usersTotal"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-primary bg-white border border-primary/10 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <i class="ri ri-add-line" style="font-size: 16px;"></i>
          Voir plus
        </button>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-3xl">
      <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <i class="ri ri-group-line text-primary/50" style="font-size: 32px;"></i>
      </div>
      <p class="text-sm text-gray-900 font-love font-semibold">Aucun utilisateur trouvé</p>
      <p class="text-xs text-gray-500 font-love mt-1">Essayez un autre filtre ou terme de recherche</p>
    </div>

    <!-- Error -->
    <div v-if="adminStore.error" class="bg-red-50 border border-red-200 rounded-3xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 24px;"></i>
      <p class="text-sm text-red-600 font-love">{{ adminStore.error }}</p>
    </div>
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

const adminStore = useAdminStore();

const { showConfirm, confirmTitle, confirmMessage, confirmIcon, confirmIconBg, confirmIconClass, confirmLabel, confirmBgClass, requestConfirm, onConfirm, onCancel } = useConfirmModal();

const currentPage = ref(1);
const limit = 20;
const roleFilter = ref<number | undefined>(undefined);
const searchQuery = ref('');

const filteredUsers = computed(() => {
  if (!searchQuery.value) return adminStore.users;
  const q = searchQuery.value.toLowerCase();
  return adminStore.users.filter((u: any) => {
    const name = getUserDisplayName(u).toLowerCase();
    return name.includes(q) || u.email?.toLowerCase().includes(q);
  });
});

const onFilterChange = () => {
  currentPage.value = 1;
  adminStore.fetchUsers(currentPage.value, limit, roleFilter.value);
};

const loadMore = () => {
  currentPage.value++;
  adminStore.fetchUsers(currentPage.value, limit, roleFilter.value, true);
};

const handleDelete = (id: string) => {
  requestConfirm('Voulez-vous vraiment suspendre cet utilisateur ?', async () => {
    try {
      await adminStore.removeUser(id);
    } catch {
      // error handled in store
    }
  }, { icon: 'group-line', iconBgClass: 'bg-red-50', iconClass: 'text-red-500', confirmBgClass: 'bg-red-500 hover:bg-red-600 shadow-red-200' });
};

const handleRestore = async (id: string) => {
  try {
    await adminStore.restoreUser(id);
  } catch {
    // error handled in store
  }
};

const getInitials = (user: any) => {
  const name = getUserDisplayName(user);
  return name.substring(0, 2).toUpperCase();
};

const getUserDisplayName = (user: any) => {
  if (user.nounus?.length > 0) {
    const n = user.nounus[0];
    return `${n.firstName || ''} ${n.lastName || ''}`.trim() || user.email;
  }
  if (user.parents?.length > 0) {
    const p = user.parents[0];
    return `${p.firstName || ''} ${p.lastName || ''}`.trim() || user.email;
  }
  return user.email?.split('@')[0] || 'Utilisateur';
};

const getRoleBadgeClass = (slug: string) => {
  switch (slug) {
    case 'admin':
      return 'bg-primary/10 text-primary';
    case 'nounu':
      return 'bg-secondary/10 text-secondary';
    case 'parent':
      return 'bg-indigo-100 text-indigo-600';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getRoleDotClass = (slug: string) => {
  switch (slug) {
    case 'admin':
      return 'bg-primary';
    case 'nounu':
      return 'bg-secondary';
    case 'parent':
      return 'bg-indigos';
    default:
      return 'bg-gray-400';
  }
};

const getAvatarBgClass = (slug: string) => {
  switch (slug) {
    case 'admin':
      return 'bg-primary/10';
    case 'nounu':
      return 'bg-secondary/10';
    case 'parent':
      return 'bg-indigo-100';
    default:
      return 'bg-gray-100';
  }
};

const getAvatarTextClass = (slug: string) => {
  switch (slug) {
    case 'admin':
      return 'text-primary';
    case 'nounu':
      return 'text-secondary';
    case 'parent':
      return 'text-indigo-600';
    default:
      return 'text-gray-600';
  }
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

usePullToRefresh(() => adminStore.fetchUsers(currentPage.value, limit, roleFilter.value));

onMounted(() => {
  adminStore.fetchUsers(currentPage.value, limit, roleFilter.value);
});
</script>
