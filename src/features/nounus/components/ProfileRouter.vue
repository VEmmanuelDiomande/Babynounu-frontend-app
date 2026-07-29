<template>
  <component :is="profileComponent" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { StorageUtils } from '@/utils/store.utils';

const NounuProfileViewPage = defineAsyncComponent(() =>
  import('@/features/nounus/pages/NounuProfileViewPage.vue')
);
const ParentProfileViewPage = defineAsyncComponent(() =>
  import('@/features/nounus/pages/ParentProfileViewPage.vue')
);

const userType = ref<string | null>(null);
const loading = ref(true);

const profileComponent = computed(() => {
  if (loading.value) return null;
  return userType.value === 'parent' ? ParentProfileViewPage : NounuProfileViewPage;
});

onMounted(async () => {
  const [typeResult, pageTypeResult, roleResult] = await Promise.all([
    StorageUtils().getStore('nType_Profil'),
    StorageUtils().getStore('nPageType'),
    StorageUtils().getStore('nRole'),
  ]);
  const typeProfil = typeResult?.value || null;
  const pageType = pageTypeResult?.value || null;
  const role = roleResult?.value || null;

  if (pageType === '/home/jobs' || typeProfil === 'nounu' || typeProfil === 'prestataire' || role === 'nounou') {
    userType.value = 'nounu';
  } else if (pageType === '/home/nounus' || typeProfil === 'parent' || typeProfil === 'client' || role === 'parent') {
    userType.value = 'parent';
  } else {
    userType.value = 'nounu';
  }
  loading.value = false;
});
</script>
