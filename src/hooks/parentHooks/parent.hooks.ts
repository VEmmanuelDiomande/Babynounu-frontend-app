import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useProfiNounulStore } from "./../../stores/authProfilNounuStore";
import type { SEARCH_VERTICAL_MENU } from "./../../types/menu.types";
import { reactive, ref } from "vue";
import { StorageUtils } from "@/utils/store.utils";
import { useRouter } from "vue-router";
import { useNounuStore } from "@/stores/nounu.store";
import { useProfilStore } from "@/stores/authProfilStore";

export const useParentHook = () => {
  const state = reactive({
    loading: false,
  });

  type ProfileData = {
    InfoPersonalParentProfilValue: {
      fullName: string;
      phone: string;
      emailAdress: string;
      image_profil: any;
    };
    ChildrenInfoProfilValue: {
      numberOfChildren: any;
      agesOfChildrens: any;
      specificNeeds: any;
    };
    ServicesSoughtParentProfilValue: {
      childcares: any;
      housekeepers: any;
      frequencyOfServices: any;
      desiredTimes: any;
    };
    LocalizationProfilValue: {
      my_address: any;
      prestation_zone: any;
    };
    PricingParentProfilValue: {
      price_min: any;
      price_max: any;
    };
    PreferenceParentProfilValue: {
      specificSkills: any;
      languages: any;
      availabilityServiceProvider: any;
    };
    PaymentTermsParentProfilValue: {
      payment_terms: any;
    };
    AutreInfoParentProfilValue: {
      autre_infos: string;
    };
  };

  const USER = ref<any>(null);
  const userStorage = async () =>
    (USER.value = (await StorageUtils().getStore("nUser_Id")).value || "null");

  const mapProfileDataToFormData = (data: ProfileData): FormData => {
    const formData = new FormData();

    // Ajouter les champs de base
    formData.append("fullname", data.InfoPersonalParentProfilValue.fullName);
    formData.append("phone", data.InfoPersonalParentProfilValue.phone);
    formData.append("adresse", data.InfoPersonalParentProfilValue.emailAdress);

    // ChildrenInfoProfilValue
    formData.append(
      "number_of_children",
      data.ChildrenInfoProfilValue.numberOfChildren
    );
    if (data.ChildrenInfoProfilValue.agesOfChildrens) {
      data.ChildrenInfoProfilValue.agesOfChildrens
        .split("|")
        .forEach((age: string) => {
          formData.append("settingAgeOfChildrens[]", age.trim());
        });
    }
    if (data.ChildrenInfoProfilValue.specificNeeds) {
      data.ChildrenInfoProfilValue.specificNeeds
        .split("|")
        .forEach((specificNeeds: string) => {
          formData.append("settingSpecificNeeds[]", specificNeeds.trim());
        });
    }

    // ServicesSoughtParentProfilValue
    if (data.ServicesSoughtParentProfilValue.childcares) {
      data.ServicesSoughtParentProfilValue.childcares
        .split("|")
        .forEach((childcares: string) => {
          formData.append("settingGuardSchedules[]", childcares.trim());
        });
    }
    if (data.ServicesSoughtParentProfilValue.housekeepers) {
      data.ServicesSoughtParentProfilValue.housekeepers
        .split("|")
        .forEach((housekeepers: string) => {
          formData.append("settingHousekeepers[]", housekeepers.trim());
        });
    }
    if (data.ServicesSoughtParentProfilValue.frequencyOfServices) {
      data.ServicesSoughtParentProfilValue.frequencyOfServices
        .split("|")
        .forEach((housekeepers: string) => {
          formData.append("settingServiceFrequency[]", housekeepers.trim());
        });
    }
    if (data.ServicesSoughtParentProfilValue.desiredTimes) {
      data.ServicesSoughtParentProfilValue.desiredTimes
        .split("|")
        .forEach((desiredTimes: string) => {
          formData.append("settingDesiredTimes[]", desiredTimes.trim());
        });
    }

    //   PricingParentProfilValue
    formData.append("budget_min", data.PricingParentProfilValue.price_min);
    formData.append("budget_max", data.PricingParentProfilValue.price_max);

    // PreferenceParentProfilValue
    if (data.PreferenceParentProfilValue.languages) {
      data.PreferenceParentProfilValue.languages
        .split("|")
        .forEach((language: string) => {
          formData.append("settingLanguages[]", language.trim());
        });
    }
    if (data.PreferenceParentProfilValue.specificSkills) {
      data.PreferenceParentProfilValue.specificSkills
        .split("|")
        .forEach((skill: string) => {
          formData.append("settingSpecificSkills[]", skill.trim());
        });
    }
    formData.append(
      "availabilityServiceProvider",
      data.PreferenceParentProfilValue.availabilityServiceProvider
    );

    // LocalizationProfilValue
    if (data.LocalizationProfilValue.prestation_zone) {
      data.LocalizationProfilValue.prestation_zone
        .split("|")
        .forEach((area: string) => {
          formData.append("settingAreaWorks[]", area.trim());
        });
    }
    formData.append("localization", data.LocalizationProfilValue.my_address);

    // PaymentTermsParentProfilValue
    formData.append(
      "payment_terms",
      data.PaymentTermsParentProfilValue.payment_terms
    );

    // Ajouter l'image
    formData.append(
      "profil_image",
      data.InfoPersonalParentProfilValue.image_profil
    );
    formData.append("user", `${USER.value}`);

    // AutreInfoParentProfilValue
    formData.append("description", data.AutreInfoParentProfilValue.autre_infos);

    return formData;
  };

  const router = useRouter();
  async function createParentProfile(): Promise<void> {
    state.loading = true;
    try {
      // Charger les données utilisateur
      await userStorage();

      // Envoyer les données au serveur
      const formData = mapProfileDataToFormData(useProfilStore().state);

      const response = await fetch(URL_API_ROUTE.PARENT_CREATE, {
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
        await StorageUtils().setStore("nProfil_1_Id", result.id);
        state.loading = false;

        const closeModal: any = document.querySelector("#closeModelAuthProfil");
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
    createParentProfile,
  };
};
