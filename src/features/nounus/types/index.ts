export interface NounuImage {
  originalUrl: string;
  thumbnailUrl?: string;
  [key: string]: any;
}

export interface PreferenceItem {
  id: string;
  name: string;
  slug?: string;
  [key: string]: any;
}

export interface NounuPreferences {
  adress?: PreferenceItem[];
  zone_de_travail?: PreferenceItem[];
  horaire_disponible?: PreferenceItem[];
  age_des_enfants?: PreferenceItem[];
  besoins_specifique?: PreferenceItem[];
  langue_parler?: PreferenceItem[];
  langues_parlees?: PreferenceItem[];
  competences_specifiques?: PreferenceItem[];
  competance_specifique?: PreferenceItem[];
  type_services?: PreferenceItem[];
  certifications?: PreferenceItem[];
  aide_menagere?: PreferenceItem[];
  type_de_services?: PreferenceItem[];
  [key: string]: PreferenceItem[] | undefined;
}

export interface Nounu {
  id: string;
  fullname: string;
  email?: string;
  phone?: string;
  age?: number;
  type?: 'nounu' | 'menagere' | 'cuisiniere' | 'parent';
  status?: 'disponible' | 'indisponible' | 'busy';
  image?: NounuImage;
  avatar?: string;
  bio?: string;
  courte_biographie?: string;
  annees_experience?: number;
  tarif_horaire?: number | string;
  tarif_mensuel?: number | string;
  rating?: number;
  reviewCount?: number;
  certif?: 'Accepted' | 'Pending' | 'Rejected';
  preferences?: NounuPreferences;
  enfants?: Array<any>;
  service_recherche?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NounuFilters {
  search?: string;
  city?: string;
  minRate?: number;
  maxRate?: number;
  availability?: string;
  rating?: number;
  specialties?: string[];
  type?: 'nounu' | 'menagere' | 'cuisiniere' | 'parent' | 'all';
}
