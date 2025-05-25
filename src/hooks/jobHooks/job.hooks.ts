import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { reactive, readonly } from "vue";
import { StorageUtils } from "@/utils/store.utils";
import { useRouter } from "vue-router";
import { useJobStore } from "@/stores/jobStore";
import axios, { AxiosError } from "axios";
import { Toast } from "@capacitor/toast";

// Interface pour les erreurs API
interface ApiError {
  path?: string;
  message?: string;
}

// Interface pour l'état du hook
interface JobHookState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Hook pour la gestion des offres d'emploi
 * Permet de créer et mettre à jour des offres
 */
export const useJobHook = () => {
  const router = useRouter();
  const jobStore = useJobStore();
  
  // État local avec réactivité
  const state = reactive<JobHookState>({
    loading: false,
    error: null,
    success: false
  });

  /**
   * Convertit les données du store en FormData pour l'API
   * @returns FormData formatée pour l'API
   */
  const mapJobDataToFormData = (): FormData => {
    const formData = new FormData();
    const { state: jobState } = jobStore;

    // Fonction utilitaire pour ajouter des données au FormData
    const appendData = (key: string, value: any, shouldStringify = false) => {
      if (value === undefined || value === null) return;
      
      formData.append(
        key, 
        shouldStringify ? JSON.stringify(value) : value
      );
    };

    // Fonction utilitaire pour ajouter des données d'array au FormData
    const appendArrayValue = (key: string, array: any[] | undefined, index = 0) => {
      if (!array || array.length === 0) return null;
      return array[index]?.value || null;
    };

    // Informations Générales
    appendData("titre", jobState.informationsGenerales.titre);
    appendData("description", jobState.informationsGenerales.description);
    appendData("adress", jobState.informationsGenerales.adress, true);
    appendData("zone_de_travail", jobState.informationsGenerales.zone_de_travail, true);
    appendData(
      "moyens_de_contact", 
      appendArrayValue("moyens_de_contact", jobState.informationsGenerales.moyens_de_contact)
    );

    // Type de Service
    appendData("type_services", jobState.typeService.type_services, true);
    appendData(
      "combinaison_service", 
      jobState.typeService.combinaison_service[0]?.value
    );
    appendData("taches", jobState.typeService.taches, true);

    // Détails Mission
    appendData("frequence_des_services", jobState.detailsMission.frequence_des_services, true);
    appendData("horaire_souhaites", jobState.detailsMission.horaire_souhaites, true);
    appendData(
      "inclus_weekend", 
      appendArrayValue("inclus_weekend", jobState.detailsMission.inclus_weekend)
    );

    // Nounou
    appendData("nombre_enfants", jobState.nounou.nombre_enfants);
    appendData("garde_enfants", jobState.nounou.garde_enfants, true);
    appendData("competance_specifique", jobState.nounou.competance_specifique, true);
    appendData("besions_specifiques", jobState.nounou.besions_specifiques, true);
    appendData("langue_parler", jobState.nounou.langue_parler, true);

    // Femme de Ménage
    appendData("aide_menagere", jobState.femmeDeMenage.aide_menagere, true);
    appendData("equipement_menager", jobState.femmeDeMenage.equipement_menager, true);

    // Critères
    appendData("experience_minimun", jobState.criteres.experience_minimun, true);
    appendData("annee_experience", jobState.criteres.annee_experience);
    appendData("certifications_criteres", jobState.criteres.certifications, true);
    appendData("criteres_selections", jobState.criteres.criteres_selections, true);

    // Rémunération
    appendData("tarif", jobState.remuneration.tarifPropose);
    appendData(
      "negociable", 
      appendArrayValue("negociable", jobState.remuneration.negociable)
    );

    // Date de Début
    appendData("date_debut", jobState.dateDebut.dateDebut);
    appendData(
      "mission_urgente", 
      appendArrayValue("mission_urgente", jobState.dateDebut.missionUrgente)
    );

    // Autres Infos
    appendData("description_complementaire", jobState.autresInfos.descriptionComplementaire);
    
    // Ajout des fichiers
    if (jobState.autresInfos.photoVideo && jobState.autresInfos.photoVideo.length > 0) {
      jobState.autresInfos.photoVideo.forEach((file: any) => {
        formData.append("Images_videos", file);
      });
    }

    return formData;
  };

  /**
   * Affiche un message toast à l'utilisateur
   * @param message Message à afficher
   */
  const showToast = async (message: string): Promise<void> => {
    await Toast.show({
      text: message,
      duration: 'long'
    });
  };

  /**
   * Gère les erreurs de l'API
   * @param error Erreur reçue
   */
  const handleApiError = (error: unknown): void => {
    console.error("Erreur lors de l'opération:", error);
    state.error = "Erreur lors de la création de l'offre";

    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      
      // Afficher le message d'erreur à l'utilisateur
      showToast(apiError?.message || "Une erreur est survenue");
      
      // Mettre à jour l'état d'erreur dans le store
      jobStore.state.in_error = {
        path: apiError?.path || "global",
        message: apiError?.message || "Erreur inconnue",
      };
    }
  };

  /**
   * Crée ou met à jour une offre d'emploi
   */
  const createJob = async (): Promise<void> => {
    // Mettre à jour l'état de chargement
    jobStore.state.loading = true;
    state.loading = true;
    state.error = null;
    state.success = false;

    try {
      // Récupérer l'ID utilisateur
      const userIdStore = await StorageUtils().getStore("nUser_Id");
      const userId = userIdStore?.value;
      
      if (!userId) {
        throw new Error("ID utilisateur non disponible");
      }

      // Préparer les données du formulaire
      const formData = mapJobDataToFormData();
      formData.append("user_id", `${userId}`);

      // Déterminer l'URL en fonction du mode (création ou mise à jour)
      const isUpdate = useJobStore().isUpdateJob;
      const url = isUpdate 
        ? `${URL_API_ROUTE.JOB_UPDATE}/${useJobStore().isUpdateJobID}` 
        : URL_API_ROUTE.JOB_CREATE;

      // Envoyer la requête à l'API
      const { data } = await axios.post<{ id: string }>(
        url,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Stocker l'ID de l'offre créée
      await StorageUtils().setStore("nJob_Id", data.id);
      
      // Afficher un message de succès
      const message = isUpdate ? "Offre mise à jour avec succès" : "Offre créée avec succès";
      await showToast(message);
      
      // Réinitialiser l'état de mise à jour
      useJobStore().isUpdateJob = false;
      state.success = true;
      
      // Rediriger l'utilisateur
      router.push({ name: "STARTER_DESTINATION" });
    } catch (error) {
      handleApiError(error);
    } finally {
      // Réinitialiser l'état de chargement
      useJobStore().state.loading = false;
      state.loading = false;
    }
  };

  // Exposer uniquement les méthodes et propriétés nécessaires
  return {
    state: readonly(state), // Exposer l'état en lecture seule
    createJob,
  };
};
