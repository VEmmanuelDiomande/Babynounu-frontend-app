# 🚀 Refonte Premium - Baby Nounu Frontend

## 📋 Vue d'ensemble

Cette refonte complète du frontend Baby Nounu apporte:

✅ **Architecture moderne** avec TanStack Query  
✅ **Design System premium** inspiré des meilleures apps  
✅ **Code organisé** avec feature-based architecture  
✅ **TypeScript strict** pour la sécurité des types  
✅ **Performance optimisée** avec pagination infinie  
✅ **Composants réutilisables** et maintenables  

---

## 🎨 Nouveau Design

Le nouveau design s'inspire des applications premium modernes (fitness, wellness) avec:

- **Cards élégantes** avec images immersives et gradients
- **Badges NEW** pour les nouveaux profils
- **Système de notation** avec étoiles dorées
- **Boutons favoris** avec animations
- **Typographie moderne** (Anton + Figtree)
- **Couleurs vibrantes** (Orange #F77C3D, Turquoise #55c4bd)
- **Animations fluides** et transitions douces

---

## 📁 Nouvelle Structure

```
src/
├── lib/                          # Bibliothèques partagées
│   ├── api/                      # Client API centralisé
│   │   ├── client.ts            # Axios avec intercepteurs
│   │   ├── types.ts             # Types API globaux
│   │   └── index.ts
│   └── query/                    # TanStack Query
│       ├── query-client.ts      # Configuration
│       └── query-keys.ts        # Clés de cache
│
├── features/                     # Features par domaine
│   └── nounus/
│       ├── api/                  # API endpoints
│       ├── hooks/                # React Query hooks
│       ├── types/                # Types TypeScript
│       └── components/           # Composants spécifiques
│
├── components/
│   └── ui/                       # Design System
│       ├── Button/
│       ├── Card/
│       ├── Badge/
│       ├── Avatar/
│       ├── Input/
│       ├── Tabs/
│       └── index.ts
│
└── views/                        # Pages
    └── home/
        ├── HomePagePremium.vue
        └── partials/
            └── NounuCardPremium.vue
```

---

## 🆕 Nouveaux Composants

### 1. Design System (`src/components/ui/`)

- **Button** - 5 variantes (primary, secondary, outline, ghost, danger)
- **Card** - 3 variantes (elevated, outlined, filled)
- **Badge** - 6 variantes sémantiques avec tailles
- **Avatar** - Avec statut online/offline/busy
- **Input** - Avec préfixe/suffixe, erreurs, hints
- **Tabs** - Avec icônes et badges

### 2. Pages Premium

- **HomePagePremium.vue** - Liste des nounous avec infinite scroll
- **NounuCardPremium.vue** - Card moderne avec image, badges, prix
- **NounuDetailPremium.vue** - Page détail complète

---

## 🔄 Migration TanStack Query

### Avant (Ancien code)
```vue
<script setup lang="ts">
const dataNounus = ref([]);
const isLoading = ref(false);

const fetchNounus = async () => {
  isLoading.value = true;
  try {
    const response = await SettingServices().listSetting(url);
    dataNounus.value = response.data;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchNounus();
});
</script>
```

### Après (Nouveau code)
```vue
<script setup lang="ts">
import { useInfiniteNounus } from '@/features/nounus/hooks/useNounus';

const filters = ref({
  userId: '',
  availability: 'available',
});

const {
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  refetch,
} = useInfiniteNounus(filters);

const nounus = computed(() => {
  if (!data.value) return [];
  return data.value.pages.flatMap((page: any) => page.data);
});
</script>
```

### Avantages
- ✅ Cache automatique
- ✅ Refetch intelligent
- ✅ Pagination infinie native
- ✅ États de chargement gérés
- ✅ Invalidation de cache
- ✅ Retry automatique

---

## 🎯 Utilisation des Composants

### Button
```vue
<Button 
  variant="primary" 
  size="lg" 
  :loading="isSubmitting"
  rounded
  @click="handleSubmit"
>
  Réserver maintenant
</Button>
```

### Card avec contenu
```vue
<Card variant="elevated" class="p-6">
  <h3 class="text-xl font-anton mb-2">Titre</h3>
  <p class="font-love text-gray-600">Description...</p>
</Card>
```

### Avatar avec statut
```vue
<Avatar 
  :src="user.avatar"
  :name="user.fullname"
  size="lg"
  status="online"
/>
```

### Input avec validation
```vue
<Input 
  v-model="email"
  type="email"
  label="Email"
  :error="errors.email"
  required
>
  <template #prefix>
    <IcIcons name="RiMailLine" :size="20" />
  </template>
</Input>
```

---

## 📚 Documentation

Consultez les guides détaillés:

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture complète et patterns
2. **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Guide du design system

---

## 🚀 Démarrage Rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer le dev server
```bash
npm run dev
```

### 3. Tester la nouvelle page
Naviguez vers `/home-premium` pour voir la nouvelle interface

---

## 🔧 Configuration TanStack Query

Le QueryClient est déjà configuré dans `src/main.ts`:

```typescript
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import { queryClient } from '@/lib/query/query-client';

app.use(VueQueryPlugin, { queryClient });
```

Configuration par défaut:
- **staleTime**: 5 minutes
- **gcTime**: 10 minutes
- **retry**: 1 tentative
- **refetchOnWindowFocus**: désactivé

---

## 📝 Exemples de Features

### Créer une nouvelle feature

1. **Créer la structure**
```bash
src/features/contracts/
├── api/contracts.api.ts
├── hooks/useContracts.ts
├── types/index.ts
└── components/
```

2. **Définir les types**
```typescript
// src/features/contracts/types/index.ts
export interface Contract {
  id: string;
  nounuId: string;
  parentId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed';
}
```

3. **Créer l'API**
```typescript
// src/features/contracts/api/contracts.api.ts
import { apiClient } from '@/lib/api';

export const contractsApi = {
  getAll: async (params: GetContractsParams) => {
    return apiClient.get('/contracts', { params });
  },
  
  create: async (data: Partial<Contract>) => {
    return apiClient.post('/contracts', data);
  },
};
```

4. **Créer les hooks**
```typescript
// src/features/contracts/hooks/useContracts.ts
import { useQuery, useMutation } from '@tanstack/vue-query';
import { queryKeys } from '@/lib/query/query-keys';

export function useContracts(params: Ref<GetContractsParams>) {
  return useQuery({
    queryKey: computed(() => queryKeys.contracts.list(params.value)),
    queryFn: () => contractsApi.getAll(params.value),
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Contract>) => contractsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.contracts.lists() 
      });
    },
  });
}
```

5. **Utiliser dans un composant**
```vue
<script setup lang="ts">
import { useContracts, useCreateContract } from '@/features/contracts/hooks/useContracts';

const filters = ref({ userId: '' });
const { data: contracts, isLoading } = useContracts(filters);
const { mutate: createContract, isPending } = useCreateContract();

const handleCreate = () => {
  createContract({
    nounuId: '123',
    parentId: '456',
    startDate: new Date().toISOString(),
  });
};
</script>
```

---

## 🎨 Personnalisation du Design

### Modifier les couleurs
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#F77C3D',      // Orange
        secondary: '#55c4bd',    // Turquoise
        // Ajoutez vos couleurs
      },
    },
  },
};
```

### Modifier les polices
```javascript
// tailwind.config.js
fontFamily: {
  love: ['Figtree', 'sans-serif'],
  anton: ['Anton', 'sans-serif'],
  // Ajoutez vos polices
},
```

---

## ✅ Checklist de Migration

Pour migrer une page existante:

- [ ] Créer la feature dans `src/features/`
- [ ] Définir les types TypeScript
- [ ] Créer l'API avec `apiClient`
- [ ] Créer les hooks TanStack Query
- [ ] Remplacer les appels API directs
- [ ] Utiliser les composants du Design System
- [ ] Ajouter les animations/transitions
- [ ] Tester la pagination infinie
- [ ] Vérifier le responsive
- [ ] Optimiser les images avec v-lazy

---

## 🐛 Résolution de Problèmes

### Le cache ne s'invalide pas
```typescript
// Invalider manuellement
queryClient.invalidateQueries({ 
  queryKey: queryKeys.nounus.lists() 
});

// Ou refetch
refetch();
```

### Les données ne se chargent pas
```typescript
// Vérifier que la query est enabled
const { data } = useNounu(nounuId, {
  enabled: computed(() => !!nounuId.value),
});
```

### Erreur TypeScript sur les types
```typescript
// Utiliser les types explicites
const nounus = computed(() => {
  if (!data.value) return [];
  return data.value.pages.flatMap((page: PaginatedResponse<Nounu>) => page.data);
});
```

---

## 📞 Support

Pour toute question sur l'architecture ou le design system:
- Consultez `ARCHITECTURE.md` pour l'architecture
- Consultez `DESIGN_SYSTEM.md` pour les composants UI
- Référez-vous aux exemples dans `src/views/home/HomePagePremium.vue`

---

## 🎉 Prochaines Étapes

1. **Migrer les autres pages** vers la nouvelle architecture
2. **Créer plus de composants UI** (Modal, Dropdown, etc.)
3. **Ajouter les tests** unitaires et E2E
4. **Optimiser les performances** (lazy loading, code splitting)
5. **Améliorer l'accessibilité** (ARIA, keyboard navigation)

---

**Date de création**: 26 Juin 2026  
**Version**: 1.0.0  
**Auteur**: Cascade AI  
**Stack**: Vue 3 + TypeScript + TanStack Query + Ionic + TailwindCSS
