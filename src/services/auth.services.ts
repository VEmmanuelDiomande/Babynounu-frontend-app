// Suggested code may be subject to a license. Learn more: ~LicenseLog:539354115.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2855982395.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:1062531434.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3611360388.
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import axios from "axios";
import { ApiServices } from "./api.services";
import { SIGN_UP } from "@/types/auth.types";
import { StorageUtils } from "@/utils/store.utils";
import { SIGN_IN } from "../types/auth.types";
import { useAuthSignUpHook } from "@/hooks/authHooks/signUp.hook";
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";
import { useProfilStore } from "@/stores/authProfilStore";

const { CreateService } = ApiServices();

const router = useRouter();

const TypeProfil = computed(() => {
  return useAuthSignUpHook().state.activeMenu_typeOfProfil;
});

const register = async (signBody: SIGN_UP) => {
  try {
    let OpenModal: any = document.querySelector(`#open-modal-auth-profil`);

    const { data } = await CreateService(URL_API_ROUTE.AUTH_REGISTER, {
      email: signBody.email,
      password: signBody.password,
      role: 2,
      type_profil: signBody.type == "open-modal-auth-profil-nounu" ? 2 : 1,
    });
    if (data.user.access_token) {
      // here you can redirect
      await Promise.all([
        StorageUtils().setStore("nUser_Id", data.user.id),
        StorageUtils().setStore("nToken", data.user.access_token),
        StorageUtils().setStore("nType_Profil", data.user.type_profil.id),
      ]);
      useProfilStore().state.activeMenu_typeOfProfil =
        data.user.type_profil.description;
      OpenModal.click();
      // localStorage.setItem("user", JSON.stringify(data));
      // location.assign("/home");
    }
    return data;
  } catch (error: any) {
    if (error?.response?.data?.statusCode == 400) {
      if (Array.isArray(error?.response.data.message)) {
        useAuthStore().state.in_error.path = "email";
        useAuthStore().state.in_error.message =
          error?.response.data.message[0].message;
      } else {
        useAuthStore().state.in_error.path = "email";
        useAuthStore().state.in_error.message = error?.response.data.message;
      }
    }
  }
};

const login = async (signInBody: SIGN_IN) => {
  try {
    let OpenModal: any = document.querySelector(`#open-modal-auth-profil`);
    const { data } = await CreateService(URL_API_ROUTE.AUTH_LOGIN, {
      email: signInBody.email,
      password: signInBody.password,
    });

    if (data.user.access_token) {
      // here you can redirect

      StorageUtils().setStore("nUser_Id", data.user?.id);
      StorageUtils().setStore("nToken", data.user?.access_token);
      StorageUtils().setStore("nType_Profil", data.user?.type_profil?.id.toString());
    
      
      

      if (data.user.profil) {
        await StorageUtils().setStore("nProfil_1_Id", data.user?.profil?.id);
        location.assign("/choose-destination-to-start");
      } else {
        useProfilStore().state.activeMenu_typeOfProfil =
          data.user.type_profil.description;
        OpenModal.click();
        return;
      }
    }
    return data;
  } catch (error: any) {
    console.log(
      error?.response.data.message,
      Array.isArray(error?.response.data.message)
    );
    if (Array.isArray(error?.response.data.message)) {
      useAuthStore().state.in_error_login.path = "email";
      useAuthStore().state.in_error_login.message =
        error?.response.data.message[0].message;
    } else {
      useAuthStore().state.in_error_login.path = "email";
      useAuthStore().state.in_error_login.message =
        error?.response.data.message;
    }
  }
};

const logout = (): void => {
  localStorage.removeItem("user");
};

const passwordForget = async (email: string): Promise<any> => {
  return axios.post(URL_API_ROUTE.AUTH_LOGIN, {
    email,
  });
};

const sendMail = async (email: string): Promise<any> => {
  return axios.post(URL_API_ROUTE.AUTH_LOGIN, {
    email,
  });
};

const authService = {
  register,
  login,
  logout,
  passwordForget,
  sendMail,
};

export default authService;
