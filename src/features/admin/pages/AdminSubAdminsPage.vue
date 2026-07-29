<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div>
        <h2 class="font-anton text-xl text-gray-900">Sous-admins</h2>
        <p class="text-sm text-gray-500 font-love mt-1">Créez des sous-administrateurs avec des permissions spécifiques</p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-love text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-sm shadow-primary/20"
      >
        <i class="ri ri-add-line" style="font-size: 16px;"></i>
        Ajouter un sous-admin
      </button>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading && !showCreateModal" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Users with admin role -->
    <div v-else-if="adminUsers.length > 0" class="space-y-3">
      <div
        v-for="user in adminUsers"
        :key="user.id"
        class="bg-white rounded-2xl border border-primary/10 overflow-hidden hover:border-primary/30 transition-all shadow-sm"
      >
        <div class="p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-transparent">
              <span class="font-anton text-base text-primary">{{ getInitials(user) }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ user.email }}</div>
              <div class="text-xs text-gray-500 font-love truncate">{{ user.slug }}</div>
            </div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-primary/10 text-primary">
              {{ user.role?.name || 'Admin' }}
            </span>
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-500 font-love mb-3">
            <span class="flex items-center gap-1">
              <i class="ri ri-calendar-line" style="font-size: 14px;"></i>
              {{ formatDate(user.createdAt) }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <router-link
              :to="{ name: 'ADMIN_USER_DETAIL', params: { id: user.id } }"
              class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-primary border border-primary/10 hover:bg-primary/10 active:scale-95 transition-all"
            >
              Détails
            </router-link>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div class="flex items-center justify-center pt-2">
        <button @click="loadMore" :disabled="adminUsers.length < limit" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-primary bg-white border border-primary/10 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <i class="ri ri-add-line" style="font-size: 16px;"></i>
          Voir plus
        </button>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-3xl">
      <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <i class="ri ri-user-3-line text-primary/50" style="font-size: 24px;"></i>
      </div>
      <p class="text-sm text-gray-900 font-love font-semibold">Aucun sous-admin trouvé</p>
      <p class="text-xs text-gray-500 font-love mt-1 text-center">Cliquez sur "Ajouter" pour en créer un</p>
    </div>

    <!-- Error -->
    <div v-if="adminStore.error" class="bg-red-50 border border-red-200 rounded-3xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 24px;"></i>
      <p class="text-sm text-red-600 font-love">{{ adminStore.error }}</p>
    </div>

    <!-- Create Sub-Admin Drawer -->
    <Drawer :show="showCreateModal" title="Créer un sous-admin" maxHeight="85vh" @close="closeCreateModal">
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-love font-medium text-gray-500 mb-1">Email</label>
          <input
            v-model="formEmail"
            type="email"
            placeholder="admin@babynounu.com"
            class="w-full text-sm font-love border border-primary/10 rounded-xl px-3 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
          />
        </div>
        <div>
          <label class="block text-xs font-love font-medium text-gray-500 mb-1">Mot de passe (min. 6 caractères)</label>
          <input
            v-model="formPassword"
            type="password"
            placeholder="••••••••"
            class="w-full text-sm font-love border border-primary/10 rounded-xl px-3 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
          />
        </div>
        <div>
          <label class="block text-xs font-love font-medium text-gray-500 mb-1">Rôle</label>
          <select
            v-model.number="formRoleId"
            class="w-full text-sm font-love border border-primary/10 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
          >
            <option :value="null">Sélectionner un rôle...</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }} ({{ role.slug }})</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-love font-medium text-gray-500 mb-2">Permissions</label>
          <div class="space-y-2 max-h-48 overflow-y-auto border border-primary/10 rounded-xl p-3 bg-gray-50">
            <label
              v-for="perm in adminStore.permissions"
              :key="perm.id"
              class="flex items-center gap-2 cursor-pointer hover:bg-white px-2 py-1.5 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                :value="perm.id"
                v-model="formPermissionIds"
                class="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary/50"
              />
              <div class="min-w-0">
                <div class="text-sm font-medium text-gray-900 font-love truncate">{{ perm.name }}</div>
                <div class="text-xs text-gray-500 font-love truncate">{{ perm.slug }}</div>
              </div>
            </label>
            <div v-if="adminStore.permissions.length === 0" class="text-sm text-gray-500 font-love text-center py-4">
              Aucune permission disponible
            </div>
          </div>
        </div>

        <div v-if="formError" class="text-sm text-red-600 font-love">{{ formError }}</div>
        <div v-if="formSuccess" class="flex items-center gap-2 text-sm text-green-600 font-love bg-green-50 rounded-xl px-3 py-2">
          <i class="ri ri-checkbox-circle-line" style="font-size: 16px;"></i>
          Sous-admin créé avec succès
        </div>
      </div>
      <template #footer>
        <div class="flex items-center gap-3">
          <button
            @click="submitCreate"
            :disabled="adminStore.isLoading || !formEmail || !formPassword || formPassword.length < 6 || !formRoleId"
            class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-love font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            {{ adminStore.isLoading ? 'Création...' : 'Créer le sous-admin' }}
          </button>
          <button @click="closeCreateModal" class="px-4 py-2.5 rounded-xl text-sm font-love font-semibold text-gray-600 border border-primary/10 hover:bg-primary/5 transition-colors">
            Annuler
          </button>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import Drawer from '@/components/ui/Drawer/Drawer.vue';

const adminStore = useAdminStore();
const currentPage = ref(1);
const limit = 20;

const showCreateModal = ref(false);
const formEmail = ref('');
const formPassword = ref('');
const formRoleId = ref<number | null>(null);
const formPermissionIds = ref<number[]>([]);
const formError = ref('');
const formSuccess = ref(false);

const roles = ref<any[]>([
  { id: 1, name: 'Administrateur', slug: 'admin' },
  { id: 2, name: 'Nounu', slug: 'nounu' },
  { id: 3, name: 'Parent', slug: 'parent' },
]);

const adminUsers = computed(() => {
  return adminStore.users.filter((u: any) => u.role?.slug === 'admin' || u.typeProfil?.slug === 'admin');
});

const openCreateModal = () => {
  formEmail.value = '';
  formPassword.value = '';
  formRoleId.value = null;
  formPermissionIds.value = [];
  formError.value = '';
  formSuccess.value = false;
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const submitCreate = async () => {
  if (!formEmail.value || !formPassword.value || formPassword.value.length < 6 || !formRoleId.value) return;
  formError.value = '';
  formSuccess.value = false;
  try {
    await adminStore.createSubAdmin({
      email: formEmail.value,
      password: formPassword.value,
      roleId: formRoleId.value,
      permissionIds: formPermissionIds.value.length > 0 ? formPermissionIds.value : undefined,
    });
    formSuccess.value = true;
    setTimeout(() => {
      closeCreateModal();
      adminStore.fetchUsers(currentPage.value, limit);
    }, 1500);
  } catch (e: any) {
    formError.value = e.message;
  }
};

const getInitials = (user: any) => {
  const name = user.email || user.slug || '';
  return name.substring(0, 2).toUpperCase();
};

const formatDate = (date: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const loadMore = () => {
  currentPage.value++;
  adminStore.fetchUsers(currentPage.value, limit);
};

onMounted(() => {
  adminStore.fetchUsers(currentPage.value, limit);
  adminStore.fetchPermissions(1, 100);
});
</script>

