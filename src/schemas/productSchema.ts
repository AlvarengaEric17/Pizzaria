import { z } from "zod";

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, "O nome do produto é obrigatório"),
        price: z.string().min(1, "O preço deve ser um número positivo").regex(/^\d+$/),
        description: z.string().min(1, "A descrição do produto é obrigatória"),
        category_id: z.string().min(1, "A categoria do produto é obrigatório"),
    })
});

export const listProductSchema = z.object({
    query: z.object({
        disable: z.string().optional()
    })
});

export const listProductByCategorySchema = z.object({
    query: z.object({
        category_id: z.string().min(1, "O category_id é obrigatório")
    })
});