import { z } from "zod";

// export const ChidrenInfoProfilSchema = z.object({
//   numberOfChildren: z
//     .string()
//     .min(1, { message: "Le nombre d'enfants ne doit pas d'etre vide" }),
//   agesOfChildrens: z
//     .string()
//     .min(1, { message: "L'âge des enfants ne doit pas d'etre vide" }),
//   specificNeeds: z
//     .string()
//     .min(1, {
//       message: "Les besoins spéciaux des enfants ne doivent pas d'etre vide",
//     }),
// });
// export type ChidrenInfoProfilSchema = z.infer<typeof ChidrenInfoProfilSchema>;

export const InfoPersonalProfilSchema = z.object({
  image_profil: z.any().refine((val) => val instanceof Blob, {
    message: "La photo doit être une image",
  }),
  fullName: z.string().min(3, { message: "Le nom doit avoir au moins 3 caractères" }),
  age: z.string().min(1, { message: "L'âge ne doit pas d'etre vide" }),
  phone: z
    .string()
    .regex(/^\+?\d{9,14}$/, { message: "Le numéro de téléphone est invalide" }),
  address: z.string().min(1, { message: "L'adresse ne doit pas d'etre vide" }),
  
});
export const ExperienceAndSkillProfilSchema = z.object({
  yearsOfExperience: z.string().min(1, { message: "Les années d'expérience ne doit pas d'etre vide" }),
  ageGroupOfChildren: z.string().min(1, { message: "La tranche d'âge des enfants ne doit pas d'etre vide" }),
  specificSkills: z.string().min(1, { message: "Les compétences spécifiques ne doit pas d'etre vide" }),
  languages: z.string().min(1, { message: "La langue ne doit pas d'etre vide" }),
});
export const AvailabeProfilSchema = z.object({
  schedulesAvailable: z.string().min(1, { message: "Les horaires disponibles ne doit pas d'etre vide" }),
  emergencie: z.string().min(1, { message: "Les urgences ne doit pas d'etre vide" }),
});
export const PricingProfilSchema = z.object({
  hourlyRate: z.string().min(1, { message: "Le tarif horaire ne doit pas d'etre vide" }),
  monthlyRate: z.string().min(1, { message: "Le tarif mensuel ne doit pas d'etre vide" }),
  flexiblePrice: z.string().min(1, { message: "La flexibilité des tarifs ne doit pas d'etre vide" }),
});
export const VerificationProfilSchema = z.object({
  verificationOfConfirmed: z.any().refine((val) => val instanceof Blob, {
    message: "La photo doit être une image",
  }),
  refrence_1: z.string().min(1, { message: "La référence 1 est requise" }),
  refrence_2: z.string().optional(),
  reference_3: z.string().optional(),
  certifications: z.string().min(1, { message: "Les certifications ne doivent pas d'etre vide" }),
});
export const BiographieProfilSchema = z.object({
  text: z.string().min(1, { message: "Le champ texte ne doit pas d'etre vide" }),
});
export const AreaWorkProfilSchema = z.object({
  areaWork: z.string().min(1, { message: "La zone de travail ne doit pas d'être vide" }),
});
export const GaleryProfilSchema = z.object({
  gallery: z.array(z.any().refine((val) => val instanceof Blob, {
    message: "La galerie doit contenir des images",
  })).min(1, {
    message: "La galerie doit contenir au moins une image",
  }),
});
