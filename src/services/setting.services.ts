import { URL_API_ROUTE } from "@/routes/_requests/index.request";

export const SettingServices = () => {
  const listSetting = async (Route:string) => {
    const response = await fetch(Route);
    if (!response.ok) throw new Error("Erreur lors du chargement des données");
    return response.json();
  };

  return {
    listSetting
  }
};
