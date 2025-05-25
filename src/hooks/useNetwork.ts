import { reactive } from "vue";

export const useNetwork = () => {
  const state = reactive({});
  const isOnline = () => {
    console.log(navigator);
    return navigator.onLine
  };

  return {
    state,
    isOnline
  };
};