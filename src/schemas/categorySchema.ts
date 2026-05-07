import { z } from "zod";

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string({ message: "Categoria precisa ser um texto" }).min(2, { message: "Nome da Categoria precisa ter 2 caracteres" })
    }),
});