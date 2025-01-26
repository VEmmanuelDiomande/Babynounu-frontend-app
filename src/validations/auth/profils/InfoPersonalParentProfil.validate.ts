import { z } from "zod";

export const infoPersonalParentProfilSchema = z.object({
  fullName: z.string().min(3, { message: "Le nom doit avoir au moins 3 caractères" }),
  emailAdress: z.string().email({ message: "L'adresse email est invalide" }),
  phone: z
    .string()
    .regex(/^\+?\d{9,14}$/, { message: "Le numéro de téléphone est invalide" }),
});

export type infoPersonalParentProfilSchema = z.infer<typeof infoPersonalParentProfilSchema>;
