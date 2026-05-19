import { Query } from "pg";
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

export const removeItemOrderSchema = z.object({
    query: z.object({
        item_id: z.string({ message: "O id do item deve ser uma string" }).min(1, { message: "O id do item é obrigatório" })
    }),
});

export const detailOrderSchema = z.object({
    query: z.object({
        order_id: z.string({ message: "O id do pedido deve ser uma string" }).min(1, { message: "O id do pedido é obrigatório" })
    }),
});

export const sendOrderSchema = z.object({
    body: z.object({
        order_id: z.string({ message: "O id do pedido é obrigatório" }),
        name: z.string({ message: "O nome do cliente é obrigatório" })
    }),
});

export const finishOrderSchema = z.object({
    body: z.object({
        order_id: z.string({ message: "O id do pedido é obrigatório" })
    }),
});

export const deleteOrderSchema = z.object({
    query: z.object({
        order_id: z.string({ message: "O id do pedido é obrigatório" })
    }),
});

