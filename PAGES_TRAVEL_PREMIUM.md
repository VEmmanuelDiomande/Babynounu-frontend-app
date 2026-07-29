# 🌍 Pages Nounus Premium - Design Travel App

Ce document décrit les nouvelles pages premium créées selon le modèle de design travel app.

---

## 📱 Pages Créées

### 1. **Home Travel Premium** (`src/views/home/HomeTravelPremium.vue`)

Design inspiré de l'écran d'accueil de l'app travel.

**Caractéristiques:**
- Header personnalisé avec salutation et avatar
- Barre de recherche intégrée avec bouton de recherche
- Catégories horizontales (Tout, Nounous, Ménagères, Disponibles, Vérifiées)
- Grid de cards NounuTravelCard en 2 colonnes
- Pull-to-refresh
- Pagination infinie "Voir plus"
- Skeleton loaders pendant le chargement

**Endpoint utilisé:**
```typescript
GET /nounu?userId={userId}&page={page}&limit={limit}
```

**Hook:** `useInfiniteNounus()` depuis `src/features/nounus/hooks/useNounus.ts`

---

### 2. **Card Nounu Travel** (`src/views/home/partials/NounuTravelCard.vue`)

Card moderne type travel app.

**Caractéristiques:**
- Image en plein card avec overlay gradient
- Badge de statut disponible/occupé/indisponible
- Bouton favori (cœur)
- Étoile + rating
- Nom et ville
- Prix par heure
- Badge "Profil vérifié"
- Animation hover scale
- Animation fade-up au chargement

---

### 3. **Détail Profil Travel Premium** (`src/views/profil/ProfilDetailTravelPremium.vue`)

Design inspiré de l'écran détail d'une destination.

**Caractéristiques:**
- Hero image immersive avec header transparent
- Boutons retour et favori flottants
- Card d'info principale avec nom, statut, rating
- Tarif horaire
- Section "À propos"
- Section "Compétences"
- Section "Profils similaires" (scroll horizontal)
- Footer sticky avec boutons Message et Réserver

**Endpoint utilisé:**
```typescript
GET /nounu/{id}
```

**Hook:** `useNounu(id)` depuis `src/features/nounus/hooks/useNounus.ts`

---

### 4. **Recherche Travel Premium** (`src/views/search/SearchTravelPremium.vue`)

Design inspiré de l'écran recherche.

**Caractéristiques:**
- Header avec barre de recherche
- Tabs horizontaux (Tout, Nounous, Parents, Ménagères)
- Liste verticale de résultats avec image + info
- Système de favori
- Pagination infinie
- Debounce sur la recherche (300ms)
- Bouton filtres

**Endpoint utilisé:**
```typescript
GET /nounu/search?userId={userId}&search={search}&type={type}&page={page}&limit={limit}
```

**Hook:** `useSearchNounus()` depuis `src/features/nounus/hooks/useNounus.ts`

---

### 5. **Notifications Travel Premium** (`src/views/notification/NotificationTravelPremium.vue`)

Design moderne de liste de notifications.

**Caractéristiques:**
- Header simple "Notifications"
- Compteur de non-lues
- Bouton "Tout marquer lu"
- Liste avec avatar, nom, message, date relative
- Badge coloré par type (Abonnement, Message, Offre, Contrat, Proposition)
- Indicateur de non-lu (point orange)
- Pull-to-refresh
- Pagination infinie

**Endpoint utilisé:**
```typescript
GET /notifications/{userId}?page={page}&limit={limit}
```

**Hook:** `useNotifications()` depuis `src/features/notifications/hooks/useNotifications.ts`

---

### 6. **Profil Travel Premium** (`src/views/profil/ProfilTravelPremium.vue`)

Design premium type profil utilisateur.

**Caractéristiques:**
- Header avec image de couverture gradient
- Avatar flottant avec badge vérifié
- Stats (expérience, note, avis)
- Boutons Modifier profil et Partager
- Section À propos
- Cards d'informations (Localisation, Tarif, Disponibilité)
- Section Compétences
- Menu Paramètres (Abonnement, Documents, Galerie, Paramètres)

**Endpoint utilisé:**
```typescript
GET /nounu/{id}
```

---

## 🔄 Architecture TanStack Query

### Features créées

```
src/features/nounus/
├── api/nounus.api.ts          # Endpoints /nounu
├── hooks/useNounus.ts          # Hooks infinite + search
├── types/index.ts              # Types Nounu, Preferences, etc.
└── components/

src/features/notifications/
├── api/notifications.api.ts    # Endpoints /notifications
├── hooks/useNotifications.ts   # Hook infinite + mark as read
└── types/index.ts              # Types Notification
```

### Endpoints mappés

| Ancien endpoint | Nouveau endpoint | Page |
|-----------------|------------------|------|
| `/nounus` | `/nounu` | Home |
| `/nounus/search` | `/nounu/search` | Recherche |
| `/nounus/{id}` | `/nounu/{id}` | Détail & Profil |
| `/notifications` | `/notifications/{userId}` | Notifications |

---

## 🎯 Comment intégrer dans le routeur

Ajoutez ces routes dans `src/routes/index.ts`:

```typescript
import HomeTravelPremium from '@/views/home/HomeTravelPremium.vue';
import ProfilDetailTravelPremium from '@/views/profil/ProfilDetailTravelPremium.vue';
import SearchTravelPremium from '@/views/search/SearchTravelPremium.vue';
import NotificationTravelPremium from '@/views/notification/NotificationTravelPremium.vue';
import ProfilTravelPremium from '@/views/profil/ProfilTravelPremium.vue';

const routes = [
  {
    path: '/home-travel',
    name: 'HomeTravelPremium',
    component: HomeTravelPremium,
  },
  {
    path: '/profil-detail-travel/:id',
    name: 'ProfilDetailTravelPremium',
    component: ProfilDetailTravelPremium,
  },
  {
    path: '/search-travel',
    name: 'SearchTravelPremium',
    component: SearchTravelPremium,
  },
  {
    path: '/notifications-travel',
    name: 'NotificationTravelPremium',
    component: NotificationTravelPremium,
  },
  {
    path: '/profil-travel',
    name: 'ProfilTravelPremium',
    component: ProfilTravelPremium,
  },
];
```

---

## 🎨 Design System appliqué

### Couleurs principales
- **Gris foncé** (`#1F2937`, `gray-900`) pour les titres et CTAs
- **Primary** (`#F77C3D`) pour les accents et prix
- **Secondary** (`#55c4bd`) pour les éléments secondaires
- **Indigos** (`#6574cd`) pour les tertiaires

### Typographie
- **font-anton** pour les titres (H1, H2, H3)
- **font-love** pour le corps de texte

### Composants réutilisables
- Cards avec ombre et bordures arrondies
- Badges de statut colorés
- Boutons avec active:scale-95
- Scroll horizontal avec `scrollbar-hide`
- Skeleton loaders avec animate-pulse

---

## 🚀 Prochaines étapes

1. **Tester les pages** avec `npm run dev`
2. **Ajuster les routes** selon votre navigation existante
3. **Remplacer progressivement** les anciennes pages par les nouvelles
4. **Ajouter les images réelles** si nécessaire
5. **Connecter les vrais filtres** (ville, tarif, etc.)

---

**Créé le**: 26 Juin 2026  
**Version**: 1.0.0  
**Auteur**: Cascade AI
