import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        table: z.number({ message: "O número da mesa é obrigatório" }).int({ message: "o número da mesa precisa ser um número inteiro" }),
        name: z.string().optional()
    }),
});

export const addItemOrderSchema = z.object({
    body: z.object({
        order_id: z.string({ message: "O id do pedido é obrigatório" }),
        product_id: z.string({ message: "O id do produto é obrigatório" }),
        amount: z.number({ message: "A quantidade é obrigatória" }).int({ message: "A quantidade precisa ser um número inteiro" }).positive({
            message: "A quantidade precisa ser um número inteiro positivo"
        })
    }),
});
