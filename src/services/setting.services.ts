import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import axios, { AxiosError } from "axios";

// Définition des types pour améliorer la sécurité du code
interface ApiResponse<T = any> {
  data: T;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

export const SettingServices = () => {
  // Fonction utilitaire pour obtenir les en-têtes d'authentification
  const getAuthHeaders = async () => {
    const nToken = await StorageUtils().getStore("nToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${nToken.value}`,
    };
  };

  const listSetting = async (Route: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(Route, { headers });
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du chargement des données");
    }
  };

  const createSetting = async (Route: string, data: any): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(Route, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur serveur");
    }
  };

  const useCreateSetting = async <T = any>(
    Route: string,
    data: object
  ): Promise<ApiResponse<T>> => {
    let isLoading = true;
    
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(Route, data, { headers });
      
      return {
        data: response.data,
        isLoading: false,
        isError: false,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        data: null as unknown as T,
        isLoading: false,
        isError: true,
        errorMessage: (axiosError.response?.data as { message?: string })?.message || "Erreur serveur",
      };
    }
  };

  return {
    listSetting,
    createSetting,
    useCreateSetting,
  };
};
