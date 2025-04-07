import { z } from "zod";

// Schéma pour un fichier individuel
const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size > 0, // Vérifie que le fichier n'est pas vide
    { message: "Le fichier ne doit pas être vide." }
  )
  .refine(
    (file) => ["image/jpeg", "image/png"].includes(file.type), // Vérifie le type MIME
    { message: "Seuls les fichiers JPEG et PNG sont acceptés." }
  )
  .refine(
    (file) => file.size <= 5 * 1024 * 1024, // Limite à 5 Mo par fichier
    { message: "Chaque fichier doit être inférieur à 5 Mo." }
  );

const fileUpdateSchema = z
  .instanceof(File)
  .refine(
    (file) => file?.size > 0, // Vérifie que le fichier n'est pas vide
    { message: "Le fichier ne doit pas être vide." }
  )
  .refine(
    (file) => ["image/jpeg", "image/png"].includes(file?.type), // Vérifie le type MIME
    { message: "Seuls les fichiers JPEG et PNG sont acceptés." }
  )
  .refine(
    (file) => file?.size <= 5 * 1024 * 1024, // Limite à 5 Mo par fichier
    { message: "Chaque fichier doit être inférieur à 5 Mo." }
  );

export const InformationPersonnelleSchema = z.object({
  image_profil: z
    .any()
    .optional() // Rend le champ optionnel
    .refine(
      (value) => !value || value instanceof FileList, // Vérifie que c'est un FileList (ou undefined)
      { message: "La photo de profil doit être une image JPEG ou PNG." }
    ),
  fullname: z.string().min(1, { message: "Le nom ne doit pas d'etre vide" }),
  adresse_mail: z.string().email({ message: "L'adresse email est invalide" }),
  phone: z
    .string()
    .regex(/^\+?\d{9,14}$/, { message: "Le numéro de téléphone est invalide" }),
});
export type InformationPersonnelle = z.infer<
  typeof InformationPersonnelleSchema
>;

export const InformationSurLesEnfantsSchema = z.object({
  number_of_children: z
    .string()
    .min(1, { message: "Le nombre d'enfants ne doit pas d'etre vide" }),
  besions_specifiques: z
    .array(z.any())
    .min(1, { message: "Les besoins specifiques ne doit pas d'etre vide" }),
});

export const ServicesRecherchesSchema = z.object({
  garde_enfants: z
    .array(z.any())
    .min(1, {
      message: "Les activités de garde d'enfants ne doivent pas d'etre vide",
    }),
  aide_menagere: z
    .array(z.any())
    .min(1, {
      message: "Les activités d'aide ménagère ne doivent pas d'etre vide",
    }),
  frequence_des_services: z
    .array(z.any())
    .min(1, { message: "La fréquence des services ne doit pas d'etre vide" }),
  horaire_souhaites: z
    .array(z.any())
    .min(1, { message: "Les horaires souhaités ne doivent pas d'etre vide" }),
});

export const LocalizationsSchema = z.object({
  adress: z
    .array(z.any())
    .min(1, { message: "L'adresse ne doit pas d'etre vide" }),
  zone_geographique_prestataire: z
    .array(z.any())
    .min(1, {
      message: "La zone géographique du prestataire ne doit pas d'etre vide",
    }),
});

export const TarificationsSchema = z.object({
  budget_estimated: z
    .string()
    .min(1, { message: "Le budget estimé ne doit pas d'etre vide" }),
});

export const PreferencePourLesSpecifiquesSchema = z.object({
  competance_specifique: z
    .array(z.any())
    .min(1, {
      message: "Les compétences spécifiques ne doivent pas être vides",
    }),
  langue_parler: z
    .array(z.any())
    .min(1, { message: "Les langues parlées ne doivent pas être vides" }),
  disponibility_du_prestataire: z
    .array(z.any())
    .min(1, {
      message: "La disponibilité du prestataire ne doit pas être vide",
    }),
});

export const ModalitesDePaiementSchema = z.object({
  mode_de_paiement: z
    .array(z.any())
    .min(1, { message: "Le mode de paiement ne doivent pas d'etre vide" }),
});

export const AutreInformationsSchema = z.object({
  informations_complementaires: z
    .string()
    .min(1, {
      message: "Les informations complémentaires ne doivent pas être vides",
    }),
});
