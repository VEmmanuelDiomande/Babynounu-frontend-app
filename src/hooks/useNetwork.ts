import { reactive } from "vue";

export const useNetwork = () => {
  const state = reactive({});
  const isOnline = () => {
    return navigator.onLine
  };

  return {
    state,
    isOnline
  };
};