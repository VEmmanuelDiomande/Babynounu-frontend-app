import { reactive } from "vue";

export const useSignRedirectHook = () => {
  const state = reactive({ });


  const GlobalRedirect = (Router:any, RouteName:any) => {
     Router?.push({name: RouteName})
     const closeModalToRedirectAuthModal = document.querySelector("#closeModalToRedirectAuthModal") as HTMLElement;
     if (closeModalToRedirectAuthModal) {
       closeModalToRedirectAuthModal.click();
     }
  }

  return {
    state,
    GlobalRedirect
  };
};
