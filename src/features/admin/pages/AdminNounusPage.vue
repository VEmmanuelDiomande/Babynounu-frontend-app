<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-anton text-xl text-gray-900">Certifications Nounus</h2>
        <p class="text-sm text-gray-500 font-love mt-1">
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-primary"></span>
            {{ adminStore.pendingNounusTotal }} nounu(s) en attente de validation
          </span>
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Cards -->
    <div v-else-if="adminStore.pendingNounus.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card
        v-for="nounu in adminStore.pendingNounus"
        :key="nounu.id"
        variant="outlined"
        className="p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200"
      >
        <!-- User info -->
        <div class="flex items-center gap-3 mb-4">
          <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 border border-primary/20">
            <span class="font-anton text-base text-primary">
              {{ getInitials(nounu) }}
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-sm font-semibold text-gray-900 font-love truncate">
              {{ getDisplayName(nounu) }}
            </div>
            <div class="text-xs text-gray-500 font-love truncate">
              {{ nounu.user?.email }}
            </div>
          </div>
          <Badge variant="warning" size="md">En attente</Badge>
        </div>

        <!-- Details -->
        <div class="space-y-2 mb-4 text-sm font-love">
          <div v-if="nounu.fullname" class="flex items-center justify-between py-1">
            <span class="text-gray-500 flex items-center gap-2">
              <i class="ri ri-user-line text-primary/70" style="font-size: 14px;"></i>
              Nom complet
            </span>
            <span class="text-gray-900 font-medium text-right truncate ml-2">{{ nounu.fullname }}</span>
          </div>
          <div v-if="nounu.phone" class="flex items-center justify-between py-1">
            <span class="text-gray-500 flex items-center gap-2">
              <i class="ri ri-phone-line text-primary/70" style="font-size: 14px;"></i>
              Téléphone
            </span>
            <span class="text-gray-900 font-medium">{{ nounu.phone }}</span>
          </div>
          <div v-if="nounu.anneesExperience" class="flex items-center justify-between py-1">
            <span class="text-gray-500 flex items-center gap-2">
              <i class="ri ri-timer-line text-primary/70" style="font-size: 14px;"></i>
              Expérience
            </span>
            <span class="text-gray-900 font-medium">{{ nounu.anneesExperience }} an(s)</span>
          </div>
          <div v-if="nounu.tarifHoraire" class="flex items-center justify-between py-1">
            <span class="text-gray-500 flex items-center gap-2">
              <i class="ri ri-coins-line text-primary/70" style="font-size: 14px;"></i>
              Tarif horaire
            </span>
            <span class="text-gray-900 font-medium">{{ nounu.tarifHoraire }} F</span>
          </div>
          <div class="flex items-center justify-between py-1">
            <span class="text-gray-500 flex items-center gap-2">
              <i class="ri ri-calendar-2-line text-primary/70" style="font-size: 14px;"></i>
              Inscrit le
            </span>
            <span class="text-gray-900 font-medium">{{ formatDate(nounu.createdAt) }}</span>
          </div>
        </div>

        <!-- References -->
        <div v-if="nounu.references" class="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
          <div class="text-xs text-amber-700 font-love mb-1 font-medium flex items-center gap-1.5">
            <i class="ri ri-bookmark-line" style="font-size: 14px;"></i>
            Références
          </div>
          <ul v-if="parseReferences(nounu.references).length > 0" class="space-y-2">
            <li
              v-for="(reference, index) in parseReferences(nounu.references)"
              :key="index"
              class="text-sm text-gray-700 font-love"
            >
              <span class="font-medium text-gray-900">{{ reference.fullname || 'Référence' }}</span>
              <span v-if="reference.phone" class="text-gray-500 text-xs block">{{ reference.phone }}</span>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-700 font-love whitespace-pre-wrap break-words">{{ nounu.references }}</p>
        </div>

        <!-- Short bio -->
        <div v-if="nounu.courteBiographie" class="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div class="text-xs text-gray-500 font-love mb-1 font-medium flex items-center gap-1.5">
            <i class="ri ri-bookmark-line" style="font-size: 14px;"></i>
            Biographie
          </div>
          <p class="text-sm text-gray-700 font-love whitespace-pre-wrap break-words">{{ nounu.courteBiographie }}</p>
        </div>

        <!-- Documents -->
        <div v-if="nounu.user?.medias?.length > 0" class="mb-4">
          <div class="text-xs text-gray-500 font-love mb-2 flex items-center gap-1.5">
            <i class="ri ri-file-line text-primary/70" style="font-size: 14px;"></i>
            Documents ({{ nounu.user.medias.length }})
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              v-for="media in nounu.user.medias"
              :key="media.id"
              type="button"
              @click="handleMediaClick(media)"
              class="w-full flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-left hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div class="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <i :class="['ri', getMediaIcon(media), 'text-primary']" style="font-size: 16px;"></i>
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-xs font-medium text-gray-900 font-love truncate">{{ media.originalName }}</div>
                <div class="text-xs text-gray-400 font-love truncate">{{ media.typeMedia?.label || 'Document' }}</div>
              </div>
              <i class="ri ri-popup-line text-gray-400 flex-shrink-0" style="font-size: 12px;"></i>
            </button>
          </div>
        </div>
        <div v-else class="mb-4 text-xs text-gray-400 font-love text-center py-3 bg-gray-50 rounded-lg border border-gray-100">
          <i class="ri ri-file-line" style="font-size: 16px;"></i>
          Aucun document téléversé
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-3 border-t border-gray-100">
          <button
            @click="handleApprove(nounu.id)"
            class="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-green-50 text-green-700 text-sm font-love font-semibold hover:bg-green-100 active:scale-95 transition-all"
          >
            <i class="ri ri-check-line" style="font-size: 16px;"></i>
            Approuver
          </button>
          <button
            @click="handleReject(nounu.id)"
            class="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-50 text-red-600 text-sm font-love font-semibold hover:bg-red-100 active:scale-95 transition-all"
          >
            <i class="ri ri-close-line" style="font-size: 16px;"></i>
            Rejeter
          </button>
        </div>
      </Card>
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-3xl">
      <div class="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
        <i class="ri ri-checkbox-circle-line text-green-500" style="font-size: 40px;"></i>
      </div>
      <p class="text-sm text-gray-900 font-love font-semibold">Aucune certification en attente</p>
      <p class="text-xs text-gray-500 font-love mt-1">Tous les nounus ont été traités</p>
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

  <ImageModal
    :show="showImageModal"
    :src="selectedImageUrl"
    @close="showImageModal = false"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { Card, Badge, ConfirmModal, ImageModal } from '@/components/ui';
import { useConfirmModal } from '@/composables/useConfirmModal';
import { usePullToRefresh } from '@/composables/usePullToRefresh';
import { getMediaIcon, getMediaUrl, isImageMedia, openMedia } from '@/utils/media.utils';
import { parseReferences } from '@/utils/helpers.utils';

const adminStore = useAdminStore();
const { showConfirm, confirmTitle, confirmMessage, confirmIcon, confirmIconBg, confirmIconClass, confirmLabel, confirmBgClass, requestConfirm, onConfirm, onCancel } = useConfirmModal();

const showImageModal = ref(false);
const selectedImageUrl = ref('');

const handleMediaClick = (media: any) => {
  if (isImageMedia(media)) {
    selectedImageUrl.value = getMediaUrl(media);
    showImageModal.value = true;
  } else {
    openMedia(media);
  }
};

const handleApprove = async (id: string) => {
  try {
    await adminStore.certifyNounu(id, 'Approved');
  } catch {
    // error handled in store
  }
};

const handleReject = (id: string) => {
  requestConfirm('Voulez-vous vraiment rejeter cette certification ?', async () => {
    try {
      await adminStore.certifyNounu(id, 'Rejected');
    } catch {
      // error handled in store
    }
  }, { icon: 'close-circle-line', iconBgClass: 'bg-red-50', iconClass: 'text-red-500', confirmLabel: 'Rejeter', confirmBgClass: 'bg-red-500 hover:bg-red-600 shadow-red-200' });
};

const getInitials = (nounu: any) => {
  const name = getDisplayName(nounu);
  return name.substring(0, 2).toUpperCase();
};

const getDisplayName = (nounu: any) => {
  return nounu.fullname || nounu.user?.email?.split('@')[0] || 'Nounu';
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

usePullToRefresh(() => adminStore.fetchPendingNounus());

onMounted(() => {
  adminStore.fetchPendingNounus();
});
</script>
