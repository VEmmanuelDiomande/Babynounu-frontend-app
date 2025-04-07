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
        smallIcon: "ic_stat_icon_config_sample",
        iconColor: "#488AFF",
        sound: "beep.wav",
      },
    },
  },
};

export default config;
