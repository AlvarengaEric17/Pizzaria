import prismaClient from "../../prisma/index.js";

interface FinishOrderProps {

    order_id: string;
}

class FinishOrderService {
    async execute({ order_id }: FinishOrderProps) {
        try {
            // Verifica se essa order_id existe?
            const order = await prismaClient.order.findFirst({
                where: {
                    id: order_id,
                },
            });

            if (!order) {
                throw new Error("Falha ao finalizar pedido");
            }

            // Atualiza a propriedade draft para false (enviar para cozinha)
            const updateOrder = await prismaClient.order.update({
                where: {
                    id: order_id,
                },
                data: {
                    status: true,
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    draft: true,
                    status: true,
                    createAt: true,
                },
            });

            return updateOrder;
        } catch (err) {
            console.log(err);
            throw new Error("Falha ao enviar pedido");
        }
    }
}

export { FinishOrderService };
