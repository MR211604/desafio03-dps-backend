import { z } from "zod";

export const resourceSchema = z.object({
  title: z
    .string({ error: "El título es obligatorio" })
    .min(1, { error: "El título debe tener al menos 1 carácter" }),
  description: z
    .string({ error: "La descripción es obligatoria" })
    .min(1, { error: "La descripción debe tener al menos 1 carácter" }),
  url: z.string({ error: "La URL es obligatoria" }),
  type: z.enum(["VIDEO", "ARTICLE", "BOOK", "COURSE"], {
    error: "Tipo de recurso inválido, debe ser: VIDEO, ARTICLE, BOOK o COURSE",
  }),
  image: z.string().optional(),
});
