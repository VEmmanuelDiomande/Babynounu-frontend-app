import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useAuthStore } from "@/stores/auth.store";
import { useProfilStore } from "@/stores/authProfilStore";
import { useNounuStore } from "@/stores/nounu.store";
import { StorageUtils } from "@/utils/store.utils";
import axios, { AxiosError, AxiosResponse } from "axios";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

// Types ------------------------------------------------------------------------
interface ParentProfilePayload {
  fullname: string;
  adresse_mail: string;
  phone: string;
  number_of_children: string;
  besions_specifiques: string[];
  garde_enfants: string[];
  aide_menagere: string[];
  frequence_des_services: string[];
  horaire_souhaites: string[];
  adress: string[];
  zone_geographique_prestataire: string[];
  budget_estimated: string;
  competance_specifique: string[];
  langue_parler: string[];
  disponibility_du_prestataire: string[];
  mode_de_paiement: string[];
  informations_complementaires: string;
  userId: string;
}

interface ApiResponse {
  id: string;
  [key: string]: any;
}

// Constants --------------------------------------------------------------------
const STORAGE_KEYS = {
  USER: "nUser_Id",
  PROFILE: "nProfil_1_Id",
} as const;

const CONTENT_TYPE_HEADER = "multipart/form-data";

// Composition API -------------------------------------------------------------
export const useParentHook = () => {
  const router = useRouter();
  const state = reactive({
    loading: false,
    error: null as string | null,
    success: false,
  });

  /**
   * Récupère le store du profil parent
   * @returns Le state du store profil
   */
  const getProfilStore = () => useProfilStore().state;

  /**
   * Récupère une valeur depuis le stockage local
   * @param key Clé de stockage
   * @returns Valeur stockée
   */
  const getStorageValue = async (key: string): Promise<string> => {
    const result = await StorageUtils().getStore(key);
    if (!result || !result.value) {
      throw new Error(`Valeur de stockage non trouvée pour la clé: ${key}`);
    }
    return result.value.toString();
  };

  /**
   * Gère la réponse réussie de l'API
   * @param result Réponse de l'API
   */
  const handleSuccessResponse = async (result: ApiResponse): Promise<void> => {
    state.success = true;
    const closeModal = document.querySelector("#closeModelAuthProfil") as HTMLElement;
    if (closeModal) {
      closeModal.click();
    }
    // await StorageUtils().setStore(STORAGE_KEYS.PROFILE, result.id.toString());
    location.assign("/auth/sign-in");
  };

  /**
   * Gère les erreurs de l'API
   * @param error Erreur survenue
   */
  const handleApiError = (error: unknown): void => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      state.error = (axiosError.response?.data as { message?: string })?.message || axiosError.message;
    } else {
      state.error = (error as Error).message || "Une erreur inconnue est survenue";
    }
    console.error("Erreur API:", error);
  };

  /**
   * Ajoute les données du profil au FormData
   * @param formData FormData à remplir
   * @param payload Données du profil
   */
  const appendFormData = (formData: FormData, payload: ParentProfilePayload): void => {
    const jsonFields: (keyof ParentProfilePayload)[] = [
      "besions_specifiques",
      "garde_enfants",
      "aide_menagere",
      "frequence_des_services",
      "horaire_souhaites",
      "adress",
      "zone_geographique_prestataire",
      "competance_specifique",
      "langue_parler",
      "disponibility_du_prestataire",
      "mode_de_paiement",
    ];

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      
      if (jsonFields.includes(key as keyof ParentProfilePayload)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });
  };

  /**
   * Détermine l'URL à utiliser pour la requête API
   * @returns URL pour la création ou la mise à jour du profil
   */
  const getProfileEndpoint = (): string => {
    const authStore = useAuthStore();
    
    if (authStore.isUpdateProfil === false) {
      return URL_API_ROUTE.PARENT_CREATE;
    }
    
    return `${URL_API_ROUTE.PARENT_UPDATE}/${authStore.isUpdateProfilID}`;
  };

  /**
   * Ajoute les fichiers d'image au FormData
   * @param formData FormData à remplir
   * @param store Store du profil
   */
  const appendImageFiles = (formData: FormData, store: any): void => {
    if (store.InformationPersonnelle.image_profil && store.InformationPersonnelle.image_profil.length > 0) {
      const files = Array.from(store.InformationPersonnelle.image_profil);
      files.forEach((file: any) => {
        formData.append("imageParent", file);
      });
    }
  };

  /**
   * Crée ou met à jour le profil parent
   */
  const createParentProfile = async (): Promise<void> => {
    const nounuStore = useNounuStore();
    nounuStore.loading = true;
    state.loading = true;
    state.error = null;
    state.success = false;

    try {
      const store = getProfilStore();
      const userId = await getStorageValue(STORAGE_KEYS.USER);
      
      const formData = new FormData();
      const payload: ParentProfilePayload = {
        ...store.InformationPersonnelle,
        ...store.InformationSurLesEnfants,
        ...store.ServicesRecherches,
        ...store.Localizations,
        ...store.Tarifications,
        ...store.PreferencePourLesSpecifiques,
        ...store.ModalitesDePaiement,
        ...store.AutreInformations,
        userId,
      };

      appendFormData(formData, payload);
      appendImageFiles(formData, store);

      const endpoint = getProfileEndpoint();
      
      const { data } = await axios.post<ApiResponse>(
        endpoint,
        formData,
        { headers: { "Content-Type": CONTENT_TYPE_HEADER } }
      );

      if (data) {
        useAuthStore().isUpdateProfil = false;
        await handleSuccessResponse(data);
      } else {
        throw new Error("Réponse API invalide");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      nounuStore.loading = false;
      state.loading = false;
    }
  };

  return {
    state,
    createParentProfile,
  };
};