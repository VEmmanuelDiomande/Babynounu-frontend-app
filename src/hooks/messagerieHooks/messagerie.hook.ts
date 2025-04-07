import { reactive } from "vue";

export const useMessagerieHook = () => {
  const state = reactive({});

  const handleRefresh = async (event: any, refetch: any) => {
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
  };
};
