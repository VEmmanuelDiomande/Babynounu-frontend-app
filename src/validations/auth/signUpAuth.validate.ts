import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email({ message: "L'adresse email est invalide" }),
  password: z.string().min(8, { message: "Le mot de passe doit avoir au moins 8 caractères" }),
  type: z.string().min(1, { message: "Le type de compte est obligatoire" }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
