import { reactive } from "vue";

export const useNavigateGoBackHook = () => {

  const state = reactive({})

    // Last Page
  const GoBack = (router:any) => {
     router.go(-1)
  }

  return {
    state,
    GoBack
  };
};
