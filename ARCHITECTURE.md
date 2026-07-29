# 🏗️ Architecture Frontend Premium - Baby Nounu

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Structure du projet](#structure-du-projet)
3. [Architecture TanStack Query](#architecture-tanstack-query)
4. [Design System](#design-system)
5. [Bonnes pratiques](#bonnes-pratiques)

---

## 🎯 Vue d'ensemble

Cette architecture moderne utilise:
- ✅ **Vue 3** avec Composition API et `<script setup>`
- ✅ **TypeScript** pour la sécurité des types
- ✅ **TanStack Query** pour la gestion des données serveur
- ✅ **Ionic Vue** pour les composants mobiles
- ✅ **TailwindCSS** pour le styling
- ✅ **Feature-based architecture** pour l'organisation du code

---

## 📁 Structure du projet

```
src/
├── lib/                          # Bibliothèques et utilitaires partagés
│   ├── api/                      # Client API centralisé
│   │   ├── client.ts            # Instance Axios configurée
│   │   ├── types.ts             # Types API globaux
│   │   └── index.ts             # Exports
│   └── query/                    # Configuration TanStack Query
│       ├── query-client.ts      # Configuration QueryClient
│       └── query-keys.ts        # Clés de cache organisées
│
├── features/                     # Fonctionnalités organisées par domaine
│   └── nounus/                   # Exemple: Feature Nounus
│       ├── api/                  # Appels API spécifiques
│       │   └── nounus.api.ts
│       ├── hooks/                # Hooks React Query
│       │   └── useNounus.ts
│       ├── types/                # Types TypeScript
│       │   └── index.ts
│       └── components/           # Composants spécifiques
│           └── NounuDetailPremium.vue
│
├── components/                   # Composants réutilisables
│   └── ui/                       # Design System
│       ├── Button/
│       ├── Card/
│       ├── Badge/
│       ├── Avatar/
│       ├── Input/
│       ├── Tabs/
│       └── index.ts             # Barrel export
│
├── views/                        # Pages de l'application
│   └── home/
│       ├── HomePagePremium.vue
│       └── partials/
│           └── NounuCardPremium.vue
│
└── services/                     # Services legacy (à migrer)
```

---

## 🔄 Architecture TanStack Query

### 1. Configuration du QueryClient

```typescript
// src/lib/query/query-client.ts
import { QueryClient } from '@tanstack/vue-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      gcTime: 1000 * 60 * 10,         // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
```

### 2. Organisation des Query Keys

```typescript
// src/lib/query/query-keys.ts
export const queryKeys = {
  nounus: {
    all: ['nounus'] as const,
    lists: () => [...queryKeys.nounus.all, 'list'] as const,
    list: (filters: Record<string, any>) => 
      [...queryKeys.nounus.lists(), filters] as const,
    detail: (id: string) => 
      [...queryKeys.nounus.all, 'detail', id] as const,
  },
};
```

### 3. Création d'une API Feature

```typescript
// src/features/nounus/api/nounus.api.ts
import { apiClient } from '@/lib/api';
import { PaginatedResponse } from '@/lib/api/types';

export const nounusApi = {
  getAll: async (params: GetNounusParams): Promise<PaginatedResponse<Nounu>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    return apiClient.get(`/nounus?${queryParams.toString()}`);
  },
  
  getById: async (id: string): Promise<Nounu> => {
    return apiClient.get(`/nounus/${id}`);
  },
};
```

### 4. Création de Hooks personnalisés

```typescript
// src/features/nounus/hooks/useNounus.ts
import { useQuery, useInfiniteQuery } from '@tanstack/vue-query';
import { computed, Ref } from 'vue';

// Query simple
export function useNounus(params: Ref<GetNounusParams>) {
  return useQuery({
    queryKey: computed(() => queryKeys.nounus.list(params.value)),
    queryFn: () => nounusApi.getAll(params.value),
  });
}

// Infinite Query pour pagination
export function useInfiniteNounus(params: Ref<Omit<GetNounusParams, 'page'>>) {
  return useInfiniteQuery({
    queryKey: computed(() => queryKeys.nounus.list(params.value)),
    queryFn: ({ pageParam = 1 }) => 
      nounusApi.getAll({ ...params.value, page: pageParam }),
    getNextPageParam: (lastPage: PaginatedResponse<Nounu>) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

// Mutation
export function useCreateNounu() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Nounu>) => nounusApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nounus.lists() });
    },
  });
}
```

### 5. Utilisation dans les composants

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useInfiniteNounus } from '@/features/nounus/hooks/useNounus';

const filters = ref({
  userId: '',
  search: '',
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

const loadMore = () => {
  if (hasNextPage.value && !isFetchingNextPage.value) {
    fetchNextPage();
  }
};
</script>
```

---

## 🎨 Design System

### Composants disponibles

#### 1. Button
```vue
<Button 
  variant="primary"    // primary | secondary | outline | ghost | danger
  size="lg"            // sm | md | lg | xl
  :loading="false"
  :disabled="false"
  rounded
  fullWidth
  @click="handleClick"
>
  Cliquez ici
</Button>
```

#### 2. Card
```vue
<Card 
  variant="elevated"   // elevated | outlined | filled
  className="p-4"
>
  <h3>Titre de la carte</h3>
  <p>Contenu...</p>
</Card>
```

#### 3. Badge
```vue
<Badge 
  variant="primary"    // primary | secondary | success | warning | danger | info
  size="md"            // sm | md | lg
  rounded
>
  Nouveau
</Badge>
```

#### 4. Avatar
```vue
<Avatar 
  :src="user.avatar"
  :name="user.fullname"
  size="lg"            // xs | sm | md | lg | xl | 2xl
  status="online"      // online | offline | busy
  rounded
/>
```

#### 5. Input
```vue
<Input 
  v-model="email"
  type="email"
  label="Email"
  placeholder="votre@email.com"
  :error="errors.email"
  hint="Entrez votre adresse email"
  required
  size="md"            // sm | md | lg
>
  <template #prefix>
    <IcIcons name="RiMailLine" :size="20" />
  </template>
</Input>
```

#### 6. Tabs
```vue
<Tabs 
  v-model="activeTab"
  :tabs="[
    { label: 'Tout', value: 'all', icon: 'RiListCheck', badge: 12 },
    { label: 'Actifs', value: 'active', icon: 'RiCheckLine' },
  ]"
>
  <div v-if="activeTab === 'all'">Contenu tout</div>
  <div v-else>Contenu actifs</div>
</Tabs>
```

---

## ✨ Bonnes pratiques

### 1. Typage TypeScript
```typescript
// ✅ BON - Types explicites
interface Nounu {
  id: string;
  fullname: string;
  email: string;
  // ...
}

// ❌ MAUVAIS - any
const data: any = await fetchData();
```

### 2. Composition API
```vue
<!-- ✅ BON - Script setup -->
<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);
</script>

<!-- ❌ MAUVAIS - Options API (sauf si nécessaire) -->
<script lang="ts">
export default {
  data() {
    return { count: 0 };
  },
};
</script>
```

### 3. Gestion des états
```typescript
// ✅ BON - TanStack Query pour données serveur
const { data, isLoading } = useNounus(filters);

// ✅ BON - ref/reactive pour état local
const isModalOpen = ref(false);

// ❌ MAUVAIS - Store Pinia pour données serveur
const nounusStore = useNounusStore();
await nounusStore.fetchNounus();
```

### 4. Organisation des imports
```typescript
// ✅ BON - Imports organisés
// 1. Vue & frameworks
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// 2. Composants externes
import { IonPage, IonContent } from '@ionic/vue';

// 3. Composants internes
import { Button, Card } from '@/components/ui';

// 4. Hooks & utils
import { useNounus } from '@/features/nounus/hooks/useNounus';

// 5. Types
import type { Nounu } from '@/features/nounus/types';
```

### 5. Nommage des fichiers
```
✅ BON:
- PascalCase pour composants: Button.vue, NounuCard.vue
- camelCase pour hooks: useNounus.ts
- kebab-case pour utils: format-date.ts

❌ MAUVAIS:
- button.vue, nounucard.vue
- UseNounus.ts
- FormatDate.ts
```

### 6. Performance
```vue
<script setup lang="ts">
// ✅ BON - Computed pour valeurs dérivées
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// ❌ MAUVAIS - Recalcul à chaque render
const fullName = `${firstName.value} ${lastName.value}`;

// ✅ BON - v-lazy pour images
<img v-lazy="imageUrl" />

// ✅ BON - Pagination infinie
const { fetchNextPage, hasNextPage } = useInfiniteNounus(filters);
</script>
```

---

## 🚀 Migration depuis l'ancienne architecture

### Étape 1: Créer la feature
```bash
src/features/nounus/
├── api/nounus.api.ts
├── hooks/useNounus.ts
├── types/index.ts
└── components/
```

### Étape 2: Migrer les appels API
```typescript
// AVANT (services/setting.services.ts)
const listSetting = async (Route: string) => {
  const headers = await getAuthHeaders();
  const response = await axios.get(Route, { headers });
  return response.data;
};

// APRÈS (features/nounus/api/nounus.api.ts)
export const nounusApi = {
  getAll: async (params: GetNounusParams) => {
    return apiClient.get('/nounus', { params });
  },
};
```

### Étape 3: Créer les hooks
```typescript
// features/nounus/hooks/useNounus.ts
export function useNounus(params: Ref<GetNounusParams>) {
  return useQuery({
    queryKey: computed(() => queryKeys.nounus.list(params.value)),
    queryFn: () => nounusApi.getAll(params.value),
  });
}
```

### Étape 4: Mettre à jour les composants
```vue
<!-- AVANT -->
<script setup lang="ts">
const fetchNounus = async () => {
  const response = await SettingServices().listSetting(url);
  dataNounus.value = response.data;
};
</script>

<!-- APRÈS -->
<script setup lang="ts">
import { useNounus } from '@/features/nounus/hooks/useNounus';

const filters = ref({ userId: '' });
const { data: nounus, isLoading } = useNounus(filters);
</script>
```

---

## 📚 Ressources

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/vue/overview)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Ionic Vue](https://ionicframework.com/docs/vue/overview)

---

**Créé le**: 26 Juin 2026  
**Version**: 1.0.0  
**Auteur**: Cascade AI
