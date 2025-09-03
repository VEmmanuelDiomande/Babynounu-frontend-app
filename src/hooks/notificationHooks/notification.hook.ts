import { LocalNotifications } from "@capacitor/local-notifications";
import type { SEARCH_VERTICAL_MENU } from "./../../types/menu.types";
// src/composables/useNotifications.ts
import { useRouter } from "vue-router";
import { reactive } from "vue";

export const useNotificationHook = () => {
  const router = useRouter();
  const state = reactive({
    verticalMenu: reactive(<SEARCH_VERTICAL_MENU>[
      {
        link: "",
        name: "Tous",
        actived: true,
      },
      {
        link: "",
        name: "Disponibles",
        actived: false,
      },
      {
        link: "",
        name: "Paiements",
        actived: false,
      },
      // {
      //   link: "",
      //   name: "Systèmes",
      //   actived: false,
      // },
    ]),
  });

  const toggleActiveMenu = (index: number) => {
    state.verticalMenu.forEach((menu, i) => {
      menu.actived = i === index;
    });
  };

  // Demander la permission
  const requestPermission = async () => {
    const { display } = await LocalNotifications.requestPermissions();
    return display === "granted";
  };

  // Planifier une notification
  const scheduleNotification = async (
    title: string,
    body: string,
    extra: Record<string, unknown>
  ) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id: Date.now(), // ID unique
          schedule: { at: new Date(Date.now() + 5000) }, // Dans 5 secondes
          extra, // Données pour la redirection
        },
      ],
    });
  };

  // Écouter les clics
  const setupNotificationListener = () => {
    LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (event) => {
        const { screen, id } = event.notification.extra as {
          screen: string;
          id: string;
        };

        if (screen === "profile") {
          router.push({ name: "Profile", params: { id } });
        }
      }
    );
  };

  return {
    requestPermission,
    scheduleNotification,
    setupNotificationListener,
  };
};
