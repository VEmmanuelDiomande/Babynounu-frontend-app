# 🎨 Design System Premium - Baby Nounu

## 🎯 Philosophie de Design

Notre design system s'inspire des meilleures pratiques modernes avec:
- **Minimalisme élégant**: Espaces blancs généreux, typographie claire
- **Accessibilité**: Contraste WCAG AA, tailles tactiles optimales
- **Cohérence**: Composants réutilisables, patterns uniformes
- **Performance**: Animations fluides, chargement optimisé

---

## 🎨 Palette de couleurs

### Couleurs principales
```css
--primary: #F77C3D      /* Orange vibrant - CTA, éléments importants */
--secondary: #55c4bd    /* Turquoise - Éléments secondaires */
--indigos: #6574cd      /* Indigo - Accents */
```

### Couleurs sémantiques
```css
--success: #10B981      /* Vert - Succès, disponibilité */
--warning: #F59E0B      /* Orange - Avertissements */
--danger: #EF4444       /* Rouge - Erreurs, actions destructives */
--info: #3B82F6         /* Bleu - Informations */
```

### Nuances de gris
```css
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-400: #9CA3AF
--gray-500: #6B7280
--gray-600: #4B5563
--gray-700: #374151
--gray-800: #1F2937
--gray-900: #111827
```

---

## 📝 Typographie

### Familles de polices
```css
--font-love: 'Figtree', sans-serif;    /* Corps de texte, UI */
--font-anton: 'Anton', sans-serif;      /* Titres, headers */
```

### Échelle typographique
```typescript
fontSize: {
  xr: '10px',      // Très petit (labels, badges)
  xs: '12px',      // Petit (captions, hints)
  sm: '14px',      // Corps petit
  base: '16px',    // Corps standard
  ng: '18px',      // Corps large
  lg: '20px',      // Sous-titres
  xl: '24px',      // Titres H3
  '2xl': '28px',   // Titres H2
  '3xl': '32px',   // Titres H1
}
```

### Utilisation
```vue
<!-- Titres -->
<h1 class="text-3xl font-anton text-gray-900">Titre principal</h1>
<h2 class="text-2xl font-anton text-gray-900">Sous-titre</h2>
<h3 class="text-xl font-anton text-gray-900">Section</h3>

<!-- Corps de texte -->
<p class="text-base font-love text-gray-700">Paragraphe standard</p>
<p class="text-sm font-love text-gray-600">Texte secondaire</p>
<span class="text-xs font-love text-gray-500">Caption</span>
```

---

## 🧩 Composants UI

### 1. Buttons

#### Variantes
```vue
<!-- Primary - Actions principales -->
<Button variant="primary" size="lg">
  Réserver maintenant
</Button>

<!-- Secondary - Actions secondaires -->
<Button variant="secondary" size="md">
  En savoir plus
</Button>

<!-- Outline - Actions tertiaires -->
<Button variant="outline" size="md">
  Annuler
</Button>

<!-- Ghost - Actions subtiles -->
<Button variant="ghost" size="sm">
  Voir détails
</Button>

<!-- Danger - Actions destructives -->
<Button variant="danger" size="md">
  Supprimer
</Button>
```

#### Tailles
```vue
<Button size="sm">Petit</Button>      <!-- px-3 py-1.5 -->
<Button size="md">Moyen</Button>      <!-- px-4 py-2.5 -->
<Button size="lg">Grand</Button>      <!-- px-6 py-3 -->
<Button size="xl">Très grand</Button> <!-- px-8 py-4 -->
```

#### États
```vue
<Button :loading="true">Chargement...</Button>
<Button :disabled="true">Désactivé</Button>
<Button rounded>Arrondi</Button>
<Button fullWidth>Pleine largeur</Button>
```

---

### 2. Cards

#### Variantes
```vue
<!-- Elevated - Avec ombre (défaut) -->
<Card variant="elevated" class="p-6">
  <h3>Carte avec ombre</h3>
</Card>

<!-- Outlined - Avec bordure -->
<Card variant="outlined" class="p-6">
  <h3>Carte avec bordure</h3>
</Card>

<!-- Filled - Fond coloré -->
<Card variant="filled" class="p-6">
  <h3>Carte avec fond</h3>
</Card>
```

#### Patterns d'utilisation
```vue
<!-- Card de profil -->
<Card variant="elevated" class="overflow-hidden">
  <img src="cover.jpg" class="w-full h-48 object-cover" />
  <div class="p-4">
    <h3 class="font-anton text-lg">Marie Dupont</h3>
    <p class="font-love text-sm text-gray-600">Nounou certifiée</p>
  </div>
</Card>

<!-- Card d'information -->
<Card variant="filled" class="p-4">
  <div class="flex items-center gap-3">
    <IcIcons name="RiInformationLine" :size="24" color="#3B82F6" />
    <p class="font-love text-sm">Information importante</p>
  </div>
</Card>
```

---

### 3. Badges

#### Variantes sémantiques
```vue
<Badge variant="primary">Nouveau</Badge>
<Badge variant="success">Disponible</Badge>
<Badge variant="warning">Occupée</Badge>
<Badge variant="danger">Indisponible</Badge>
<Badge variant="info">Vérifiée</Badge>
```

#### Tailles
```vue
<Badge size="sm">Petit</Badge>
<Badge size="md">Moyen</Badge>
<Badge size="lg">Grand</Badge>
```

#### Avec icônes
```vue
<Badge variant="info" size="md">
  <IcIcons name="RiVerifiedBadgeFill" :size="14" class="mr-1" />
  Vérifiée
</Badge>
```

---

### 4. Avatars

#### Tailles
```vue
<Avatar size="xs" :src="user.avatar" />   <!-- 24px -->
<Avatar size="sm" :src="user.avatar" />   <!-- 32px -->
<Avatar size="md" :src="user.avatar" />   <!-- 40px -->
<Avatar size="lg" :src="user.avatar" />   <!-- 48px -->
<Avatar size="xl" :src="user.avatar" />   <!-- 64px -->
<Avatar size="2xl" :src="user.avatar" />  <!-- 80px -->
```

#### Avec statut
```vue
<Avatar 
  :src="user.avatar"
  :name="user.fullname"
  size="lg"
  status="online"    <!-- online | offline | busy -->
/>
```

#### Fallback avec initiales
```vue
<Avatar 
  name="Marie Dupont"
  size="lg"
/>
<!-- Affiche "MD" -->
```

---

### 5. Inputs

#### Types
```vue
<Input v-model="email" type="email" label="Email" />
<Input v-model="password" type="password" label="Mot de passe" />
<Input v-model="phone" type="tel" label="Téléphone" />
<Input v-model="age" type="number" label="Âge" />
```

#### Avec préfixe/suffixe
```vue
<Input v-model="search" placeholder="Rechercher...">
  <template #prefix>
    <IcIcons name="RiSearchLine" :size="20" />
  </template>
</Input>

<Input v-model="price" type="number" label="Prix">
  <template #suffix>
    <span class="text-gray-500">FCFA</span>
  </template>
</Input>
```

#### États
```vue
<!-- Avec erreur -->
<Input 
  v-model="email"
  label="Email"
  :error="errors.email"
/>

<!-- Avec hint -->
<Input 
  v-model="username"
  label="Nom d'utilisateur"
  hint="Minimum 3 caractères"
/>

<!-- Requis -->
<Input 
  v-model="name"
  label="Nom"
  required
/>

<!-- Désactivé -->
<Input 
  v-model="field"
  label="Champ"
  disabled
/>
```

---

### 6. Tabs

```vue
<script setup lang="ts">
const activeTab = ref('all');

const tabs = [
  { 
    label: 'Tout', 
    value: 'all', 
    icon: 'RiListCheck',
    badge: 12 
  },
  { 
    label: 'Actifs', 
    value: 'active',
    icon: 'RiCheckLine' 
  },
  { 
    label: 'Archivés', 
    value: 'archived',
    icon: 'RiArchiveLine' 
  },
];
</script>

<template>
  <Tabs v-model="activeTab" :tabs="tabs">
    <div v-if="activeTab === 'all'">
      <!-- Contenu "Tout" -->
    </div>
    <div v-else-if="activeTab === 'active'">
      <!-- Contenu "Actifs" -->
    </div>
    <div v-else>
      <!-- Contenu "Archivés" -->
    </div>
  </Tabs>
</template>
```

---

## 🎭 Animations

### Transitions de liste
```vue
<TransitionGroup
  name="list"
  tag="div"
  class="grid grid-cols-2 gap-4"
>
  <Card v-for="item in items" :key="item.id">
    {{ item.name }}
  </Card>
</TransitionGroup>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
```

### Hover effects
```vue
<!-- Scale on hover -->
<Card class="hover:scale-[1.02] transition-transform duration-300">
  ...
</Card>

<!-- Shadow on hover -->
<Card class="hover:shadow-xl transition-shadow duration-300">
  ...
</Card>

<!-- Button press effect -->
<Button class="active:scale-95">
  Cliquez
</Button>
```

---

## 📐 Spacing & Layout

### Système d'espacement
```vue
<!-- Padding -->
<div class="p-4">Padding uniforme</div>
<div class="px-6 py-4">Padding horizontal/vertical</div>

<!-- Margin -->
<div class="m-4">Margin uniforme</div>
<div class="mt-6 mb-4">Margin top/bottom</div>

<!-- Gap (Flexbox/Grid) -->
<div class="flex gap-4">Items avec espacement</div>
<div class="grid grid-cols-2 gap-6">Grid avec espacement</div>
```

### Échelle d'espacement
```
0   -> 0px
1   -> 4px
2   -> 8px
3   -> 12px
4   -> 16px
5   -> 20px
6   -> 24px
8   -> 32px
10  -> 40px
12  -> 48px
16  -> 64px
```

### Layout patterns
```vue
<!-- Container centré -->
<div class="max-w-7xl mx-auto px-4">
  Contenu centré avec padding
</div>

<!-- Flexbox centré -->
<div class="flex items-center justify-center h-screen">
  Contenu centré verticalement et horizontalement
</div>

<!-- Grid responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>
```

---

## 🎨 Patterns de design

### 1. Card de profil Nounou
```vue
<Card variant="elevated" class="overflow-hidden">
  <!-- Image -->
  <div class="relative h-72">
    <img :src="nounu.avatar" class="w-full h-full object-cover" />
    
    <!-- Badge NEW -->
    <Badge variant="danger" class="absolute top-4 right-4">
      NEW
    </Badge>
    
    <!-- Gradient overlay -->
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-4">
      <div class="flex items-center gap-2 text-white">
        <IcIcons name="RiStarFill" :size="16" color="#FFD700" />
        <span>5.0</span>
      </div>
    </div>
  </div>
  
  <!-- Contenu -->
  <div class="p-4 space-y-3">
    <h3 class="font-anton text-lg">{{ nounu.fullname }}</h3>
    <p class="font-love text-sm text-gray-600">{{ nounu.city }}</p>
    
    <!-- Spécialités -->
    <div class="flex flex-wrap gap-1.5">
      <Badge v-for="spec in nounu.specialties" variant="primary" size="sm">
        {{ spec }}
      </Badge>
    </div>
    
    <!-- Prix et disponibilité -->
    <div class="flex items-center justify-between pt-2 border-t">
      <div>
        <p class="text-xs text-gray-500">À partir de</p>
        <p class="text-xl font-anton text-primary">
          {{ formatPrice(nounu.hourlyRate) }}/h
        </p>
      </div>
      <Badge variant="success">Disponible</Badge>
    </div>
  </div>
</Card>
```

### 2. Header de page
```vue
<div class="flex items-center justify-between mb-6">
  <div>
    <h1 class="text-3xl font-anton text-gray-900">
      Trouvez votre Nounou
    </h1>
    <p class="text-sm font-love text-gray-600 mt-1">
      Disponibles maintenant
    </p>
  </div>
  
  <button class="p-3 rounded-full bg-white shadow-md">
    <IcIcons name="RiFilter3Line" :size="24" color="#F77C3D" />
  </button>
</div>
```

### 3. Empty state
```vue
<div class="flex flex-col items-center justify-center py-16 px-4">
  <div class="p-6 rounded-full bg-gray-100 mb-4">
    <IcIcons name="RiServiceLine" :size="48" color="#9CA3AF" />
  </div>
  <h3 class="text-xl font-anton text-gray-900 mb-2">
    Aucune nounou disponible
  </h3>
  <p class="text-sm font-love text-gray-600 text-center max-w-sm">
    Aucune nounou disponible pour le moment. Revenez plus tard !
  </p>
</div>
```

---

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Utilisation
```vue
<!-- Grid responsive -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  ...
</div>

<!-- Texte responsive -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">
  Titre responsive
</h1>

<!-- Padding responsive -->
<div class="px-4 md:px-6 lg:px-8">
  ...
</div>

<!-- Affichage conditionnel -->
<div class="hidden md:block">
  Visible uniquement sur tablette et desktop
</div>
```

---

## ✅ Checklist Design

Avant de valider un composant:

- [ ] Utilise les couleurs du design system
- [ ] Utilise les polices Figtree/Anton
- [ ] Respecte l'échelle d'espacement (4px, 8px, 12px...)
- [ ] Arrondi des coins cohérent (rounded-xl, rounded-full)
- [ ] États hover/active définis
- [ ] Responsive sur mobile/tablette/desktop
- [ ] Accessible (contraste, tailles tactiles)
- [ ] Animations fluides (transition-all duration-300)
- [ ] TypeScript strict
- [ ] Composant réutilisable

---

**Créé le**: 26 Juin 2026  
**Version**: 1.0.0  
**Auteur**: Cascade AI
