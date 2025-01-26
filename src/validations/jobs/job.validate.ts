import { z } from "zod";

export const InfoGeneralJobSchema = z.object({
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
