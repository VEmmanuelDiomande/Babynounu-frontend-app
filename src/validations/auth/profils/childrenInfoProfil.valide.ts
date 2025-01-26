import { z } from "zod";

export const chidrenInfoProfilSchema = z.object({
  numberOfChildren: z.string().min(3),
  agesOfChildrens: z.string().min(3),
  specificNeeds: z.string().min(3),
});

export type SignInSchema = z.infer<typeof chidrenInfoProfilSchema>;
