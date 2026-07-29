<template>
  <div class="space-y-5">
    <!-- Header -->
    <div>
      <h2 class="font-anton text-xl text-gray-900">Mon profil</h2>
      <p class="text-sm text-gray-500 font-love mt-1">Gérez votre compte et vos préférences</p>
    </div>

    <!-- Layout: sidebar above tabs -->
    <div class="space-y-5">
      <!-- Sidebar (profile summary) -->
      <div class="grid grid-cols-1 gap-4">
        <div class="bg-white rounded-3xl border border-primary/10 p-5 shadow-sm text-center">
          <div class="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <span class="font-anton text-2xl text-white">{{ initials }}</span>
          </div>
          <h3 class="font-anton text-lg text-gray-900">{{ displayName }}</h3>
          <p class="text-sm text-gray-500 font-love mt-0.5">{{ email || 'admin@babynounu.com' }}</p>
          <div class="flex items-center justify-center gap-2 mt-3">
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-primary/10 text-primary">
              <i class="ri ri-shield-line mr-1" style="font-size: 12px;"></i>
              {{ role || 'admin' }}
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-green-50 text-green-700">
              <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Connecté
            </span>
          </div>
        </div>

        <!-- Quick stats -->
        <div class="bg-white rounded-3xl border border-primary/10 p-5 shadow-sm">
          <h4 class="font-anton text-sm text-gray-900 mb-3">Activité du compte</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500 font-love flex items-center gap-2">
                <i class="ri ri-calendar-2-line text-primary/60" style="font-size: 14px;"></i>
                Membre depuis
              </span>
              <span class="text-xs font-semibold text-gray-900 font-love">{{ memberSince }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500 font-love flex items-center gap-2">
                <i class="ri ri-checkbox-circle-line text-secondary" style="font-size: 14px;"></i>
                Statut
              </span>
              <span class="text-xs font-semibold text-green-600 font-love">Actif</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500 font-love flex items-center gap-2">
                <i class="ri ri-user-3-line text-primary/60" style="font-size: 14px;"></i>
                Type
              </span>
              <span class="text-xs font-semibold text-gray-900 font-love">{{ typeProfil || 'administrateur' }}</span>
            </div>
          </div>
        </div>

        <!-- Logout card -->
        <div class="bg-white rounded-3xl border border-primary/10 p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-3">
            <div class="h-8 w-8 rounded-xl bg-red-50 flex items-center justify-center">
              <i class="ri ri-logout-box-line text-red-500" style="font-size: 16px;"></i>
            </div>
            <h4 class="font-anton text-sm text-gray-900">Session</h4>
          </div>
          <p class="text-xs text-gray-500 font-love mb-3">Déconnectez-vous de votre compte.</p>
          <button
            @click="logout"
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-love font-medium hover:bg-red-600 active:scale-95 transition-all shadow-sm shadow-red-200"
          >
            <i class="ri ri-logout-box-line" style="font-size: 16px;"></i>
            Déconnexion
          </button>
        </div>
      </div>

      <!-- Main content with tabs -->
      <div>
        <Tabs v-model="activeTab" :tabs="tabs">
          <!-- Informations -->
          <div v-if="activeTab === 'info'" class="space-y-4">
            <Card variant="elevated" className="p-5">
              <div class="flex items-center gap-2 mb-4">
                <div class="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <i class="ri ri-user-3-line text-primary" style="font-size: 16px;"></i>
                </div>
                <h4 class="font-anton text-base text-gray-900">Informations générales</h4>
              </div>
              <div class="divide-y divide-primary/10">
                <div class="flex items-center justify-between py-3">
                  <span class="text-sm text-gray-500 font-love">Identifiant</span>
                  <span class="text-sm font-semibold text-gray-900 font-love">{{ userId || '—' }}</span>
                </div>
                <div class="flex items-center justify-between py-3">
                  <span class="text-sm text-gray-500 font-love">Email</span>
                  <span class="text-sm font-semibold text-gray-900 font-love">{{ email || '—' }}</span>
                </div>
                <div class="flex items-center justify-between py-3">
                  <span class="text-sm text-gray-500 font-love">Rôle</span>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-primary/10 text-primary">{{ role || 'admin' }}</span>
                </div>
                <div class="flex items-center justify-between py-3">
                  <span class="text-sm text-gray-500 font-love">Type de profil</span>
                  <span class="text-sm font-semibold text-gray-900 font-love">{{ typeProfil || 'administrateur' }}</span>
                </div>
                <div class="flex items-center justify-between py-3">
                  <span class="text-sm text-gray-500 font-love">Slug</span>
                  <span class="text-sm font-semibold text-gray-900 font-love">{{ slug || '—' }}</span>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="p-5">
              <div class="flex items-center gap-2 mb-4">
                <div class="h-8 w-8 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <i class="ri ri-shield-line text-secondary" style="font-size: 16px;"></i>
                </div>
                <h4 class="font-anton text-base text-gray-900">Permissions & accès</h4>
              </div>
              <div v-if="adminStore.userDetail?.role?.permissions?.length" class="flex flex-wrap gap-2">
                <span
                  v-for="perm in adminStore.userDetail.role.permissions"
                  :key="perm.id"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-love font-medium bg-secondary/10 text-secondary"
                >
                  <i class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ perm.name }}
                </span>
              </div>
              <div v-else class="flex items-center gap-2 text-sm text-gray-500 font-love">
                <i class="ri ri-shield-line text-secondary/50" style="font-size: 18px;"></i>
                Accès administrateur complet
              </div>
            </Card>
          </div>

          <!-- Sécurité -->
          <div v-if="activeTab === 'security'" class="space-y-4">
            <Card variant="elevated" className="p-5">
              <div class="flex items-center gap-2 mb-4">
                <div class="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center">
                  <i class="ri ri-lock-2-line text-amber-600" style="font-size: 16px;"></i>
                </div>
                <h4 class="font-anton text-base text-gray-900">Sécurité du compte</h4>
              </div>
              <div class="divide-y divide-primary/10">
                <div class="flex items-center justify-between py-3">
                  <span class="text-sm text-gray-500 font-love flex items-center gap-2">
                    <i class="ri ri-key-2-line text-gray-400" style="font-size: 16px;"></i>
                    Mot de passe
                  </span>
                  <span class="text-xs font-love text-gray-400">••••••••</span>
                </div>
                <div class="flex items-center justify-between py-3">
                  <span class="text-sm text-gray-500 font-love flex items-center gap-2">
                    <i class="ri ri-checkbox-circle-line text-green-500" style="font-size: 16px;"></i>
                    2FA
                  </span>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-gray-100 text-gray-600">Non activé</span>
                </div>
                <div class="flex items-center justify-between py-3">
                  <span class="text-sm text-gray-500 font-love flex items-center gap-2">
                    <i class="ri ri-timer-line text-gray-400" style="font-size: 16px;"></i>
                    Dernière connexion
                  </span>
                  <span class="text-xs font-love text-gray-600">{{ lastLogin }}</span>
                </div>
              </div>
            </Card>
          </div>

          <!-- Préférences -->
          <div v-if="activeTab === 'prefs'" class="space-y-4">
            <Card variant="elevated" className="p-5">
              <div class="flex items-center gap-2 mb-4">
                <div class="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <i class="ri ri-settings-3-line text-indigo-600" style="font-size: 16px;"></i>
                </div>
                <h4 class="font-anton text-base text-gray-900">Préférences</h4>
              </div>
              <div class="divide-y divide-primary/10">
                <div class="flex items-center justify-between py-3">
                  <span class="text-sm text-gray-500 font-love">Langue</span>
                  <span class="text-sm font-semibold text-gray-900 font-love">Français</span>
                </div>
                <div class="flex items-center justify-between py-3">
                  <span class="text-sm text-gray-500 font-love">Fuseau horaire</span>
                  <span class="text-sm font-semibold text-gray-900 font-love">UTC+0</span>
                </div>
                <div class="flex items-center justify-between py-3">
                  <span class="text-sm text-gray-500 font-love">Notifications email</span>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-green-50 text-green-700">Activées</span>
                </div>
              </div>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { StorageUtils } from '@/utils/store.utils';
import { useAdminStore } from '@/stores/admin.store';
import { Card, Tabs } from '@/components/ui';

const adminStore = useAdminStore();

const email = ref('');
const userId = ref('');
const role = ref('');
const typeProfil = ref('');
const slug = ref('');
const createdAt = ref('');

const activeTab = ref('info');

const tabs = [
  { label: 'Informations', value: 'info', icon: 'user-3-line' },
  { label: 'Sécurité', value: 'security', icon: 'shield-line' },
  { label: 'Préférences', value: 'prefs', icon: 'settings-3-line' },
];

const displayName = computed(() => {
  if (slug.value && slug.value !== 'admin') return slug.value;
  return 'Administrateur';
});

const initials = computed(() => {
  const name = displayName.value;
  if (!name) return 'A';
  return name.charAt(0).toUpperCase();
});

const memberSince = computed(() => {
  if (createdAt.value) {
    try {
      return new Date(createdAt.value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return '—'; }
  }
  return '—';
});

const lastLogin = computed(() => {
  return new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
});

const logout = async () => {
  const storageUtils = StorageUtils();
  await storageUtils.removeStore('nToken');
  await storageUtils.removeStore('nAdmin_Id');
  await storageUtils.removeStore('nUser_Id');
  await storageUtils.removeStore('nRole');
  location.assign('/choose-destination-to-start');
};

onMounted(async () => {
  const storageUtils = StorageUtils();
  const uid = await storageUtils.getStore('nUser_Id');
  const r = await storageUtils.getStore('nRole');
  const tp = await storageUtils.getStore('nType_Profil');
  userId.value = uid?.value || '';
  role.value = r?.value || '';
  typeProfil.value = tp?.value || 'administrateur';

  if (userId.value) {
    try {
      await adminStore.fetchUserDetail(userId.value);
      const detail = adminStore.userDetail;
      if (detail) {
        email.value = detail.email || email.value;
        slug.value = detail.slug || '';
        createdAt.value = detail.createdAt || '';
        if (detail.role?.slug) role.value = detail.role.slug;
        if (detail.typeProfil?.slug) typeProfil.value = detail.typeProfil.slug;
      }
    } catch {
      // fallback to stored values
    }
  }
});
</script>
