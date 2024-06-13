/* eslint-disable prettier/prettier */
import * as z from "zod";

export const eventFormSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter pelo menos 3 caracteres!")
    .max(50, "O título deve ter no máximo 100 caracteres!"),
  description: z
    .string()
    .min(3, "A descrição deve ter pelo menos 3 caracteres!")
    .max(400, "A descrição deve ter no máximo 400 caracteres!"),
  location: z
    .string()
    .min(3, "A localização deve ter pelo menos 3 caracteres!")
    .max(400, "A localização deve ter no máximo 400 caracteres!"),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string().url("Campo não pode ser vazio ou URL inválida!"),
});
