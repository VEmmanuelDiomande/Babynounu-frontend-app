import { reactive } from "vue";

export const useSignRedirectHook = () => {
  const state = reactive({ });


  const GlobalRedirect = (Router:any, RouteName:any) => {
     Router?.push({name: RouteName})
  }

  return {
    state,
    GlobalRedirect
  };
};
