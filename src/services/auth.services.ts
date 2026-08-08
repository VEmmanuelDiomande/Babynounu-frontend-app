import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import axios from "axios";
import { ApiServices } from "./api.services";
import { SIGN_UP, SIGN_IN } from "@/types/auth.types";
import { StorageUtils } from "@/utils/store.utils";
import { useAuthSignUpHook } from "@/hooks/authHooks/signUp.hook";
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useProfilStore } from "@/stores/authProfilStore";
import { useParentHook } from "@/hooks/parentHooks/parent.hooks";
import router from "@/routes";
import { unwrap, isSubscriptionActive } from "@/utils/helpers.utils";

async function checkAndStoreSubscription(token: string, userId: string) {
  try {
    const { data } = await axios.get(URL_API_ROUTE.ABONNEMENT_HAS_ACTIVE_SUBSCRIPTION, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    // Déwrappe la réponse du TransformInterceptor : { success, data: subscription }
    const subscription = unwrap(data);
    const hasActive = isSubscriptionActive(subscription);
    await StorageUtils().setStore("nIsAbonnement", hasActive ? "true" : "false");
  } catch {
    await StorageUtils().setStore("nIsAbonnement", "false");
  }
}

/**
 * Service d'authentification pour gérer l'inscription, la connexion et autres fonctionnalités liées à l'authentification
 */
class AuthService {
  private createService;
  private storageUtils;

  constructor() {
    this.createService = ApiServices().CreateService;
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
          this.storageUtils.setStore("nRefreshToken", data.user.refresh_token),
          this.storageUtils.setStore("nType_Profil", data.user.type_profil.slug),
        ]);

        // Mise à jour du store de profil
        useProfilStore().state.activeMenu_typeOfProfil = data.user.type_profil.description;

        // Redirection vers la création de profil
        const profileRoute = data.user.type_profil.slug === "parent"
          ? { name: "AUTH_PROFILE_PARENT" }
          : { name: "AUTH_PROFILE_NOUNU" };
        await router.replace(profileRoute);
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
      const message = Array.isArray(error?.response.data.message)
        ? error?.response.data.message[0].message
        : error?.response.data.message;

      authStore.setError('general', {
        path: 'email',
        message: message || "Une erreur est survenue lors de l'inscription",
      });
    }
  }

  /**
   * Connecte un utilisateur existant
   * @param signInBody Données de connexion
   * @returns Données de l'utilisateur connecté
   */
  async login(signInBody: SIGN_IN) {
    try {
      const response = await this.createService(URL_API_ROUTE.AUTH_LOGIN, {
        email: signInBody.email,
        password: signInBody.password,
      });
      const { data } = response;
      // Debug: log la structure de la reponse pour diagnostiquer le parsing CapacitorHttp
      console.log('[Auth] Login response keys:', Object.keys(data || {}));
      console.log('[Auth] data.success:', data?.success, 'data.data?.user?', !!data?.data?.user, 'data.user?', !!data?.user);

      // Avec CapacitorHttp active, la reponse peut etre { success, data: { user } } ou { user }
      const user = data?.data?.user || data?.user;
      if (!user) {
        console.error('[Auth] No user in response. Full data:', JSON.stringify(data).substring(0, 500));
        return;
      }
      const userData = user;
        // Stockage des informations utilisateur
        // IMPORTANT: await toutes les ecritures Preferences avant location.assign,
        // sinon le route guard ne trouve pas le token au rechargement -> boucle login.
        await Promise.all([
          this.storageUtils.setStore("nUser_Id", userData?.id),
          this.storageUtils.setStore("nToken", userData?.access_token),
          this.storageUtils.setStore("nRefreshToken", userData?.refresh_token),
          this.storageUtils.setStore("nType_Profil", userData?.type_profil?.slug),
          this.storageUtils.setStore("nRole", userData?.role?.slug),
        ]);

        // Stocker les infos utilisateur pour le paiement
        const profil = userData?.profil?.[0];
        const userStoreData = {
          id: userData?.id,
          email: userData?.email,
          fullname: profil?.fullname || profil?.name || '',
          phone: profil?.phone || profil?.telephone || '',
        };
        await this.storageUtils.setStore("nUser", JSON.stringify(userStoreData));

        // Vérification du statut d'abonnement avant redirection
        if (userData?.role?.slug !== "admin") {
          await checkAndStoreSubscription(userData.access_token, userData.id);
        } else {
          await this.storageUtils.setStore("nIsAbonnement", "true");
        }

        // Redirection en fonction du rôle et du profil
        if (userData?.role?.slug === "admin" || userData.profil.length !== 0) {
          if (userData?.role?.slug === "admin") {
            await this.storageUtils.setStore("nAdmin_Id", userData?.id);
          } else {
            await this.storageUtils.setStore("nProfil_1_Id", userData?.profil[0]?.id.toString());
          }

          const toRedirect = this.getRedirectPath(userData);
          await this.storageUtils.setStore("nPageType", toRedirect);
          // In Capacitor WebView, location.assign() does not trigger a full page
          // reload for SPA routes. Use router.push() instead, then manually
          // initialize push notifications (normally done in App.vue onMounted).
          if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.()) {
            await router.push(toRedirect);
            // Initialize push notifications after login (App.vue only inits on mount)
            try {
              const { pushNotificationService } = await import('@/services/pushNotification.services');
              await pushNotificationService.init();
            } catch (e) {
              console.warn('[Auth] Push init after login failed:', e);
            }
          } else {
            location.assign(toRedirect);
          }
          return;
        } else {
          // Redirection vers la création de profil pour les nouveaux utilisateurs
          useProfilStore().state.activeMenu_typeOfProfil = userData.type_profil.description;
          const profileRoute = userData.type_profil.slug === "parent"
            ? { name: "AUTH_PROFILE_PARENT" }
            : { name: "AUTH_PROFILE_NOUNU" };
          await router.replace(profileRoute);
          return;
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
    if (user?.role?.slug === "admin") return "/admin";
    return user?.type_profil?.slug === "parent" ? "/home/nounus" : "/home/jobs";
  }

  /**
   * Gère les erreurs de connexion
   * @param error Erreur survenue
   */
  private handleLoginError(error: any) {
    const authStore = useAuthStore();
    const message = Array.isArray(error?.response?.data?.message)
      ? error?.response.data.message[0].message
      : error?.response?.data?.message;

    authStore.setError('login', {
      path: 'email',
      message: message || 'Une erreur est survenue lors de la connexion',
    });
  }

  /**
   * Déconnecte l'utilisateur
   */
  async logout(): Promise<void> {
    try {
      const nToken = await this.storageUtils.getStore('nToken');
      if (nToken?.value) {
        await axios.post(URL_API_ROUTE.AUTH_LOGOUT, {}, {
          headers: { Authorization: `Bearer ${nToken.value}` },
        });
      }
    } catch {
      // Ignore errors - we clear local state regardless
    }

    // Supprimer toutes les données de session
    this.storageUtils.removeStore("nUser_Id");
    this.storageUtils.removeStore("nToken");
    this.storageUtils.removeStore("nRefreshToken");
    this.storageUtils.removeStore("nType_Profil");
    this.storageUtils.removeStore("nRole");
    this.storageUtils.removeStore("nAdmin_Id");
    this.storageUtils.removeStore("nProfil_1_Id");
    this.storageUtils.removeStore("nPageType");
    this.storageUtils.removeStore("nIsAbonnement");
    this.storageUtils.removeStore("nUser");
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
