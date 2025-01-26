import { reactive } from "vue";

export const useMessagerieHook = () => {
  const state = reactive({});

  return {
    state,
  };
};
