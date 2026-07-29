<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="font-anton text-xl text-gray-900">Annonces (Jobs)</h2>
      <p class="text-sm text-gray-500 font-love mt-1">
        <span class="inline-flex items-center gap-1.5">
          <span class="h-2 w-2 rounded-full bg-primary"></span>
          {{ adminStore.jobsTotal }} annonce(s) au total
        </span>
      </p>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Cards -->
    <div v-else-if="adminStore.jobs.length > 0" class="space-y-3">
      <div
        v-for="job in adminStore.jobs"
        :key="job.id"
        class="bg-white rounded-2xl border border-primary/10 overflow-hidden hover:border-primary/30 transition-all shadow-sm"
      >
        <div class="p-4">
          <div class="flex items-start gap-3 mb-3">
            <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="ri ri-briefcase-line text-primary" style="font-size: 18px;"></i>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ job.titre }}</div>
              <div class="text-xs text-gray-500 font-love truncate">{{ job.description?.substring(0, 60) }}...</div>
            </div>
            <span v-if="job.suspended" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-orange-50 text-orange-700">
              <span class="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
              Suspendue
            </span>
            <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-green-50 text-green-700">
              <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Active
            </span>
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-500 font-love mb-3">
            <span class="flex items-center gap-1">
              <i class="ri ri-user-line" style="font-size: 14px;"></i>
              {{ job.user?.email || '—' }}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri ri-coins-line" style="font-size: 14px;"></i>
              {{ job.tarifPropose || '—' }}
            </span>
            <span v-if="job.missionUrgente" class="flex items-center gap-1 text-red-600">
              <i class="ri ri-alarm-warning-line" style="font-size: 14px;"></i>
              Urgente
            </span>
            <span v-if="job.priority > 0" class="flex items-center gap-1 text-amber-600">
              <i class="ri ri-star-fill" style="font-size: 14px;"></i>
              {{ job.priority }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="openJobDetail(job)"
              class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-primary bg-primary/5 hover:bg-primary/10 active:scale-95 transition-all"
            >
              <i class="ri ri-information-line" style="font-size: 14px;"></i>
              Détails
            </button>
            <button @click="handleToggleSuspend(job)" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all">
              {{ job.suspended ? 'Réactiver' : 'Suspendre' }}
            </button>
            <button @click="handlePrioritize(job)" class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 active:scale-95 transition-all">
              <i class="ri ri-star-fill" style="font-size: 14px;"></i>
            </button>
            <button @click="handleDelete(job.id)" class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all">
              <i class="ri ri-delete-bin-line" style="font-size: 14px;"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div class="flex items-center justify-center pt-2">
        <button @click="loadMore" :disabled="adminStore.jobs.length < limit" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-primary bg-white border border-primary/10 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <i class="ri ri-add-line" style="font-size: 16px;"></i>
          Voir plus
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-3xl">
      <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <i class="ri ri-briefcase-line text-primary/50" style="font-size: 32px;"></i>
      </div>
      <p class="text-sm text-gray-900 font-love font-semibold">Aucune annonce trouvée</p>
      <p class="text-xs text-gray-500 font-love mt-1">Les nouvelles annonces apparaîtront ici</p>
    </div>

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

  <Drawer :show="showJobDetail" title="Détail de l'annonce" maxHeight="90vh" @close="closeJobDetail">
    <div v-if="adminStore.isLoading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
    </div>

    <div v-else-if="adminStore.jobDetail" class="space-y-4">
      <div class="flex items-start gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
        <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <i class="ri ri-briefcase-line text-primary" style="font-size: 18px;"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ adminStore.jobDetail.titre }}</div>
          <div class="text-xs text-gray-500 font-love truncate">{{ adminStore.jobDetail.user?.email }}</div>
        </div>
        <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love', adminStore.jobDetail.suspended ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700']">
          <span :class="['h-1.5 w-1.5 rounded-full', adminStore.jobDetail.suspended ? 'bg-orange-500' : 'bg-green-500']"></span>
          {{ adminStore.jobDetail.suspended ? 'Suspendue' : 'Active' }}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
          <div class="text-xs text-gray-500 font-love mb-1">Tarif proposé</div>
          <div class="text-xs sm:text-sm font-semibold text-gray-900 font-love">{{ adminStore.jobDetail.tarifPropose || '—' }} {{ adminStore.jobDetail.tarifPropose ? 'F' : '' }}</div>
        </div>
        <div class="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
          <div class="text-xs text-gray-500 font-love mb-1">Négo.</div>
          <div class="text-xs sm:text-sm font-semibold text-gray-900 font-love">{{ adminStore.jobDetail.negociable ? 'Oui' : 'Non' }}</div>
        </div>
        <div class="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
          <div class="text-xs text-gray-500 font-love mb-1">Début</div>
          <div class="text-xs sm:text-sm font-semibold text-gray-900 font-love">{{ adminStore.jobDetail.dateDebut || '—' }}</div>
        </div>
        <div class="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
          <div class="text-xs text-gray-500 font-love mb-1">Période</div>
          <div class="text-xs sm:text-sm font-semibold text-gray-900 font-love">{{ adminStore.jobDetail.periode || '—' }}</div>
        </div>
      </div>

      <div v-if="adminStore.jobDetail.description" class="p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div class="text-xs text-gray-500 font-love mb-1 font-medium">Description</div>
        <p class="text-sm text-gray-700 font-love whitespace-pre-wrap break-words">{{ adminStore.jobDetail.description }}</p>
      </div>

      <div v-if="adminStore.jobDetail.descriptionComplementaire" class="p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div class="text-xs text-gray-500 font-love mb-1 font-medium">Description complémentaire</div>
        <p class="text-sm text-gray-700 font-love whitespace-pre-wrap break-words">{{ adminStore.jobDetail.descriptionComplementaire }}</p>
      </div>

      <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div class="text-xs text-gray-500 font-love mb-1 font-medium">Moyens de contact</div>
        <p class="text-sm text-gray-700 font-love whitespace-pre-wrap break-words">{{ adminStore.jobDetail.moyensDeContact || '—' }}</p>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="bg-gray-50 rounded-xl p-2.5 border border-gray-100 flex flex-col justify-center">
          <div class="text-xs text-gray-500 font-love mb-1">Nombres d'enfants</div>
          <div class="text-sm font-semibold text-gray-900 font-love">{{ adminStore.jobDetail.nombreEnfants || '—' }}</div>
        </div>
        <div class="bg-gray-50 rounded-xl p-2.5 border border-gray-100 flex flex-col justify-center">
          <div class="text-xs text-gray-500 font-love mb-1">Expérience requise</div>
          <div class="text-sm font-semibold text-gray-900 font-love">{{ adminStore.jobDetail.experienceMinimun ? (adminStore.jobDetail.anneeExperience || 'Oui') : 'Non' }}</div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span v-if="adminStore.jobDetail.missionUrgente" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-red-50 text-red-700">
          <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
          Urgente
        </span>
        <span v-if="adminStore.jobDetail.inclusWeekend" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-blue-50 text-blue-700">
          <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          Weekend inclus
        </span>
        <span v-if="adminStore.jobDetail.priority > 0" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-amber-50 text-amber-700">
          <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
          Priorité {{ adminStore.jobDetail.priority }}
        </span>
      </div>

      <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div class="text-xs text-gray-500 font-love mb-2 font-medium">Créée le</div>
        <div class="text-sm font-love text-gray-900">{{ formatDate(adminStore.jobDetail.createdAt) }}</div>
      </div>
    </div>

    <div v-else class="text-sm text-gray-500 font-love text-center py-8">
      Aucune information disponible
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { ConfirmModal, Drawer } from '@/components/ui';
import { useConfirmModal } from '@/composables/useConfirmModal';
import { usePullToRefresh } from '@/composables/usePullToRefresh';

const adminStore = useAdminStore();
const { showConfirm, confirmTitle, confirmMessage, confirmIcon, confirmIconBg, confirmIconClass, confirmLabel, confirmBgClass, requestConfirm, onConfirm, onCancel } = useConfirmModal();
const currentPage = ref(1);
const limit = 20;
const showJobDetail = ref(false);
const selectedJob = ref<any>(null);

const handleDelete = (id: number) => {
  requestConfirm('Voulez-vous vraiment supprimer cette annonce ?', async () => {
    try { await adminStore.removeJob(id); } catch { /* error in store */ }
  }, { icon: 'delete-bin-line', iconBgClass: 'bg-red-50', iconClass: 'text-red-500', confirmBgClass: 'bg-red-500 hover:bg-red-600 shadow-red-200' });
};

const handleToggleSuspend = (job: any) => {
  const next = !job.suspended;
  const message = next ? 'suspendre' : 'réactiver';
  requestConfirm(`Voulez-vous vraiment ${message} cette annonce ?`, async () => {
    try { await adminStore.suspendJob(job.id, next); } catch { /* error in store */ }
  }, { icon: next ? 'pause-line' : 'play-line', iconBgClass: next ? 'bg-orange-50' : 'bg-green-50', iconClass: next ? 'text-orange-500' : 'text-green-500', confirmLabel: next ? 'Suspendre' : 'Réactiver', confirmBgClass: next ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' : 'bg-green-500 hover:bg-green-600 shadow-green-200' });
};

const handlePrioritize = async (job: any) => {
  const next = job.priority > 0 ? 0 : 10;
  try { await adminStore.prioritizeJob(job.id, next); } catch { /* error in store */ }
};

const openJobDetail = (job: any) => {
  selectedJob.value = job;
  showJobDetail.value = true;
  adminStore.fetchJob(job.id);
};

const closeJobDetail = () => {
  showJobDetail.value = false;
  selectedJob.value = null;
  adminStore.jobDetail = null;
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const loadMore = () => { currentPage.value++; adminStore.fetchJobs(currentPage.value, limit); };

usePullToRefresh(() => adminStore.fetchJobs(currentPage.value, limit));

onMounted(() => { adminStore.fetchJobs(currentPage.value, limit); });
</script>
