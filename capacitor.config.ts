import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.babynounu.starter',
  appName: 'BabyNounu',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      backgroundColor: '#ffffff', // Couleur de la barre d'état
    },
  },
};

export default config;
