import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";

export const SettingServices = () => {
  const listSetting = async (Route: string) => {
    const nToken = await StorageUtils().getStore("nToken");
    const response = await fetch(Route, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${nToken.value}`, // Ajout du token ici
      },
    });
    if (!response.ok) throw new Error("Erreur lors du chargement des données");
    return response.json();
  };

  const createSetting = async (Route: string, data: any) => {
    const nToken = await StorageUtils().getStore("nToken");
    const response = await fetch(Route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${nToken.value}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData?.message || "Erreur serveur");
    }

    return responseData;
  };

  const useCreateSetting = async (
    Route: string,
    data: object,
    isLoading: Boolean
  ) => {
    isLoading = true;
    const nToken = await StorageUtils().getStore("nToken");
    const response = await fetch(Route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${nToken.value}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok)
      return {
        data: null,
        isLoading: false,
        isError: true,
      };

    isLoading = false;
    return {
      data: response.json(),
      isLoading: isLoading,
      isError: false,
    };
  };

  return {
    listSetting,
    createSetting,
    useCreateSetting
  };
};
