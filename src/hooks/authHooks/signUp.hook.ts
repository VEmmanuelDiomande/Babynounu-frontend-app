import { useAuthStore } from "./../../stores/auth.store";
import { reactive, ref } from "vue";
import { INPUT_ERROR, SIGN_UP } from "@/types/auth.types";
import { signInSchema } from "@/validations/auth/signInAuth.validate";

import authService from "@/services/auth.services";
import { signUpSchema } from "@/validations/auth/signUpAuth.validate";
import { useProfilStore } from "@/stores/authProfilStore";

export const useAuthSignUpHook = () => {
  const state = reactive({
    loading: false,
    type_of_profil: [
      {
        name: "Nounu",
        actived: true,
        openModalID: "open-modal-auth-profil-nounu",
      },
      {
        name: "Parents",
        actived: false,
        openModalID: "open-modal-auth-profil-parent",
      },
    ],
    activeMenu_typeOfProfil: "",
    OpenModalNounuID: "open-modal-auth-profil-nounu",
    OpenModalParentID: "open-modal-auth-profil-parent",
  });

  const { state: authState } = useAuthStore();

  const Register = (data: SIGN_UP) => {
    state.loading = true;
    authState.in_register = data;
    authState.in_register.email = useAuthStore().state.email;
    console.log(authState.in_register);
    authState.in_register.type = useProfilStore().state.activeMenu_typeOfProfil;
    const validate = signUpSchema.safeParse(authState.in_register);
    useAuthStore().isUpdateProfil = false

    if (!validate.success) {
      useAuthStore().state.in_error = {
        path: validate.error.issues[0].path[0].toString(),
        message: validate.error.issues[0].message,
      };
      state.loading = false;
      return;
    }

    authService
      .register(authState.in_register)
      .then(() => {})
      .finally(() => {
        state.loading = false;
      });

    useAuthStore().state.in_error = {
      path: "",
      message: "",
    };
  };

  const ToggleActiveMenu_typeOfProfil = (index: number) => {
    state.type_of_profil.forEach((menu, i) => {
      menu.actived = i === index;

      if (menu.actived) {
        useAuthStore().state.in_register.type = menu?.openModalID;
        useProfilStore().state.activeMenu_typeOfProfil =
          i == 0
            ? "open-modal-auth-profil-nounu"
            : "open-modal-auth-profil-parent";
      }
    });
  };

  return {
    state,
    Register,
    ToggleActiveMenu_typeOfProfil,
  };
};
