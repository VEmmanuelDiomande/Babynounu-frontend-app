<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="font-anton text-xl text-gray-900">Rôles & Permissions</h2>
      <p class="text-sm text-gray-500 font-love mt-1">Gérez les rôles et assignez des permissions</p>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading && !adminStore.rolePermissions.length" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <div v-else class="space-y-6">
      <!-- Roles list -->
      <div class="bg-white rounded-3xl border border-primary/10 p-5 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <div class="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <i class="ri ri-settings-3-line text-primary" style="font-size: 16px;"></i>
          </div>
          <h3 class="font-anton text-base text-gray-900">Sélectionner un rôle</h3>
        </div>
        <div class="space-y-2">
          <button
            v-for="role in roles"
            :key="role.id"
            @click="selectRole(role)"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-love transition-all active:scale-95',
              selectedRole?.id === role.id ? 'bg-primary/10 text-primary border border-primary/10 shadow-sm' : 'hover:bg-primary/5 border border-transparent'
            ]"
          >
            <span class="flex items-center gap-2">
              <span :class="['h-2 w-2 rounded-full', getRoleDotClass(role.slug)]"></span>
              <span class="font-semibold">{{ role.name }}</span>
            </span>
            <span :class="['inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium font-love', getRoleBadgeClass(role.slug)]">{{ role.slug }}</span>
          </button>
        </div>
      </div>

      <!-- Permissions for selected role -->
      <div class="bg-white rounded-3xl border border-primary/10 p-5 shadow-sm">
        <div v-if="!selectedRole" class="flex flex-col items-center justify-center py-12">
          <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <i class="ri ri-shield-line text-primary/50" style="font-size: 32px;"></i>
          </div>
          <p class="text-sm text-gray-900 font-love font-semibold">Sélectionnez un rôle</p>
          <p class="text-xs text-gray-500 font-love mt-1">Pour voir ses permissions</p>
        </div>
        <template v-else>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span :class="['h-2 w-2 rounded-full', getRoleDotClass(selectedRole.slug)]"></span>
              <h3 class="font-anton text-base text-gray-900">Permissions — {{ selectedRole.name }}</h3>
            </div>
            <span class="text-xs text-gray-500 font-love font-semibold">{{ adminStore.rolePermissions.length }} permission(s)</span>
          </div>

          <!-- Assigned permissions -->
          <div class="space-y-2 mb-4 max-h-[300px] overflow-y-auto pr-1">
            <div v-for="rp in adminStore.rolePermissions" :key="rp.permissionId" class="flex items-center justify-between px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
              <div class="min-w-0 flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                <div class="min-w-0">
                  <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ rp.permission?.name }}</div>
                  <div class="text-xs text-gray-500 font-love truncate">{{ rp.permission?.slug }}</div>
                </div>
              </div>
              <button @click="handleRemovePermission(rp.permissionId)" class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-red-600 hover:bg-red-50 font-love transition-colors flex-shrink-0 ml-2">
                <i class="ri ri-close-line" style="font-size: 12px;"></i>
                Retirer
              </button>
            </div>
            <div v-if="adminStore.rolePermissions.length === 0" class="flex flex-col items-center py-8">
              <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <i class="ri ri-checkbox-circle-line text-primary/50" style="font-size: 24px;"></i>
              </div>
              <p class="text-sm text-gray-900 font-love font-semibold">Aucune permission assignée</p>
              <p class="text-xs text-gray-500 font-love mt-1">Ajoutez des permissions à ce rôle</p>
            </div>
          </div>

          <!-- Add permission -->
          <div class="border-t border-primary/10 pt-4">
            <label class="block text-xs font-love font-medium text-gray-500 mb-2">Ajouter une permission</label>
            <div class="flex gap-2">
              <select v-model.number="selectedPermissionId" class="flex-1 text-sm font-love border border-primary/10 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all">
                <option :value="null">Sélectionner...</option>
                <option v-for="p in availablePermissions" :key="p.id" :value="p.id">{{ p.name }} ({{ p.slug }})</option>
              </select>
              <button @click="handleAssignPermission" :disabled="!selectedPermissionId || adminStore.isLoading" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-love font-medium hover:bg-primary/90 disabled:opacity-50 active:scale-95 transition-all shadow-sm shadow-primary/20">
                <i class="ri ri-add-line" style="font-size: 16px;"></i>
                Ajouter
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="adminStore.error" class="bg-red-50 border border-red-200 rounded-3xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 24px;"></i>
      <p class="text-sm text-red-600 font-love">{{ adminStore.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';

const adminStore = useAdminStore();
const selectedRole = ref<any>(null);
const selectedPermissionId = ref<number | null>(null);

const roles = ref<any[]>([
  { id: 1, name: 'Administrateur', slug: 'admin' },
  { id: 2, name: 'Nounu', slug: 'nounu' },
  { id: 3, name: 'Parent', slug: 'parent' },
]);

const availablePermissions = computed(() => {
  const assignedIds = adminStore.rolePermissions.map((rp) => rp.permissionId);
  return adminStore.permissions.filter((p) => !assignedIds.includes(p.id));
});

const selectRole = (role: any) => {
  selectedRole.value = role;
  adminStore.fetchRolePermissions(role.id);
};

const handleAssignPermission = async () => {
  if (!selectedRole.value || !selectedPermissionId.value) return;
  try {
    await adminStore.assignPermission(selectedRole.value.id, selectedPermissionId.value);
    selectedPermissionId.value = null;
  } catch { /* error in store */ }
};

const handleRemovePermission = async (permissionId: number) => {
  if (!selectedRole.value) return;
  try { await adminStore.removePermissionFromRole(selectedRole.value.id, permissionId); } catch { /* error in store */ }
};

const getRoleBadgeClass = (slug: string) => {
  switch (slug) {
    case 'admin': return 'bg-primary/10 text-primary';
    case 'nounu': return 'bg-secondary/10 text-secondary';
    case 'parent': return 'bg-indigo-100 text-indigo-600';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getRoleDotClass = (slug: string) => {
  switch (slug) {
    case 'admin': return 'bg-primary';
    case 'nounu': return 'bg-secondary';
    case 'parent': return 'bg-indigo-500';
    default: return 'bg-gray-400';
  }
};

onMounted(() => { adminStore.fetchPermissions(1, 100); });
</script>
