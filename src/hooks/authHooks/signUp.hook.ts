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
        name: "Ménagère",
        actived: false,
        openModalID: "open-modal-auth-profil-nounu",
      },
      {
        name: "Cuisinière",
        actived: false,
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

  const authStore = useAuthStore();

  const Register = (data: SIGN_UP) => {
    // Garde anti-double-clic : si une inscription est déjà en cours,
    // on ignore les clics suivants pour éviter les requêtes dupliquées.
    if (state.loading) return;
    state.loading = true;

    // Préparer les données d'inscription
    const registrationData = {
      ...data,
      email: authStore.email,
      type: useProfilStore().state.activeMenu_typeOfProfil
    };

    // Utiliser l'action du store pour définir les données d'inscription
    authStore.setRegistration(registrationData);

    const validate = signUpSchema.safeParse(authStore.registration);
    authStore.setUpdateProfil(false)

    if (!validate.success) {
      useAuthStore().setError('general', {
        path: validate.error.issues[0].path[0].toString(),
        message: validate.error.issues[0].message,
      });
      state.loading = false;
      return;
    }

    authService
      .register(authStore.registration)
      .then(() => {})
      .finally(() => {
        state.loading = false;
      });

    authStore.clearErrors();
  };

  const ToggleActiveMenu_typeOfProfil = (index: number) => {
    state.type_of_profil.forEach((menu, i) => {
      menu.actived = i === index;

      if (menu.actived) {
        authStore.setRegistration({ type: menu?.openModalID });
        useProfilStore().state.activeMenu_typeOfProfil = menu?.openModalID;
      }
    });
  };

  return {
    state,
    Register,
    ToggleActiveMenu_typeOfProfil,
  };
};
