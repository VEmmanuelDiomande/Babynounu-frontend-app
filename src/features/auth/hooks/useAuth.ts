import { useMutation } from '@tanstack/vue-query';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { StorageUtils } from '@/utils/store.utils';
import { useProfilStore } from '@/stores/authProfilStore';
import { useAuthStore } from '@/stores/auth.store';
import router from '@/routes';
import { SIGN_UP, SIGN_IN } from '@/types/auth.types';

export function useRegister() {
  return useMutation({
    mutationFn: async (signBody: SIGN_UP) => {
      const { data } = await axios.post(URL_API_ROUTE.AUTH_REGISTER, {
        email: signBody.email,
        password: signBody.password,
        role: 'user',
        type_profil: signBody.type === "open-modal-auth-profil-parent" ? 'parent' : 'nounu',
      });
      return data;
    },
    onSuccess: async (data) => {
      if (data.user.access_token) {
        const storageUtils = StorageUtils();
        await Promise.all([
          storageUtils.setStore("nUser_Id", data.user.id),
          storageUtils.setStore("nToken", data.user.access_token),
          storageUtils.setStore("nRefreshToken", data.user.refresh_token),
          storageUtils.setStore("nType_Profil", data.user.type_profil.slug),
        ]);

        useProfilStore().state.activeMenu_typeOfProfil = data.user.type_profil.description;

        const profileRoute = data.user.type_profil.slug === "parent"
          ? { name: "AUTH_PROFILE_PARENT" }
          : { name: "AUTH_PROFILE_NOUNU" };
        router.push(profileRoute);
      }
    },
    onError: (error: any) => {
      if (error?.response?.data?.statusCode === 400) {
        const authStore = useAuthStore();
        const message = Array.isArray(error?.response.data.message)
          ? error?.response.data.message[0].message
          : error?.response.data.message;

        authStore.setError('general', {
          path: 'email',
          message: message || "Une erreur est survenue lors de l'inscription",
        });
      }
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (signInBody: SIGN_IN) => {
      const { data } = await axios.post(URL_API_ROUTE.AUTH_LOGIN, {
        email: signInBody.email,
        password: signInBody.password,
      });
      return data;
    },
    onSuccess: async (data) => {
      if (data.user.access_token) {
        const storageUtils = StorageUtils();
        storageUtils.setStore("nUser_Id", data.user?.id);
        storageUtils.setStore("nToken", data.user?.access_token);
        storageUtils.setStore("nRefreshToken", data.user?.refresh_token);
        storageUtils.setStore("nType_Profil", data.user?.type_profil?.slug);
        storageUtils.setStore("nRole", data.user?.role?.slug);

        if (data.user?.role?.slug === "admin" || data.user.profil.length !== 0) {
          if (data.user?.role?.slug === "admin") {
            await storageUtils.setStore("nAdmin_Id", data.user?.id);
          } else {
            await storageUtils.setStore("nProfil_1_Id", data.user?.profil[0]?.id.toString());
          }
          
          const toRedirect = data.user?.role?.slug === "admin" ? "/admin" : 
                          data.user?.type_profil?.slug === "parent" ? "/home/nounus" : "/home/jobs";
          await storageUtils.setStore("nPageType", toRedirect);
          location.assign(toRedirect);
        } else {
          useProfilStore().state.activeMenu_typeOfProfil = data.user.type_profil.description;
          const profileRoute = data.user.type_profil.slug === "parent"
            ? { name: "AUTH_PROFILE_PARENT" }
            : { name: "AUTH_PROFILE_NOUNU" };
          router.push(profileRoute);
        }
      }
    },
    onError: (error: any) => {
      const authStore = useAuthStore();
      const message = Array.isArray(error?.response?.data?.message)
        ? error?.response?.data?.message[0].message
        : error?.response?.data?.message;

      authStore.setError('login', {
        path: 'email',
        message: message || 'Une erreur est survenue lors de la connexion',
      });
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const storageUtils = StorageUtils();
      const nToken = await storageUtils.getStore('nToken');
      if (nToken?.value) {
        await axios.post(URL_API_ROUTE.AUTH_LOGOUT, {}, {
          headers: { Authorization: `Bearer ${nToken.value}` },
        });
      }
    },
    onSettled: async () => {
      const storageUtils = StorageUtils();
      storageUtils.removeStore("nUser_Id");
      storageUtils.removeStore("nToken");
      storageUtils.removeStore("nRefreshToken");
      storageUtils.removeStore("nType_Profil");
      storageUtils.removeStore("nRole");
      storageUtils.removeStore("nAdmin_Id");
      storageUtils.removeStore("nProfil_1_Id");
      storageUtils.removeStore("nPageType");
      localStorage.removeItem("user");
    },
  });
}

export function usePasswordReset() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post(URL_API_ROUTE.PASSWORD_RESET, { email });
      return response.data;
    },
  });
}

export function usePasswordResetConfirm() {
  return useMutation({
    mutationFn: async (data: { code: string; password: string }) => {
      const response = await axios.post(URL_API_ROUTE.PASSWORD_RESET_CONFIRM, data);
      return response.data;
    },
  });
}

export function useSendMail() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post(URL_API_ROUTE.SEND_MAIL, { email });
      return response.data;
    },
  });
}
