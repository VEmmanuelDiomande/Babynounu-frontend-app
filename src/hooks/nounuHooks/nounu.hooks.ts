import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useProfiNounulStore } from "./../../stores/authProfilNounuStore";
import type { SEARCH_VERTICAL_MENU } from "./../../types/menu.types";
import { reactive, ref } from "vue";
import { StorageUtils } from "@/utils/store.utils";
import { useRouter } from "vue-router";
import { useNounuStore } from "@/stores/nounu.store";

export const useNounuHook = () => {
  const state = reactive({
    seedDataNounus: reactive(<any>[]),
    loading: false,
  });

  state.seedDataNounus = Array.from({ length: 50 }, (_, i) => ({
    first_name: `${
      [
        "Diallo",
        "Koné",
        "Coulibaly",
        "Yao",
        "Traoré",
        "Martin",
        "Kouassi",
        "Kouamé",
        "Soupouder",
        "Rogib",
      ][Math.floor(Math.random() * 10)]
    }`,
    last_name: `${
      [
        "Adama",
        "Aïcha",
        "Bintou",
        "Demba",
        "Fatou",
        "Issa",
        "Koffi",
        "Mariama",
        "N'guessan",
        "Yacouba",
      ][Math.floor(Math.random() * 10)]
    }`,
    age: Math.floor(Math.random() * 43) + 18, // Âge entre 18 et 60
    exp: Math.floor(Math.random() * 20) + 1, // Âge entre 18 et 60
    commune: [
      "Bingerville",
      "Adjamé",
      "Cocody",
      "Marcory",
      "Yopougon",
      "Koumassi",
      "Port Bouet",
    ][Math.floor(Math.random() * 6)],
    price: `${(Math.floor(Math.random() * 500) + 50) * 10}`, // Prix entre 50 000 et 250 000 FCFA
    type: ["Temps plein", "Temps partiel", "Freelance"][
      Math.floor(Math.random() * 3)
    ],
  }));

  type ProfileData = {
    InfoPersonalValue: {
      fullName: string;
      age: string;
      phone: string;
      address: string;
      image_profil: any;
    };
    ExperienceAndSkillValue: {
      yearsOfExperience: string;
      ageGroupOfChildren: string;
      specificSkills: string;
      languages: string;
    };
    AvailabeValue: {
      schedulesAvailable: string;
      emergencie: string;
    };
    PricingValue: {
      monthlyRate: string;
      hourlyRate: string;
      flexiblePrice: string;
    };
    VerificationValue: {
      verificationOfConfirmed: string;
      refrence_1: string;
      refrence_2: string;
      reference_3: string;
      certifications: string;
    };
    BiographieValue: {
      text: string;
    };
    AreaWorkValue: {
      areaWork: string;
    };
    GaleryValue: {
      gallery: any;
    };
  };

  // const mapProfileDataToObject = (data: ProfileData): any => {
  //   const nounu = {
  //     fullname: data.InfoPersonalValue.fullName,
  //     old: data.InfoPersonalValue.age,
  //     phone: data.InfoPersonalValue.phone,
  //     adresse: data.InfoPersonalValue.address,
  //     year_experience: data.ExperienceAndSkillValue.yearsOfExperience,
  //     hourly_rate: data.PricingValue.hourlyRate,
  //     monthly_rate: data.PricingValue.monthlyRate,
  //     pricing_flexibility: data.PricingValue.flexiblePrice === "Oui, mes tarifs sont négociables",
  //     confirmed_verification:
  //       data.VerificationValue.verificationOfConfirmed === "Oui, mes tarifs sont négociables",
  //     biographie: data.BiographieValue.text,
  //     settingAgeOfChildrens: data.ExperienceAndSkillValue.ageGroupOfChildren
  //       ? data.ExperienceAndSkillValue.ageGroupOfChildren
  //           .split("|")
  //           .map((age) => ({
  //             age,
  //           }))
  //       : [],
  //     settingLanguages: data.ExperienceAndSkillValue.languages
  //       ? data.ExperienceAndSkillValue.languages.split("|").map((lang) => ({
  //           language: lang,
  //         }))
  //       : [],
  //     settingCertifications: data.ExperienceAndSkillValue.specificSkills
  //       ? data.ExperienceAndSkillValue.specificSkills
  //           .split("|")
  //           .map((skill) => ({
  //             certification: skill,
  //           }))
  //       : [],
  //     settingDesiredTimes: data.AvailabeValue.schedulesAvailable
  //       ? data.AvailabeValue.schedulesAvailable.split("|").map((time) => ({
  //           schedule: time,
  //         }))
  //       : [],
  //     settingAreaWorks: data.AreaWorkValue.areaWork
  //       ? data.AreaWorkValue.areaWork.split("|").map((area) => ({
  //           area,
  //         }))
  //       : [],
  //   };

  //   return nounu;
  // };

  const USER = ref<any>(null);
  const userStorage = async () => USER.value = (await StorageUtils().getStore('nUser_Id')).value || null;

  const mapProfileDataToFormData = (data: ProfileData): FormData => {
    const formData = new FormData();

    // Ajouter les champs de base
    formData.append("fullname", data.InfoPersonalValue.fullName);
    formData.append("old", data.InfoPersonalValue.age);
    formData.append("phone", data.InfoPersonalValue.phone);
    formData.append("adresse", data.InfoPersonalValue.address);
    formData.append(
      "year_experience",
      data.ExperienceAndSkillValue.yearsOfExperience
    );
    formData.append("hourly_rate", data.PricingValue.hourlyRate);
    formData.append("monthly_rate", data.PricingValue.monthlyRate);
    formData.append("reference_1", data.VerificationValue.refrence_1);
    formData.append("reference_2", data.VerificationValue.refrence_2);
    formData.append("reference_3", data.VerificationValue.reference_3);
    formData.append(
      "emergencie",
      data.AvailabeValue.emergencie === "Oui, mes tarifs sont négociables"
        ? "1"
        : "0"
    );
    formData.append(
      "pricing_flexibility",
      data.PricingValue.flexiblePrice === "Oui, mes tarifs sont négociables"
        ? "1"
        : "0"
    );
    formData.append("document", data.VerificationValue.verificationOfConfirmed);
    formData.append("biographie", data.BiographieValue.text);

    // Ajouter les listes de données
    if (data.ExperienceAndSkillValue.ageGroupOfChildren) {
      data.ExperienceAndSkillValue.ageGroupOfChildren
        .split("|")
        .forEach((age) => {
          formData.append("settingAgeOfChildrens[]", age.trim());
        });
    }

    if (data.ExperienceAndSkillValue.languages) {
      data.ExperienceAndSkillValue.languages.split("|").forEach((language) => {
        formData.append("settingLanguages[]", language.trim());
      });
    }

    if (data.ExperienceAndSkillValue.specificSkills) {
      data.ExperienceAndSkillValue.specificSkills
        .split("|")
        .forEach((skill) => {
          formData.append("settingSpecificSkills[]", skill.trim());
        });
    }

    if (data.VerificationValue.certifications) {
      data.VerificationValue.certifications.split("|").forEach((cert) => {
        formData.append("settingCertifications[]", cert.trim());
      });
    }

    if (data.AvailabeValue.schedulesAvailable) {
      data.AvailabeValue.schedulesAvailable.split("|").forEach((time) => {
        formData.append("settingDesiredTimes[]", time.trim());
      });
    }

    if (data.AreaWorkValue.areaWork) {
      data.AreaWorkValue.areaWork.split("|").forEach((area) => {
        formData.append("settingAreaWorks[]", area.trim());
      });
    }

    // Ajouter l'image
    formData.append("profil_image", data.InfoPersonalValue.image_profil);
    for (let i = 0; i < data.GaleryValue.gallery.length; i++) {
      formData.append(`gallery`, data.GaleryValue.gallery[i]);
    }
    formData.append("user", `${USER.value}`);

    return formData;
  };

  const router = useRouter();
  async function createProfile(): Promise<void> {
    try {
      // Convertir en FormData
      useNounuStore().loading = true;

      await userStorage();
      const formData = mapProfileDataToFormData(useProfiNounulStore().state);

      const response = await fetch(URL_API_ROUTE.NOUNU_CREATE, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        useNounuStore().loading = false;
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (!result?.id) throw new Error("Profil non cree");

      if (result) {
        // Mettre à jour le Storage
        await Promise.all([StorageUtils().setStore("nProfil_1_Id", result?.id)]);

        useNounuStore().loading = false;
        let OpenModal: any = document.querySelector(`#closeModelAuthProfil`);
        OpenModal.click();

        // Rediriger vers la page de profil
        router.push({ name: "STARTER_DESTINATION" });
      }
    } catch (error) {
      useNounuStore().loading = false;
      console.error("Erreur lors de la création du profil :", error);
    }
  }

  return {
    state,
    createProfile,
  };
};
