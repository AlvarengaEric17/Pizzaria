import prismaClient from "../../prisma/index.js";

interface ItemProps {
    order_id: string;
    product_id: string;
    amount: number;
}

class AddItemOrderService {
    async execute({ amount, order_id, product_id }: ItemProps) {
        try {

            const orderExists = await prismaClient.order.findFirst({
                where: {
                    id: order_id
                }
            });

            if (!orderExists) {
                throw new Error("Pedido não encontrado");
            }

            const prodductExists = await prismaClient.product.findFirst({
                where: {
                    id: product_id,
                    disabled: false
                }
            });

            if (!prodductExists) {
                throw new Error("Produto não encontrado");
            }

            const item = await prismaClient.item.create({
                data: {
                    amount: amount,
                    order_id: order_id,
                    product_id: product_id
                }, select: {
                    id: true,
                    amount: true,
                    order_id: true,
                    product_id: true,
                    createAt: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            description: true,
                            banner: true

                        }
                    }
                }
            });

            return item;

        } catch (err) {
            throw new Error("Falha ao adicionar item ao pedido");
        }
    }
}

export { AddItemOrderService }