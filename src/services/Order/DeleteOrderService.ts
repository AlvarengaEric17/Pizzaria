import prismaClient from "../../prisma/index.js";

interface DeleteOrderProps {

    order_id: string;
}

class DeleteOrderService {
    async execute({ order_id }: DeleteOrderProps) {
        try {
            // Verifica se essa order_id existe?
            const order = await prismaClient.order.findFirst({
                where: {
                    id: order_id,
                },
            });

            if (!order) {
                throw new Error("Falha ao excluir pedido");
            }

            // Exclui o pedido
            await prismaClient.order.delete({
                where: {
                    id: order_id,
                },

            });

            return { message: "Pedido excluído com sucesso" };
        } catch (err) {
            console.log(err);
            throw new Error("Falha ao excluir pedido");
        }
    }
}

export { DeleteOrderService };
