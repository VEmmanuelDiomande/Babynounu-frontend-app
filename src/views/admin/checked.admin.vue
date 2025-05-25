<template>
  <IonPage>
    <IonContent class="font-love">
      <!-- Pull to refresh component -->
      <IonRefresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <IonRefresherContent />
      </IonRefresher>

      <!-- Header with search functionality -->
      <HeaderMenuLayout
        Title="Identity Verification"
        PlaceholderSearch="Search messages"
        :countScroll="scrollAdminCount"
      >
        <template v-slot:ContentSearchUp>
          <input
            type="text"
            placeholder="Search..."
            class="h-11 outline-none font-love text-base w-full bg-transparent border-5"
            v-model="searchQueryAdminChecked"
            @keyup.enter="handleSearch"
          />
        </template>
      </HeaderMenuLayout>

      <!-- Content section with conditional rendering -->
      <PageLoader
        class-custom="h-[100vh] fixed inset-0"
        size="large"
        v-if="isLoadingAdminChecked"
      />
      
      <div v-else-if="dataAdminChecked?.length" class="flex flex-col mx-4 gap-4 divide-y-[1px] pb-16">
        <div v-for="item in dataAdminChecked" :key="item.id">
          <CardAdminChecked
            :data="item"
            :updateValidation="handleValidationUpdate"
            :updateRejection="handleValidationRejete"
          />
        </div>
      </div>

      <EmptyError
        v-else-if="!isErrorAdminChecked && !dataAdminChecked?.length"
        nameIcons="RiPassValidLine"
        heading="No Nannies Registered"
        subHeading="No nannies registered. Here you can validate nanny identities."
      />

      <E404Error v-if="isErrorAdminChecked" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/vue";
import { SocketService } from "@/services/socket.services";
import { useQuery } from "@tanstack/vue-query";
import { Toast } from "@capacitor/toast";

// Component imports
import PageLoader from "@/components/loaders/pageLoader.vue";
import EmptyError from "@/components/errors/empty.error.vue";
import E404Error from "@/components/errors/e404.error.vue";
import CardAdminChecked from "./_partials/CardAdminChecked.vue";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";

// Initialize services
const socketService = new SocketService();
const { createSetting } = SettingServices();

// State management
const searchQueryAdminChecked = ref("");
const scrollAdminCount = ref(0);
const isLoadingUpdate = ref(false);

/**
 * Fetches uncertified nannies from the API
 * @returns Promise with nanny data
 */
const fetchUncertifiedNannies = async () => {
  try {
    const response = await SettingServices().listSetting(URL_API_ROUTE.NOUNU_CERTIFICATE_NOT_ALL);
    return response || [];
  } catch (error) {
    console.error('Error fetching uncertified nannies:', error);
    throw error;
  }
};

// Query configuration using TanStack Query
const {
  refetch,
  data: dataAdminChecked,
  isLoading: isLoadingAdminChecked,
  isError: isErrorAdminChecked,
} = useQuery({
  queryKey: ["AdminChecked"],
  queryFn: fetchUncertifiedNannies,
  retry: 2,
  refetchOnWindowFocus: false,
});

/**
 * Handles the search functionality
 */
const handleSearch = () => {
  if (searchQueryAdminChecked.value.trim()) {
    // socketService.searchAdminCehcked?.(searchQueryAdminChecked.value);
  }
};

/**
 * Handles the refresh event
 * @param event - Refresh event object
 */
const handleRefresh = async (event: CustomEvent) => {
  try {
    await refetch();
  } finally {
    event.detail.complete();
  }
};
/**
 * Handles certification validation status updates
 * @param id - Nanny ID to process
 * @param type - Type of validation ('approve' or 'reject')
 */
const handleValidationStatus = async (id: string, type: 'approve' | 'reject') => {
  try {
    isLoadingUpdate.value = true;
    
    const endpoint = type === 'approve' 
      ? URL_API_ROUTE.NOUNU_APPROVE_CERTIFICATION
      : URL_API_ROUTE.NOUNU_REJECT_CERTIFICATION;
    
    const response = await createSetting(`${endpoint}/${id}`, {});

    if (response) {
      await Toast.show({
        text: `${type === 'approve' ? 'Validation' : 'Rejection'} successful`,
        duration: "long",
      });
      await refetch();
    }
  } catch (error) {
    console.error(`${type} update error:`, error);
    await Toast.show({
      text: `${type === 'approve' ? 'Validation' : 'Rejection'} failed`,
      duration: "long",
    });
  } finally {
    isLoadingUpdate.value = false;
  }
};

/**
 * Updates the certification validation status
 * @param id - Nanny ID to validate
 */
const handleValidationUpdate = async (id: string) => {
  await handleValidationStatus(id, 'approve');
};

/**
 * Handles the rejection of certification validation
 * @param id - Nanny ID to reject
 */
const handleValidationRejete = async (id: string) => {
  await handleValidationStatus(id, 'reject');
};


// Lifecycle hooks
onMounted(() => {
  // Add any initialization logic here
});
</script>
