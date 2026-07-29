---
description: Configuration de Firebase Cloud Messaging (FCM) pour les notifications push sur l'app Android Capacitor
---

# Configuration Firebase Cloud Messaging (FCM) — Notifications Push

## Prérequis

- Compte Google avec accès à la Firebase Console
- Le package Android de l'app : `com.babyNounu.starter` (voir `capacitor.config.ts`)
- Android Studio installé
- Node.js et npm

## Étapes

### 1. Créer le projet Firebase

1. Aller sur https://console.firebase.google.com
2. Cliquer sur **Ajouter un projet** → nommer le projet (ex: `BabyNounu`)
3. Désactiver Google Analytics (optionnel) → Créer le projet

### 2. Ajouter l'app Android à Firebase

1. Dans la console Firebase, cliquer sur l'icône **Android** pour ajouter une app
2. **Nom du package Android** : `com.babyNounu.starter`
3. **Surnom de l'application** : `BabyNounu`
4. **Certificat de signature SHA-1** : Laisser vide pour le moment (requis uniquement pour l'auth Google)
5. Cliquer sur **Enregistrer l'application**
6. Télécharger le fichier **`google-services.json`**

### 3. Placer google-services.json dans le projet

1. Copier le fichier `google-services.json` téléchargé
2. Le placer dans : `android/app/google-services.json`

### 4. Configurer android/build.gradle (racine)

Ouvrir `android/build.gradle` et ajouter dans le bloc `dependencies` (classpath) :

```gradle
dependencies {
    // ... autres classpath ...
    classpath 'com.google.gms:google-services:4.4.2'
}
```

### 5. Configurer android/app/build.gradle

Ouvrir `android/app/build.gradle` et ajouter à la **fin du fichier** :

```gradle
apply plugin: 'com.google.gms.google-services'
```

### 6. Récupérer la clé du compte de service Firebase (pour le backend)

L'API Cloud Messaging héritée (legacy) est désactivée. L'app utilise l'**API HTTP v1** via `firebase-admin`.

1. Dans la console Firebase → **Paramètres du projet** (icône engrenage)
2. Aller dans l'onglet **Comptes de service**
3. Cliquer sur **Générer une nouvelle clé privée** → télécharger le fichier JSON
4. Renommer le fichier `firebase-service-account.json`

### 7. Configurer le backend avec le compte de service

**Option A — Fichier JSON (recommandé en dev) :**

1. Copier `firebase-service-account.json` dans le dossier `backend-babynounu-app/`
2. Ajouter dans `backend-babynounu-app/.env` :
   ```
   FIREBASE_SERVICE_ACCOUNT_PATH="./firebase-service-account.json"
   ```

**Option B — Variable JSON (recommandé en production) :**

1. Minifier le JSON sur une seule ligne (ex: `json -f firebase-service-account.json` ou manuellement)
2. Ajouter dans `backend-babynounu-app/.env` :
   ```
   FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
   ```

3. Redémarrer le backend :
   ```bash
   cd backend-babynounu-app
   npm run start:dev
   ```

4. Vérifier dans les logs : `Firebase Admin SDK initialized successfully`

### 8. Synchroniser Capacitor

```bash
// turbo
cd frontend-babynounu-app
npx cap sync android
```

### 9. Construire et tester sur device

```bash
// turbo
npx cap open android
```

Dans Android Studio :
1. Lancer l'app sur un device physique (les notifications push ne fonctionnent pas sur l'émulateur sans Google Play Services)
2. Se connecter à l'app avec un compte utilisateur
3. Vérifier les logs : le token FCM doit s'enregistrer auprès du backend (`POST /push/register`)

### 10. Tester l'envoi de notifications

#### Option A : Via la console Firebase
1. Console Firebase → **Cloud Messaging** → **Créer la première campagne**
2. Choisir **Messages de notification**
3. Rédiger un titre et un message
4. Cibler un segment ou un device spécifique (via token)
5. Envoyer

#### Option B : Via le backend (test réel)
1. Depuis un autre compte, envoyer un message de chat ou créer une notification
2. L'utilisateur hors ligne doit recevoir la notification push

### 11. Vérifications

- [ ] `google-services.json` présent dans `android/app/`
- [ ] Plugin `com.google.gms.google-services` appliqué dans `android/app/build.gradle`
- [ ] Classpath `google-services` ajouté dans `android/build.gradle`
- [ ] `FIREBASE_SERVICE_ACCOUNT_PATH` ou `FIREBASE_SERVICE_ACCOUNT_JSON` configuré dans le `.env` du backend
- [ ] Log `Firebase Admin SDK initialized successfully` visible au démarrage du backend
- [ ] Token FCM enregistré côté backend après login (`POST /push/register`)
- [ ] Notification reçue sur device physique quand l'utilisateur est hors ligne

## Dépannage

### Le token FCM ne s'enregistre pas
- Vérifier que `@capacitor/push-notifications` est installé : `npm list @capacitor/push-notifications`
- Vérifier les permissions dans `android/app/src/main/AndroidManifest.xml`
- Consulter les logs Logcat : `adb logcat | grep PushNotifications`

### Les notifications ne s'affichent pas
- Vérifier que l'app n'est pas en premier plan (les notifications push ne s'affichent que quand l'app est en arrière-plan ou fermée)
- Vérifier que `FIREBASE_SERVICE_ACCOUNT_PATH` ou `FIREBASE_SERVICE_ACCOUNT_JSON` est correct dans le `.env`
- Vérifier le log `Firebase Admin SDK initialized successfully` au démarrage du backend
- Tester avec la console Firebase d'abord pour isoler le problème (backend vs app)

### Erreur "google-services.json not found"
- Exécuter `npx cap sync android` après avoir placé le fichier
- Nettoyer le projet Android : Build → Clean Project dans Android Studio
