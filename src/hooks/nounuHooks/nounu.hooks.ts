// hooks/nounu.hook.ts
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { StorageUtils } from "@/utils/store.utils";
import { useRouter } from "vue-router";
import axios from "axios";
import { reactive } from "vue";
import { useNounuStore } from "@/stores/nounu.store";
import { useAuthStore } from "@/stores/auth.store";

interface CONTACT_REFERENCE {
  fullname: string;
  phone: string;
}

interface EVALUATION_PRECEDANTE {
  nom: string;
  phone: string;
  note: string;
  commentaire: string;
}

export const useNounuHook = () => {
  const router = useRouter();
  const state = reactive({
    loading: false,
    error: null as string | null,
  });

  const mapProfileDataToFormData = (): FormData => {
    const nounuStore = useProfiNounulStore();
    const formData = new FormData();

    // Informations personnelles
    const { InformationPersonnelle } = nounuStore.state;
    formData.append("fullname", InformationPersonnelle.fullname);
    formData.append("age", InformationPersonnelle.age);
    formData.append("phone", InformationPersonnelle.phone);
    formData.append("adress", JSON.stringify(InformationPersonnelle.address));
    if (InformationPersonnelle.image_profil) {
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
    formData.append(
      "urgences",
      `${Disponibilites.urgences[0].id == 1 ? true : false}`
    );

    // Tarifications
    const { Tarifications } = nounuStore.state;
    formData.append("tarif_horaire", Tarifications.tarif_horaire);
    formData.append("tarif_mensuel", Tarifications.tarif_mensuel);
    formData.append(
      "flexibilite_tarifaire",
      `${Tarifications.flexibilite_tarifaire[0].id == 1 ? true : false}`
    );

    // Références et certifications
    const { VerificationEtReferences } = nounuStore.state;
    if (VerificationEtReferences.verification_confirmer) {
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
    formData.append("courte_biographie", PresentationDuPersonnel.courte_biographie);

    // Galerie
    const { Galery } = nounuStore.state;
    Galery.gallery.forEach((file: any) => {
      formData.append(`gallery`, file);
    });

    return formData;
  };

  const createProfile = async () => {
    try {
      useNounuStore().loading = true;
      const userId: any = await StorageUtils().getStore("nUser_Id");

      const formData = mapProfileDataToFormData();
      formData.append("userId", userId.value.toString());

      const response = await axios.post( useAuthStore().isUpdateProfil === false ? URL_API_ROUTE.NOUNU_CREATE : URL_API_ROUTE.NOUNU_UPDATE + `/${useAuthStore().isUpdateProfilID}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.id) {
        await StorageUtils().setStore("nProfil_1_Id", response.data.id.toString());
        const closeModal: any = document.querySelector("#closeModelAuthProfil");
        closeModal?.click();
        location.assign("/choose-destination-to-start");
      }
    } catch (error) {
      state.error = axios.isAxiosError(error)
        ? error.response?.data?.message || "Erreur serveur"
        : "Erreur inconnue";
      console.error("Erreur création profil:", error);
    } finally {
      useNounuStore().loading = false;
    }
  };

  return {
    state,
    createProfile,
  };
};
