import { reactive } from "vue";
import { INPUT_ERROR, SIGN_IN } from "@/types/auth.types";
import { signInSchema } from "@/validations/auth/signInAuth.validate";
import authService from "@/services/auth.services";
import { useAuthStore } from "@/stores/auth.store";

export const useAuthSignInHook = () => {
  const state = reactive({
    activeMenu_typeOfProfil: "",
    loading: false,
    in_login: reactive(<SIGN_IN>{
      email: "",
      password: ""
    }),
    in_error_login: reactive(<INPUT_ERROR>{
      path: "",
      message: ""
    }),
  });


  const Login = (data: SIGN_IN) => {
    state.loading = true;
    state.in_login = data;
    const validate = signInSchema.safeParse(state.in_login);
  
    if (!validate.success) {
      useAuthStore().state.in_error_login = {
        path: validate.error.issues[0].path[0].toString(),
        message: validate.error.issues[0].message,
      };
      state.loading = false;
      return;
    }

    authService.login(data).then(() => { }).finally(() => {
      state
      state.loading = false;
    })

    useAuthStore().state.in_error_login = {
      path: "",
      message: "",
    };
  }

  return {
    state,
    Login
  };
};
