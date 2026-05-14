import prismaClient from "../../prisma/index.js";

interface ListOrderProps {
    draft?: string
}


class ListOrderService {
    async execute({ draft }: ListOrderProps) {
        const order = await prismaClient.order.findMany({
            where: {
                draft: draft === "true" ? true : false
            }, select: {
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
        })

        return order;
    }


}

export { ListOrderService }