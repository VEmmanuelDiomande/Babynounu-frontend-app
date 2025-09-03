import { Device } from "@capacitor/device";
import { App } from "@capacitor/app";
import { Dialog } from "@capacitor/dialog";
import { Browser } from "@capacitor/browser";
import axios from "axios";
import { BASE_URL_CENTER } from "@/routes/_requests/index.request";

// Interface pour la réponse de l'API de mise à jour
interface UpdateResponse {
  version: string;
  latestVersion: string;
  updateAvailable: boolean;
  mandatory?: boolean;
  releaseNotes?: string;
}

// Interface pour les informations de l'application
interface AppInfo {
  id: string;
  version: string;
  build: string;
}

/**
 * Hook pour gérer les mises à jour de l'application
 */
export const useUpdateAppHook = () => {
  /**
   * Gère les erreurs et retourne un message approprié
   */
  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message || "Erreur réseau";
    }
    return error instanceof Error ? error.message : "Erreur inconnue";
  };

  /**
   * Vérifie s'il y a une mise à jour disponible
   */
  const checkCustomUpdate = async (): Promise<void> => {
    try {
      // Récupérer la version actuelle
      const appInfo: AppInfo = await App.getInfo();
      
      if (!appInfo.version) {
        throw new Error("Impossible de récupérer la version de l'application");
      }

      console.log(`Vérification de mise à jour pour la version: ${appInfo.version}`);

      // Vérifier sur l'API avec axios
      const response = await axios.get<UpdateResponse>(
        `${BASE_URL_CENTER}/administrateur/check-update`,
        {
          params: { version: appInfo.version },
          timeout: 10000, // 10 secondes de timeout
        }
      );

      const data = response.data;

      // Vérifier si une mise à jour est disponible
      if (data.updateAvailable && data.latestVersion !== appInfo.version) {
        const message = data.releaseNotes 
          ? `Version ${data.latestVersion} est disponible.\n\nNouveautés:\n${data.releaseNotes}\n\nVoulez-vous mettre à jour maintenant ?`
          : `Version ${data.latestVersion} est disponible. Voulez-vous mettre à jour maintenant ?`;

        const result = await Dialog.confirm({
          title: data.mandatory ? "Mise à jour obligatoire" : "Mise à jour disponible",
          message,
          okButtonTitle: "Mettre à jour",
          cancelButtonTitle: data.mandatory ? "Quitter" : "Plus tard",
        });

        if (result.value) {
          await openAppStore();
        } else if (data.mandatory) {
          // Si la mise à jour est obligatoire et que l'utilisateur refuse, fermer l'app
          await Dialog.alert({
            title: "Mise à jour requise",
            message: "Cette mise à jour est obligatoire pour continuer à utiliser l'application.",
            buttonTitle: "OK",
          });
          // Optionnel: forcer la fermeture de l'app
          // App.exitApp();
        }
      } else {
        console.log("Application à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de mise à jour:", error);

      const errorMessage = getErrorMessage(error);
      
      await Dialog.alert({
        title: "Erreur",
        message: `Impossible de vérifier les mises à jour: ${errorMessage}`,
        buttonTitle: "OK",
      });
    }
  };

  /**
   * Vérifie manuellement les mises à jour (avec feedback utilisateur)
   */
  const checkManualUpdate = async (): Promise<void> => {
    try {
      const appInfo: AppInfo = await App.getInfo();
      
      const response = await axios.get<UpdateResponse>(
        `${BASE_URL_CENTER}/administrateur/check-update`,
        {
          params: { version: appInfo.version },
          timeout: 10000,
        }
      );

      const data = response.data;

      if (data.updateAvailable && data.latestVersion !== appInfo.version) {
        const message = data.releaseNotes 
          ? `Version ${data.latestVersion} est disponible.\n\nNouveautés:\n${data.releaseNotes}\n\nVoulez-vous mettre à jour maintenant ?`
          : `Version ${data.latestVersion} est disponible. Voulez-vous mettre à jour maintenant ?`;

        const result = await Dialog.confirm({
          title: "Mise à jour disponible",
          message,
          okButtonTitle: "Mettre à jour",
          cancelButtonTitle: "Annuler",
        });

        if (result.value) {
          await openAppStore();
        }
      } else {
        await Dialog.alert({
          title: "Aucune mise à jour",
          message: "Votre application est déjà à la dernière version.",
          buttonTitle: "OK",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification manuelle:", error);
      
      const errorMessage = getErrorMessage(error);
      
      await Dialog.alert({
        title: "Erreur",
        message: `Impossible de vérifier les mises à jour: ${errorMessage}`,
        buttonTitle: "OK",
      });
    }
  };

  /**
   * Vérifie si l'application est à jour (sans interface utilisateur)
   */
  const isAppUpToDate = async (): Promise<boolean> => {
    try {
      const appInfo: AppInfo = await App.getInfo();
      
      const response = await axios.get<UpdateResponse>(
        `${BASE_URL_CENTER}/administrateur/check-update`,
        {
          params: { version: appInfo.version },
          timeout: 5000,
        }
      );

      const data = response.data;
      return !data.updateAvailable || data.latestVersion === appInfo.version;
    } catch (error) {
      console.error("Erreur lors de la vérification silencieuse:", error);
      return true; // En cas d'erreur, considérer comme à jour pour éviter les interruptions
    }
  };

  /**
   * Ouvre le store de l'application pour la mise à jour
   */
  const openAppStore = async (): Promise<void> => {
    try {
      const [deviceInfo, appInfo] = await Promise.all([
        Device.getInfo(),
        App.getInfo()
      ]);

      if (!appInfo.id) {
        throw new Error("ID de l'application non disponible");
      }

      let storeUrl: string;

      if (deviceInfo.platform === "android") {
        // Ouvrir Google Play Store
        storeUrl = `https://play.google.com/store/apps/details?id=${appInfo.id}`;
      } else if (deviceInfo.platform === "ios") {
        // Ouvrir App Store (nécessite l'ID numérique de l'App Store)
        storeUrl = `https://apps.apple.com/app/id${appInfo.id}`;
      } else {
        console.warn("Plateforme non supportée pour l'ouverture du store:", deviceInfo.platform);
        await Dialog.alert({
          title: "Plateforme non supportée",
          message: "Veuillez mettre à jour manuellement depuis votre store d'applications.",
          buttonTitle: "OK",
        });
        return;
      }

      console.log(`Ouverture du store: ${storeUrl}`);
      
      await Browser.open({
        url: storeUrl,
        windowName: "_system",
      });
    } catch (error) {
      console.error("Erreur lors de l'ouverture du store:", error);
      
      await Dialog.alert({
        title: "Erreur",
        message: "Impossible d'ouvrir le store. Veuillez mettre à jour manuellement.",
        buttonTitle: "OK",
      });
    }
  };

  /**
   * Vérifie automatiquement les mises à jour au démarrage
   */
  const initUpdateCheck = async (): Promise<void> => {
    // Attendre un délai avant de vérifier (éviter de surcharger au démarrage)
    setTimeout(() => {
      checkCustomUpdate().catch(error => {
        console.error("Erreur lors de la vérification automatique:", error);
      });
    }, 3000); // 3 secondes de délai
  };

  return {
    checkCustomUpdate,
    checkManualUpdate,
    isAppUpToDate,
    openAppStore,
    initUpdateCheck,
  };
};
