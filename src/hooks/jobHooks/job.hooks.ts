import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import type { SEARCH_VERTICAL_MENU } from "./../../types/menu.types";
import { reactive, ref } from "vue";
import { StorageUtils } from "@/utils/store.utils";
import { useRouter } from "vue-router";
import { useNounuStore } from "@/stores/nounu.store";
import { useJobStore } from "@/stores/jobStore";

export const useJobHook = () => {
  const state = reactive({
    loading: false,
  });

  type JobData = {
    InfoPersonalJobValue: {
      title: string;
      visibleAdress: string;
      meansOfContact: string;
    };
   
  };

  const USER = ref<any>(null);
  const userStorage = async () =>
    (USER.value = (await StorageUtils().getStore("nUser_Id")).value || "null");

  const mapJobDataToFormData = (data: JobData): FormData => {
    const formData = new FormData();

    // Ajouter les champs de base
    formData.append("title", data.InfoPersonalJobValue.title);
    formData.append("visibleAdress", data.InfoPersonalJobValue.visibleAdress);
    formData.append("meansOfContact", data.InfoPersonalJobValue.meansOfContact);

   

    return formData;
  };

  const router = useRouter();
  async function createJob(): Promise<void> {
    state.loading = true;
    try {
      // Charger les données utilisateur
      await userStorage();

      // Envoyer les données au serveur
      const formData = mapJobDataToFormData(useJobStore().state);

      const response = await fetch(URL_API_ROUTE.JOB_CREATE, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        state.loading = false;
        throw new Error(
          result.error || `Erreur ${response.status}: ${response.statusText}`
        );
      }

      if (result) {
        console.log("Résultat de l'API :", result);
        // Sauvegarder les données et rediriger
        await StorageUtils().setStore("nJob_Id", result.id);
        state.loading = false;

        const closeModal: any = document.querySelector("#closeModelAuthJob");
        closeModal?.click();
        router.push({ name: "STARTER_DESTINATION" });
      }
    } catch (error: any) {
      state.loading = false;
      console.error(
        "Erreur lors de la création du profil :",
        error.message || error
      );
    }
  }

  return {
    state,
    createJob,
  };
};
