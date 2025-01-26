import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email({ message: "L'adresse email est invalide" }),
  password: z.string().min(8, { message: "Le mot de passe doit avoir au moins 8 caractères" }),
});

export type SignInSchema = z.infer<typeof signInSchema>;
