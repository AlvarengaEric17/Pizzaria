import prismaClient from "../../prisma/index.js";

interface DetailOrderProps {
    order_id: string;
}

class DetailOrderService {
    async execute({ order_id }: DetailOrderProps) {
        try {
            const orderExists = await prismaClient.order.findFirst({
                where: {
                    id: order_id
                }
            });

            if (!orderExists) {
                throw new Error("Pedido não encontrado");
            }

            const order = await prismaClient.order.findFirst({
                where: {
                    id: order_id
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    draft: true,
                    status: true,
                    createAt: true,
                    items: {
                        select: {
                            id: true,
                            amount: true,
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    price: true,
                                    banner: true
                                }
                            }
                        }
                    }
                }
            });

            if (!order) {
                throw new Error("Pedido não encontrado");
            }

            return order;
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao detalhar pedido");
        }
    }
}

export { DetailOrderService };
