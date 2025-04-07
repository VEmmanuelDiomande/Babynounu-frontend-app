import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useAuthStore } from "@/stores/auth.store";
import { useProfilStore } from "@/stores/authProfilStore";
import { useNounuStore } from "@/stores/nounu.store";
import { StorageUtils } from "@/utils/store.utils";
import axios from "axios";
import { reactive } from "vue";
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
  });

  // Méthodes privées ---------------------------------------------------------
  const getProfilStore = () => useProfilStore().state;
  const getStorageValue = async (key: string) => (await StorageUtils().getStore(key)).value;

  const handleSuccessResponse = async (result: ApiResponse) => {
    const closeModal:any = document.querySelector("#closeModelAuthProfil");
    closeModal?.click();
    await StorageUtils().setStore(STORAGE_KEYS.PROFILE, result.id.toString());
    location.assign("/choose-destination-to-start");
  };

  const handleApiError = (error: unknown) => {
    state.error = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : "Une erreur inconnue est survenue";
    console.error("Erreur API:", error);
  };

  // Helper pour la construction du FormData
  const appendFormData = (formData: FormData, payload: ParentProfilePayload) => {
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
      if (jsonFields.includes(key as keyof ParentProfilePayload)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
  };

  // Logique principale --------------------------------------------------------
  const createParentProfile = async () => {
    useNounuStore().loading = true;
    state.error = null;

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

      // Gestion des fichiers
      if (store.InformationPersonnelle.image_profil) {
        const files = Array.from(store.InformationPersonnelle.image_profil);
        files.forEach((file: any) => {
          formData.append("imageParent", file);
        });
      }

      const { data } = await axios.post<ApiResponse>(
       useAuthStore().isUpdateProfil === false ? URL_API_ROUTE.PARENT_CREATE : URL_API_ROUTE.PARENT_UPDATE + `/${useAuthStore().isUpdateProfilID}`,
        formData,
        { headers: { "Content-Type": CONTENT_TYPE_HEADER } }
      );

      if (data?.id) {
        useAuthStore().isUpdateProfil = false
        await handleSuccessResponse(data);
      } else {
        throw new Error("Réponse API invalide");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      useNounuStore().loading = false;
    }
  };

  return {
    state,
    createParentProfile,
  };
};