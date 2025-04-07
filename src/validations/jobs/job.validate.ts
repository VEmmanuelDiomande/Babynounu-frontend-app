import { z } from "zod";

// Schéma pour les informations générales
export const InformationsGeneralesSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  description: z
    .string()
    .min(50, "La description doit contenir au moins 50 caractères"),
    moyens_de_contact: z
    .array(z.any())
    .min(1, "Ajoutez au moins un moyen de contact"),
  adress: z.array(z.any()).min(1, "L'adresse est requise"),
  zone_de_travail: z.array(z.any()).min(1, "La zone de travail est requise"),
 
});

// Schéma pour les types de services
export const TypeServiceSchema = z.object({
  type_services: z
    .array(z.any())
    .min(1, "Sélectionnez au moins un type de service"),
  combinaison_service: z
    .array(z.any())
    .min(1, "Sélectionnez au moins une combinaison de service"),
  taches: z.array(z.any()).min(1, "Ajoutez au moins une tâche"),
});

// Schéma pour les détails de mission
export const DetailsMissionSchema = z.object({
  frequence_des_services: z
    .array(z.any())
    .min(1, "Sélectionnez une fréquence"),
  horaire_souhaites: z.array(z.any()).min(1, "Sélectionnez des horaires"),
  inclus_weekend: z
    .array(z.any())
    .min(1, "Sélectionnez si le week-end est inclus"),
});

// Schéma pour les nounous
export const NounouSchema = z.object({
  nombre_enfants: z.string().optional(),
  garde_enfants: z.array(z.any()).optional(),
  besions_specifiques: z.array(z.any()).optional(),
  competance_specifique: z.array(z.any()).optional(),
  langue_parler: z.array(z.any()).optional(),
});

// Schéma pour les femmes de ménage
export const FemmeDeMenageSchema = z.object({
  aide_menagere: z.array(z.any()).optional(),
  equipement_menager: z.array(z.any()).optional(),
});

// Schéma pour les critères de sélection
export const CriteresSchema = z.object({
  experience_minimun: z.array(z.any()).min(1, "Sélectionnez une experience minimun"),
  annee_experience: z
    .string()
    .min(1, "Le nombre d'années d'expérience est requis"),
  certifications: z.array(z.any()).optional(),
  criteres_selections: z
    .array(z.any())
    .min(1, "Ajoutez au moins un critère de sélection"),
});

// Schéma pour la rémunération
export const RemunerationSchema = z.object({
  tarifPropose: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Format numérique invalide"),
  negociable: z.array(z.any()).min(1, "Sélectionnez si la remunération est negociable"),
});

// Schéma pour la date de début
export const DateDebutSchema = z.object({
  dateDebut: z.string().min(1, "La date de debut est requise"),
  missionUrgente: z
    .array(z.any())
    .min(1, "Sélectionnez si la mission est urgente"),
});

// Schéma pour les autres informations
export const AutresInfosSchema = z.object({
  descriptionComplementaire: z
    .string()
    .min(100, "Description trop courte (min. 100 caractères)"),
  photoVideo: z.array(z.instanceof(File)).optional(),
});

// Export global du store
export const JobSchemas = {
  InformationsGeneralesSchema,
  TypeServiceSchema,
  DetailsMissionSchema,
  NounouSchema,
  FemmeDeMenageSchema,
  CriteresSchema,
  RemunerationSchema,
  DateDebutSchema,
  AutresInfosSchema,
};
