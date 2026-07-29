import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.babyNounu.starter",
  appName: "BabyNounu",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    StatusBar: {
      backgroundColor: "#ffffff",
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
