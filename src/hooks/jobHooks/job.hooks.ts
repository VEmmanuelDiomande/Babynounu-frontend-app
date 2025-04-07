import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { reactive } from "vue";
import { StorageUtils } from "@/utils/store.utils";
import { useRouter } from "vue-router";
import { useJobStore } from "@/stores/jobStore";
import axios from "axios";
import { Toast } from "@capacitor/toast";

export const useJobHook = () => {
  const router = useRouter();
  const jobStore = useJobStore();
  const state = reactive({
    loading: false,
    error: null as string | null,
  });

  const mapJobDataToFormData = (): FormData => {
    const formData = new FormData();
    const { state: jobState } = jobStore;

    // Informations Générales
    formData.append("titre", jobState.informationsGenerales.titre);
    formData.append("description", jobState.informationsGenerales.description);
    formData.append(
      "adress",
      JSON.stringify(jobState.informationsGenerales.adress)
    );
    formData.append(
      "zone_de_travail",
      JSON.stringify(jobState.informationsGenerales.zone_de_travail)
    );
    formData.append(
      "moyens_de_contact",
      jobState.informationsGenerales.moyens_de_contact?.length > 0 ?
      jobState.informationsGenerales.moyens_de_contact[0].value : null
    );

    // Type de Service
    formData.append(
      "type_services",
      JSON.stringify(jobState.typeService.type_services)
    );
    formData.append(
      "combinaison_service",
      jobState.typeService.combinaison_service[0].value
    );
    formData.append("taches", JSON.stringify(jobState.typeService.taches));

    // Détails Mission
    formData.append(
      "frequence_des_services",
      JSON.stringify(jobState.detailsMission.frequence_des_services)
    );
    formData.append(
      "horaire_souhaites",
      JSON.stringify(jobState.detailsMission.horaire_souhaites)
    );
    formData.append(
      "inclus_weekend",
      jobState.detailsMission.inclus_weekend?.length > 0 ?
      jobState.detailsMission.inclus_weekend[0].value : null
    );

    // Nounou
    formData.append("nombre_enfants", jobState.nounou.nombre_enfants);
    formData.append(
      "garde_enfants",
      JSON.stringify(jobState.nounou.garde_enfants)
    );
    formData.append(
      "competance_specifique",
      JSON.stringify(jobState.nounou.competance_specifique)
    );
    formData.append(
      "besions_specifiques",
      JSON.stringify(jobState.nounou.besions_specifiques)
    );
    formData.append(
      "langue_parler",
      JSON.stringify(jobState.nounou.langue_parler)
    );

    // Femme de Ménage
    formData.append(
      "aide_menagere",
      JSON.stringify(jobState.femmeDeMenage.aide_menagere)
    );
    formData.append(
      "equipement_menager",
      JSON.stringify(jobState.femmeDeMenage.equipement_menager)
    );

    // Critères
    formData.append(
      "experience_minimun",
      JSON.stringify(jobState.criteres.experience_minimun)
    );
    formData.append("annee_experience", jobState.criteres.annee_experience);
    formData.append(
      "certifications_criteres",
      JSON.stringify(jobState.criteres.certifications)
    );
    formData.append(
      "criteres_selections",
      JSON.stringify(jobState.criteres.criteres_selections)
    );

    // Rémunération
    formData.append("tarif", jobState.remuneration.tarifPropose);
    formData.append("negociable", jobState.remuneration.negociable?.length > 0 ? jobState.remuneration.negociable[0].value : null);
    console.log(jobState.dateDebut.missionUrgente)
    // Date de Début
    formData.append("date_debut", jobState.dateDebut.dateDebut);
    formData.append(
      "mission_urgente",
      jobState.dateDebut.missionUrgente?.length > 0 ? jobState.dateDebut.missionUrgente[0].value : null
    );

    // Autres Infos
    formData.append(
      "description_complementaire",
      jobState.autresInfos.descriptionComplementaire
    );
    if (jobState.autresInfos.photoVideo) {
      jobState.autresInfos.photoVideo.forEach((file: any) => {
        formData.append("Images_videos", file);
      });
    }

    return formData;
  };

  const showToast = async (message: string) => {
    await Toast.show({
      text: message,
    });
  };

  const createJob = async (): Promise<void> => {
    useJobStore().state.loading = true;
    state.error = null;

    try {
      const userId = await StorageUtils().getStore("nUser_Id");
      const formData = mapJobDataToFormData();
      formData.append("user_id", `${userId.value}`);


      const { data } = await axios.post<{ id: string }>(
        useJobStore().isUpdateJob ? URL_API_ROUTE.JOB_UPDATE + `/${useJobStore().isUpdateJobID}` : URL_API_ROUTE.JOB_CREATE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await StorageUtils().setStore("nJob_Id", data.id);
      await showToast("Offre creée avec succès");
      useJobStore().isUpdateJob = false;
      router.push({ name: "STARTER_DESTINATION" });
    } catch (error) {
      console.log(error)
      state.error = "Erreur lors de la création de l'offre";

      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data;
        showToast(apiError?.message);
        jobStore.state.in_error = {
          path: apiError?.path || "global",
          message: apiError?.message || "Erreur inconnue",
        };
      }
    } finally {
      useJobStore().state.loading = false;
    }
  };

  return {
    state,
    createJob,
  };
};
