import { reactive } from "vue";
import { INPUT_ERROR, SIGN_IN } from "@/types/auth.types";
import { signInSchema } from "@/validations/auth/signInAuth.validate";
import authService from "@/services/auth.services";
import { useAuthStore } from "@/stores/auth.store";
import { useProfilStore } from "@/stores/authProfilStore";
import { useAbonnementStore } from "@/stores/abonnementStore";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { useJobStore } from "@/stores/jobStore";
import { useConversationHook } from "../messagerieHooks/conversation.hook";
import { SocketService } from "@/services/socket.services";
import { StorageUtils } from "@/utils/store.utils";
import { Toast } from "@capacitor/toast";
import { SettingServices } from "@/services/setting.services";
import router from "@/routes";

const socketService = new SocketService();

export const useProfilHook = () => {
  const state = reactive({});

  const isUpdateProfil = () => {
    const BtnIsUpdateProfil: any = document.getElementById("is-update-profil");
    if (BtnIsUpdateProfil) {
      BtnIsUpdateProfil.value = useAuthStore().isUpdateProfil;
      console.log(BtnIsUpdateProfil.value);
    }
  };



  const OpenModelAbonnement = async () => {
    if ((await StorageUtils().getStore("nToken")).value == null)
      return router.replace("/auth/sign");

    router.push({ name: "PackSubscrible" });
    socketService.emit("checkIsAbonnement", {
      userId: (await StorageUtils().getStore("nUser_Id")).value,
      transactionId: (await StorageUtils().getStore("nTransactionId")).value,
    });
  };

  const isAbonnement = () => {
    return useAbonnementStore().isAbonnement;
  };

  const OpenEchange = (router: any, NounuId: any, parentId: any) => {
    if (useAbonnementStore().isAbonnement == false) {
      OpenModelAbonnement();
    } else {
      useConversationHook().GetAllConversations(NounuId, parentId, router);
    }
  };

  const GetIcon = (type: any) => {
    const icons: any = {
      besions_specifiques: "RiUserHeartLine",
      budget: "RiMoneyDollarCircleLine",
      number_of_children: "RiTeamLine",
      disponibility_du_prestataire: "RiCalendarCheckLine",
      competance_specifique: "RiStarLine",
      langue_parler: "RiGlobalLine",
      frequence_des_services: "RiFileListLine",
      area: "RiMapPinLine",
      horaire_souhaites: "RiTimeLine",
      AgeOfChildrens: "RiChildLine",
      aide_menagere: "RiHomeLine",
      fullname: "RiUserLine",
      phone: "RiPhoneLine",
      adresse_mail: "RiMailLine",
      nom: "RiUserLine",
      note: "RiStickyNoteLine",
      commentaire: "RiChatQuoteLine",

      // Ajout des icônes manquants
      tranche_age_enfants: "RiCake2Line",
      zone_de_travail: "RiMapPinUserLine",
      horaire_disponible: "RiTimeLine",
      certifications_criteres: "RiShieldCheckLine",
    };
    return icons[type] || "RiUserHeartLine"; // Icône par défaut si non trouvée
  };

  const GetName = (type: any) => {
    const icons: any = {
      fullname: "Nom complet",
      adresse_mail: "Adresse e-mail",
      phone: "Numero",
      ville: "Ville",
      pays: "Pays",
      adresse: "Adresse",
      nom: "Nom",
      note: "Note",
      commentaire: "Commentaire",
    };
    return icons[type] || "None"; // Icône par défaut si non trouvée
  };

  const OpenEditProfil = (props: any, type: any) => {
    useJobStore().isUpdateJob = true;
    useAuthStore().isUpdateProfil = true;
    const isUpdateProfil: any = document.getElementById("is-update-profil");
    isUpdateProfil.value = true;

    let OpenModal: any = document.querySelector(`#open-modal-auth-profil`);
    useProfilStore().state.activeMenu_typeOfProfil = `open-modal-auth-profil-${type}`;
    OpenModal.click();

    if (type == "nounu") {
      useProfiNounulStore().ChangeInputToEdit(props);
    } else {
      useProfilStore().ChangeInputToEdit(props);
    }
  };

  const OpenToggleProfil = (isMainProfil: any) => {
    isMainProfil = !isMainProfil;
  };

  const OpenGalery = (props: any, isMainProfil: any) => {
    props.isOwner == true
      ? (isMainProfil.value = !isMainProfil.value)
      : useAbonnementStore().isAbonnement == false
      ? OpenModelAbonnement()
      : (isMainProfil.value = !isMainProfil.value);
  };

  const Available = () => {
    if (useAbonnementStore().isAbonnement == false) {
      OpenModelAbonnement();
    }
  };

  return {
    state,
    OpenModelAbonnement,
    OpenEchange,
    OpenEditProfil,
    OpenGalery,
    isAbonnement,
    OpenToggleProfil,
    GetIcon,
    GetName,
    Available,
  };
};
