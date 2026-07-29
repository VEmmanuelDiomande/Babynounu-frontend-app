// hooks/nounu.hook.ts
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { StorageUtils } from "@/utils/store.utils";
import { useRouter } from "vue-router";
import axios, { AxiosError, AxiosResponse } from "axios";
import { reactive, ref } from "vue";
import { useNounuStore } from "@/stores/nounu.store";
import { useAuthStore } from "@/stores/auth.store";

// Interfaces bien définies avec des noms plus explicites
interface ContactReference {
  fullname: string;
  phone: string;
}

interface EvaluationPrecedente {
  nom: string;
  phone: string;
  note: string;
  commentaire: string;
}

// Interface pour la réponse API
interface ProfileResponse {
  id: string;
  [key: string]: any;
}

export const useNounuHook = () => {
  const router = useRouter();
  const state = reactive({
    loading: false,
    error: null as string | null,
    success: false,
  });

  /**
   * Convertit les données du profil en FormData pour l'envoi au serveur
   * @returns FormData contenant toutes les données du profil
   */
  const mapProfileDataToFormData = (): FormData => {
    const nounuStore = useProfiNounulStore();
    const formData = new FormData();

    // Informations personnelles
    const { InformationPersonnelle } = nounuStore.state;
    formData.append("fullname", InformationPersonnelle.fullname);
    formData.append("age", String(InformationPersonnelle.age));
    formData.append("phone", InformationPersonnelle.phone);
    formData.append("adress", JSON.stringify(InformationPersonnelle.address));

    if (
      InformationPersonnelle.image_profil &&
      InformationPersonnelle.image_profil.length > 0
    ) {
      Array.from(InformationPersonnelle.image_profil).forEach((file: any) => {
        formData.append("imageNounu", file);
      });
    }

    // Expérience et compétences
    const { ExperienceEtCompetences } = nounuStore.state;
    formData.append(
      "annees_experience",
      ExperienceEtCompetences.annees_experience
    );
    formData.append(
      "tranche_age_enfants",
      JSON.stringify(ExperienceEtCompetences.tranche_age_enfants)
    );
    formData.append(
      "competance_specifique",
      JSON.stringify(ExperienceEtCompetences.competance_specifique)
    );
    formData.append(
      "langue_parler",
      JSON.stringify(ExperienceEtCompetences.langue_parler)
    );

    // Disponibilités
    const { Disponibilites } = nounuStore.state;
    formData.append(
      "horaire_disponible",
      JSON.stringify(Disponibilites.horaire_disponible)
    );
    formData.append("urgences", String(Disponibilites.urgences[0]?.id === 1));

    // Tarifications
    const { Tarifications } = nounuStore.state;
    formData.append("tarif_horaire", String(Tarifications.tarif_horaire));
    formData.append("tarif_mensuel", String(Tarifications.tarif_mensuel));
    formData.append(
      "flexibilite_tarifaire",
      String(Tarifications.flexibilite_tarifaire[0]?.id === 1)
    );

    // Références et certifications
    const { VerificationEtReferences } = nounuStore.state;
    if (
      VerificationEtReferences.verification_confirmer &&
      VerificationEtReferences.verification_confirmer.length > 0
    ) {
      VerificationEtReferences.verification_confirmer.forEach((file: any) => {
        formData.append("documents", file);
      });
    }

    formData.append(
      "certifications_criteres",
      JSON.stringify(VerificationEtReferences.certifications)
    );

    formData.append(
      "references",
      JSON.stringify(VerificationEtReferences.references)
    );

    // Disponibilité Geographique
    const { DisponibiliteGeographique } = nounuStore.state;
    formData.append(
      "zone_de_travail",
      JSON.stringify(DisponibiliteGeographique.zone_de_travail)
    );

    // Evaluation precedante
    const { EvaluationEtAvis } = nounuStore.state;
    formData.append(
      "evaluation_precedentes",
      JSON.stringify(EvaluationEtAvis.evaluation_precedentes)
    );

    // Autres informations
    const { PresentationDuPersonnel } = nounuStore.state;
    formData.append(
      "courte_biographie",
      PresentationDuPersonnel.courte_biographie
    );

    // Galerie
    const { Galery } = nounuStore.state;
    if (Galery.gallery && Galery.gallery.length > 0) {
      Galery.gallery.forEach((file: any) => {
        formData.append("gallery", file);
      });
    }

    return formData;
  };

  /**
   * Détermine l'URL à utiliser pour la requête API
   * @returns URL pour la création ou la mise à jour du profil
   */
  const getProfileEndpoint = (): string => {
    const authStore = useAuthStore();

    if (authStore.isUpdateProfil === false) {
      return URL_API_ROUTE.NOUNU_CREATE;
    }

    return URL_API_ROUTE.NOUNU_UPDATE;
  };

  /**
   * Crée ou met à jour le profil de l'utilisateur
   */
  const createProfile = async (): Promise<void> => {
    const nounuStore = useNounuStore();

    try {
      nounuStore.isLoading = true;
      state.loading = true;
      state.error = null;

      const userId = await StorageUtils().getStore("nUser_Id");

      if (!userId || !userId.value) {
        throw new Error("ID utilisateur non trouvé");
      }

      const formData = mapProfileDataToFormData();
      formData.append("userId", userId.value.toString());

      const endpoint = getProfileEndpoint();
      const isUpdate = useAuthStore().isUpdateProfil;

      const response = await axios({
        method: isUpdate ? 'PUT' : 'POST',
        url: endpoint,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // const response = await fetch(endpoint, {
      //   method: "POST",
      //   body: ,
      // });

      if (response.data) {
        state.success = true;

        // Fermer la modal si elle existe
        const closeModal = document.querySelector(
          "#closeModelAuthProfil"
        ) as HTMLElement;
        if (closeModal) {
          closeModal.click();
        }

        if (useAuthStore().isUpdateProfil === false) {
          await StorageUtils().setStore(
            "nProfil_1_Id",
            response.data.id.toString()
          );
          location.assign("/home/jobs");
        }
      } else {
        throw new Error("Réponse du serveur invalide");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        state.error =
          (axiosError.response?.data as { message?: string })?.message ||
          "Erreur de communication avec le serveur";
      } else {
        state.error = (error as Error).message || "Erreur inconnue";
      }
      console.error("Erreur création profil:", error);
    } finally {
      nounuStore.isLoading = false;
      state.loading = false;
    }
  };

  return {
    state,
    createProfile,
  };
};
