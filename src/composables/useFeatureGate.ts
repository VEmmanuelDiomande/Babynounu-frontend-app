import { useAbonnementStore } from '@/stores/abonnementStore';
import { useRouter } from 'vue-router';

export const FEATURE_LABELS: Record<string, string> = {
  view_profiles: 'Accès aux profils des nounous',
  unlimited_messaging: 'Messagerie illimitée',
  advanced_search: 'Recherche avancée',
  priority_requests: 'Mise en avant des demandes',
  early_access_nounus: 'Accès prioritaire aux nouvelles nounous',
  priority_support: 'Support prioritaire',
};

export const ALL_FEATURE_KEYS = Object.keys(FEATURE_LABELS);

export function useFeatureGate() {
  const abonnementStore = useAbonnementStore();
  const router = useRouter();

  const hasFeature = (key: string): boolean => {
    return abonnementStore.hasFeature(key);
  };

  const requireFeature = (key: string): boolean => {
    if (!hasFeature(key)) {
      router.push({ name: 'PackSubscrible' });
      return false;
    }
    return true;
  };

  const getFeatureLabel = (key: string): string => {
    return FEATURE_LABELS[key] || key;
  };

  return {
    hasFeature,
    requireFeature,
    getFeatureLabel,
  };
}
