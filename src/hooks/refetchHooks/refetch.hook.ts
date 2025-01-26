

  import { URL_API_ROUTE } from "@/routes/_requests/index.request";
  import { authentificateApp } from "@/routes/authenticate/authorization.authenticate";
  import { ApiServices } from "@/services/api.services";
  import { useUserStore } from "@/stores/user.store";
  import { StorageUtils } from "@/utils/store.utils";
  import { reactive } from "vue";
  
  export const useRefetchHook = () => {
    const state = reactive({});
  
    const handleRefresh = async (event: any, refetch:any) => {
      try {
        // isRefreshing.value = true;
        await refetch(); // Trigger refetching of data
      } catch (error) {
        console.error("Error during refresh:", error);
      } finally {
        event.target.complete(); // Signal Ionic refresher to complete
        // isRefreshing.value = false;
      }
    };

    return {
      state,
      handleRefresh,
    };
  };
  