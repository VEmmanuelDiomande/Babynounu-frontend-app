import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.babyNounu.starter",
  appName: "BabyNounu",
  webDir: "dist",
  // Fond du WebView = rose-50 (#fff1f2), couleur de fond de l'app au demarrage.
  // Avec l'edge-to-edge Android 15+, le status bar est transparent et montre
  // ce fond. Sans cette option, le fond par defaut est sombre/noir.
  backgroundColor: "#fff1f2",
  plugins: {
    // SystemBars (Capacitor 8 built-in) : gere l'edge-to-edge Android 15+/16.
    // insetsHandling "css" = Capacitor injecte les variables CSS --safe-area-inset-*
    // et applique le padding du WebView pour eviter que le contenu passe sous
    // la status bar (haut) et la nav bar (bas).
    // ATTENTION : convention SystemBars INVERSEE vs StatusBar plugin !
    //   SystemBars "LIGHT" = icones sombres (pour fond clair) <- ce qu'on veut
    //   SystemBars "DARK"  = icones claires/blanches (pour fond sombre)
    SystemBars: {
      style: "LIGHT",
      insetsHandling: "css",
    },
    // StatusBar plugin : transparent, aucune couleur de fond.
    // overlaysWebView true = le WebView s'affiche sous la status bar.
    // SystemBars (style "LIGHT") garde les icones sombres sur fond clair.
    StatusBar: {
      style: "DARK",
      overlaysWebView: true,
    },
    SplashScreen: {
      // Fond rose-50 (#fff1f2) = couleur de fond de l'app au demarrage
      // (StarterLayout / AuthLayout utilisent bg-rose-50).
      // Evite le flash noir/transparent entre le splash et le rendu Vue.
      launchShowDuration: 2000,
      backgroundColor: "#fff1f2",
      showSpinner: false,
      androidSplashScreenName: "splash",
      androidScaleType: "CENTER_CROP",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_launcher_background",
      iconColor: "#488AFF",
      sound: "bell_notification.mp3",
    },
  },
};

export default config;
