import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.babyNounu.starter",
  appName: "BabyNounu",
  webDir: "dist",
  plugins: {
    StatusBar: {
      backgroundColor: "#ffffff", // Couleur de la barre d'état
    },
    plugins: {
      PushNotifications: {
        presentationOptions: ["badge", "sound", "alert"],
      },
      LocalNotifications: {
        smallIcon: "ic_launcher_background",
        iconColor: "#488AFF",
        sound: "bell_notification.mp3",
      },
    },
  },
};

export default config;
