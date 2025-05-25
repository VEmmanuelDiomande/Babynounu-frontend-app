import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import axios from "axios";
import { ApiServices } from "./api.services";
import { SIGN_UP, SIGN_IN } from "@/types/auth.types";
import { StorageUtils } from "@/utils/store.utils";
import { useAuthSignUpHook } from "@/hooks/authHooks/signUp.hook";
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";
import { useProfilStore } from "@/stores/authProfilStore";
import { useParentHook } from "@/hooks/parentHooks/parent.hooks";

/**
 * Service d'authentification pour gérer l'inscription, la connexion et autres fonctionnalités liées à l'authentification
 */
class AuthService {
  private createService;
  private router;
  private storageUtils;

  constructor() {
    this.createService = ApiServices().CreateService;
    this.router = useRouter();
    this.storageUtils = StorageUtils();
  }

  /**
   * Obtient le type de profil actif
   */
  get typeProfil() {
    return computed(() => {
      return useAuthSignUpHook().state.activeMenu_typeOfProfil;
    });
  }

  /**
   * Enregistre un nouvel utilisateur
   * @param signBody Données d'inscription
   * @returns Données de l'utilisateur créé
   */
  async register(signBody: SIGN_UP) {
    try {
      const openModal: HTMLElement | null = document.querySelector(`#open-modal-auth-profil`);
      
      const { data } = await this.createService(URL_API_ROUTE.AUTH_REGISTER, {
        email: signBody.email,
        password: signBody.password,
        role: 'user',
        type_profil: signBody.type === "open-modal-auth-profil-parent" ? 'parent' : 'nounu',
      });

      if (data.user.access_token) {
        // Stockage des informations utilisateur
        await Promise.all([
          this.storageUtils.setStore("nUser_Id", data.user.id),
          this.storageUtils.setStore("nToken", data.user.access_token),
          this.storageUtils.setStore("nType_Profil", data.user.type_profil.slug),
        ]);
        
        // Mise à jour du store de profil
        useProfilStore().state.activeMenu_typeOfProfil = data.user.type_profil.description;
        
        // Ouverture de la modal de profil
        if (openModal) openModal.click();
      }
      
      return data;
    } catch (error: any) {
      this.handleRegistrationError(error);
    }
  }

  /**
   * Gère les erreurs d'inscription
   * @param error Erreur survenue
   */
  private handleRegistrationError(error: any) {
    if (error?.response?.data?.statusCode === 400) {
      const authStore = useAuthStore();
      
      if (Array.isArray(error?.response.data.message)) {
        authStore.state.in_error.path = "email";
        authStore.state.in_error.message = error?.response.data.message[0].message;
      } else {
        authStore.state.in_error.path = "email";
        authStore.state.in_error.message = error?.response.data.message;
      }
    }
  }

  /**
   * Connecte un utilisateur existant
   * @param signInBody Données de connexion
   * @returns Données de l'utilisateur connecté
   */
  async login(signInBody: SIGN_IN) {
    try {
      const openModal: HTMLElement | null = document.querySelector(`#open-modal-auth-profil`);
      
      const { data } = await this.createService(URL_API_ROUTE.AUTH_LOGIN, {
        email: signInBody.email,
        password: signInBody.password,
      });

      if (data.user.access_token) {
        // Stockage des informations utilisateur
        this.storageUtils.setStore("nUser_Id", data.user?.id);
        this.storageUtils.setStore("nToken", data.user?.access_token);
        this.storageUtils.setStore("nType_Profil", data.user?.type_profil?.slug);
        this.storageUtils.setStore("nRole", data.user?.role?.slug);

        // Redirection en fonction du rôle et du profil
        if (data.user?.role?.slug === "admin" || data.user.profil.length !== 0) {
          if (data.user?.role?.slug === "admin") {
            await this.storageUtils.setStore("nAdmin_Id", data.user?.id);
          } else {
            await this.storageUtils.setStore("nProfil_1_Id", data.user?.profil[0]?.id.toString());
          }
          
          const toRedirect = this.getRedirectPath(data.user);
          location.assign(toRedirect);
          return;
        } else {
          // Ouverture de la modal de profil pour les nouveaux utilisateurs
          useProfilStore().state.activeMenu_typeOfProfil = data.user.type_profil.description;
          if (openModal) openModal.click();
          return;
        }
      }
      
      return data;
    } catch (error: any) {
      this.handleLoginError(error);
    }
  }

  /**
   * Détermine le chemin de redirection en fonction du rôle de l'utilisateur
   * @param user Données de l'utilisateur
   * @returns Chemin de redirection
   */
  private getRedirectPath(user: any): string {
    if (user?.type_profil?.slug === "administrateur") return "/admin/chats";
    return user?.type_profil?.slug === "parent" ? "/home/nounus" : "/home/jobs";
  }

  /**
   * Gère les erreurs de connexion
   * @param error Erreur survenue
   */
  private handleLoginError(error: any) {
    const authStore = useAuthStore();
    
    if (Array.isArray(error?.response?.data?.message)) {
      authStore.state.in_error_login.path = "email";
      authStore.state.in_error_login.message = error?.response.data.message[0].message;
    } else {
      authStore.state.in_error_login.path = "email";
      authStore.state.in_error_login.message = error?.response?.data?.message;
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    // Supprimer toutes les données de session
    this.storageUtils.removeStore("nUser_Id");
    this.storageUtils.removeStore("nToken");
    this.storageUtils.removeStore("nType_Profil");
    this.storageUtils.removeStore("nRole");
    this.storageUtils.removeStore("nAdmin_Id");
    this.storageUtils.removeStore("nProfil_1_Id");
    localStorage.removeItem("user");
  }

  /**
   * Envoie un email de réinitialisation de mot de passe
   * @param email Adresse email de l'utilisateur
   */
  async passwordForget(email: string): Promise<any> {
    return axios.post(URL_API_ROUTE.PASSWORD_RESET, {
      email,
    });
  }

  /**
   * Envoie un email à l'utilisateur
   * @param email Adresse email de l'utilisateur
   */
  async sendMail(email: string): Promise<any> {
    return axios.post(URL_API_ROUTE.SEND_MAIL, {
      email,
    });
  }
}

// Création d'une instance du service d'authentification
const authService = new AuthService();

export default authService;
