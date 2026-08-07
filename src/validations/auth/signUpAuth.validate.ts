import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const signUpSchema = z.object({
  email: z.string().email({ message: "L'adresse email est invalide" }),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit avoir au moins 8 caractères" })
    .regex(passwordRegex, { message: "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre" }),
  type: z.string().min(1, { message: "Le type de compte est obligatoire" }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
