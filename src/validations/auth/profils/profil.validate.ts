import { z } from "zod";

export const ChidrenInfoProfilSchema = z.object({
  numberOfChildren: z
    .string()
    .min(1, { message: "Le nombre d'enfants ne doit pas d'etre vide" }),
  agesOfChildrens: z
    .string()
    .min(1, { message: "L'âge des enfants ne doit pas d'etre vide" }),
  specificNeeds: z.string().min(1, {
    message: "Les besoins spéciaux des enfants ne doivent pas d'etre vide",
  }),
});
export type ChidrenInfoProfilSchema = z.infer<typeof ChidrenInfoProfilSchema>;

export const ServicesSoughtParentProfilSchema = z.object({
  childcares: z
    .string()
    .min(1, { message: "Garde d'enfants ne doit pas d'etre vide" }),
  housekeepers: z.any(),
  frequencyOfServices: z
    .string()
    .min(1, { message: "La fréquence des services ne doit pas d'etre vide" }),
  desiredTimes: z
    .string()
    .min(1, { message: "Les horaires souhaités ne doivent pas d'etre vide" }),
});

export const LocalizationProfilSchema = z.object({
  my_address: z
    .string()
    .min(1, { message: "L'adresse ne doit pas d'etre vide" }),
  prestation_zone: z
    .string()
    .min(1, { message: "La zone de prestation ne doit pas d'etre vide" }),
});

export const PricingParentProfilSchema = z.object({
  price_min: z
    .string()
    .min(1, { message: "Le budget minimum ne doit pas d'etre vide" }),
  price_max: z
    .string()
    .min(1, { message: "Le budget maximum ne doit pas d'etre vide" }),
});

export const PreferenceParentProfilSchema = z.object({
  specificSkills: z
    .string()
    .min(1, { message: "Conpetences specifique ne doivent pas d'etre vide" }),
  languages: z
    .string()
    .min(1, { message: "La langue ne doivent pas d'etre vide" }),
  availabilityServiceProvider: z
    .string()
    .min(1, { message: "Disponibilité du prestataire ne doit pas d'etre vide" }),
});

export const PaymentTermsParentProfilSchema = z.object({
  payment_terms: z
    .string()
    .min(1, { message: "Le mode de paiement ne doivent pas d'etre vide" }),
});

export const AutreParentProfilSchema = z.object({
  autre_infos: z.string().min(1,  { message: "Le mode de paiement ne doivent pas d'etre vide" }),
});
