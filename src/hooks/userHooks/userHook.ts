import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { authentificateApp } from "@/routes/authenticate/authorization.authenticate";
import { ApiServices } from "@/services/api.services";
import { useUserStore } from "@/stores/user.store";
import { StorageUtils } from "@/utils/store.utils";
import { reactive } from "vue";

export const useUserHook = () => {
  const state = reactive({});

  const isUserLogged = async () => {
    await authentificateApp();
    if (
      useUserStore().isLogged == false &&
      ((await StorageUtils().getStore("nToken")).value != null &&
        (await StorageUtils().getStore("nProfil_1_Id")).value != null)
    ) {
      useUserStore().isLogged = true;
    }
  };


  const isAdminLogged = async () => {
    await authentificateApp();
    if (
      useUserStore().isAdmin == false &&
      ((await StorageUtils().getStore("nToken")).value != null &&
        (await StorageUtils().getStore("nAdmin_Id")).value != null)
    ) {
      useUserStore().isAdmin = true;
    }
  };


  const isVerifyUserConnected = async () => {
    return (await StorageUtils().getStore("nUser_Id")).value
  }


  return {
    state,
    isUserLogged,
    isVerifyUserConnected,
    isAdminLogged
  };
};
