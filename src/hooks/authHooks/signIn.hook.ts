import { reactive } from "vue";
import { INPUT_ERROR, SIGN_IN } from "@/types/auth.types";
import { signInSchema } from "@/validations/auth/signInAuth.validate";
import authService from "@/services/auth.services";
import { useAuthStore } from "@/stores/auth.store";
import { useProfilStore } from "@/stores/authProfilStore";

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


  const Login = async (data: SIGN_IN) => {
    // Garde anti-double-clic : si une connexion est déjà en cours,
    // on ignore les clics suivants pour éviter les requêtes dupliquées.
    if (state.loading) return;

    const authStore = useAuthStore();
    authStore.clearErrors();
    authStore.setUpdateProfil(false);

    state.in_login = { ...data };
    const validate = signInSchema.safeParse(state.in_login);

    if (!validate.success) {
      authStore.setError('login', {
        path: validate.error.issues[0].path[0].toString(),
        message: validate.error.issues[0].message,
      });
      state.loading = false;
      return;
    }

    state.loading = true;
    try {
      await authService.login(state.in_login);
    } finally {
      state.loading = false;
    }
  }

  return {
    state,
    Login
  };
};
