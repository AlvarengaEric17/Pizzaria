import prismaClient from "../../prisma/index.js";

interface CreateOrderProps {
    table: number;
    name?: string;
}

class CreateOrderService {
    async execute({ table, name }: CreateOrderProps) {
        try {
            const order = await prismaClient.order.create({
                data: {
                    table: table,
                    name: name ?? "",
                   
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    draft: true,
                    status: true,
                    createAt: true,
                }
            });

            return order;
        } catch (err) {
            throw new Error("Falha ao criar pedido");
        }
    }
}

export { CreateOrderService };
