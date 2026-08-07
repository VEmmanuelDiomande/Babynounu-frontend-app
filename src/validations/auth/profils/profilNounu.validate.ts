import { useAuthStore } from "@/stores/auth.store";
import { z } from "zod";

// Helper pour la validation de fichier
const fileSchema = z.instanceof(File).superRefine((file, ctx) => {
  if (file.size === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Veuillez selectionner un fichier",
    });
  }
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Seuls les formats JPEG et PNG sont acceptés",
    });
  }
  if (file.size > 5 * 1024 * 1024) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La taille du fichier doit être inférieure à 5 Mo",
    });
  }
});

const isUpdateProfil = () => {
  const BtnIsUpdateProfil: any = document.getElementById("is-update-profil");
  return BtnIsUpdateProfil?.value == "true" ? true : false;
};

export const InformationPersonnelleSchema = z.object({
  image_profil:
    isUpdateProfil() == false
      ? z
          .any()
          .refine(
            (files: any) => files instanceof FileList && files.length > 0,
            { message: "La photo de profil est requise" }
          )
          .transform((files: any) => files[0])
          .pipe(fileSchema)
      : z.any().optional(),

  fullname: z.string().min(1, "Le nom complet est requis"),
  age: z.coerce.string().min(1, "L'âge est requis"),
  phone: z.string().regex(/^\+?[0-9\s.-]{9,14}$/, {
    message:
      "Numéro de téléphone invalide, format international accepté (+33 6 12 34 56 78)",
  }),
  address: z.array(z.any()).min(1, "L'adresse est requise"),
});


export const InformationPersonnelleUpdateSchema = z.object({
  image_profil: z.any().optional(),
  fullname: z.string().min(1, "Le nom complet est requis"),
  age: z.coerce.string().min(1, "L'âge est requis"),
  phone: z.string().regex(/^\+?[0-9\s.-]{9,14}$/, {
    message:
      "Numéro de téléphone invalide, format international accepté (+33 6 12 34 56 78)",
  }),
  address: z.array(z.any()).min(1, "L'adresse est requise"),
});

export const ExperienceEtCompetencesSchema = z.object({
  annees_experience: z.coerce
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "Doit être un nombre valide"),
  tranche_age_enfants: z
    .array(z.any())
    .min(1, "Sélectionnez la tranche d'age des enfants"),
    competance_specifique: z
    .array(z.any())
    .min(1, "Sélectionnez les compétences spécifiques"),
  langue_parler: z.array(z.any()).min(1, "Sélectionnez les langues parlées"),
});

export const DisponibilitesSchema = z.object({
  horaire_disponible: z
    .array(z.any())
    .min(1, "Sélectionnez les horaires de disponibilité"),
  urgences: z.array(z.any()).min(1, { message: "Les urgences sont requises" }),
});

export const TarificationsSchema = z.object({
  tarif_horaire: z.coerce
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "Doit être un nombre valide"),
  tarif_mensuel: z.coerce
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "Doit être un nombre valide"),
  flexibilite_tarifaire: z
    .array(z.any())
    .min(1, { message: "La flexibilité tarifaire est requise" }),
});

export const VerificationEtReferencesSchema = z.object({
  verification_confirmer: z
          .array(z.instanceof(File))
          .min(1, { message: "Au moins un fichier est requis" })
          .refine((files) => files.every((file) => file.size > 0), {
            message: "Les fichiers ne doivent pas être vides.",
          })
          .refine(
            (files) =>
              files.every((file) =>
                ["image/jpeg", "image/png"].includes(file.type)
              ),
            { message: "Seuls les fichiers JPEG et PNG sont acceptés." }
          )
          .refine(
            (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
            {
              message: "Chaque fichier doit être inférieur à 5 Mo.",
            }
          ),
  references: z
    .array(
      z.object({
        fullname: z.string().min(1, "Le nom complet est requis"),
        phone: z
          .string()
          .regex(
            /^\+?[0-9\s.-]{9,14}$/,
            "Numéro de téléphone invalide, format international accepté (+33 6 12 34 56 78)"
          ),
      })
    )
    .min(1, "Au moins une référence est requise"),
  certifications: z.array(z.any()).min(1, "Sélectionnez les certifications"),
});



export const VerificationEtReferencesUpdateSchema = z.object({
  verification_confirmer: z
    .any()
    .optional(),
  references: z
    .array(
      z.object({
        fullname: z.string().min(1, "Le nom complet est requis"),
        phone: z
          .string()
          .regex(
            /^\+?[0-9\s.-]{9,14}$/,
            "Numéro de téléphone invalide, format international accepté (+33 6 12 34 56 78)"
          ),
      })
    )
    .min(1, "Au moins une référence est requise"),
  certifications: z.array(z.any()).min(1, "Sélectionnez les certifications"),
});




export const PresentationDuPersonnelSchema = z.object({
  courte_biographie: z
    .string()
    .min(100, "La biographie doit contenir au moins 100 caractères")
    .max(1000, "La biographie ne doit pas dépasser 1000 caractères"),
});

export const EvaluationEtAvisSchema = z.object({
  evaluation_precedentes: z
    .array(
      z.object({
        nom: z.string().min(1, "Le nom complet est requis"),
        phone: z
          .string()
          .regex(
            /^\+?[0-9\s.-]{9,14}$/,
            "Numéro de téléphone invalide, format international accepté (+33 6 12 34 56 78)"
          ),
        note: z
          .string()
          .refine(
            (val) =>
              !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 5,
            {
              message: "La note doit être entre 1 et 5",
            }
          ),
        commentaire: z
          .string()
          .min(10, "Le commentaire doit contenir au moins 10 caractères"),
      })
    )
    .min(1, "Au moins une évaluation est requise"),
});

export const DisponibiliteGeographiqueSchema = z.object({
  zone_de_travail: z.array(z.any()).min(1, "Sélectionnez la zone de travail"),
});

export const GalerySchema = z.object({
  gallery:
    isUpdateProfil() == false
      ? z
          .array(z.instanceof(File))
          .refine((files) => files.every((file) => file.size > 0), {
            message: "Les images ne doivent pas être vides.",
          })
          .refine(
            (files) =>
              files.every((file) =>
                ["image/jpeg", "image/png"].includes(file.type)
              ),
            { message: "Seuls les fichiers JPEG et PNG sont acceptés." }
          )
          .refine(
            (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
            {
              message: "Chaque fichier doit être inférieur à 5 Mo.",
            }
          )
      : z.any().optional(),
});

export const GaleryUpdateSchema = z.object({
  gallery: z.any().optional() // Ne reçoit rien et passe
    
});


export const FullFormSchema = z.object({
  InformationPersonnelle: InformationPersonnelleSchema,
  ExperienceEtCompetences: ExperienceEtCompetencesSchema,
  Disponibilites: DisponibilitesSchema,
  Tarifications: TarificationsSchema,
  VerificationEtReferences: VerificationEtReferencesSchema,
  PresentationDuPersonnel: PresentationDuPersonnelSchema,
  EvaluationEtAvis: EvaluationEtAvisSchema,
  DisponibiliteGeographique: DisponibiliteGeographiqueSchema,
  Galery: GalerySchema,
});

export type FullFormType = z.infer<typeof FullFormSchema>;
