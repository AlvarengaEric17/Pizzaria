import { Request, Response } from "express";

import { AddItemOrderService } from "../../services/Order/AddItemOrderService.js";

class AddItemOrderController {
    async handle(req: Request, res: Response) {
        const { order_id, product_id, amount } = req.body;

        const addItemOrder = new AddItemOrderService();

        const item = await addItemOrder.execute({
            order_id: order_id,
            product_id: product_id,
            amount: amount
        });

        return res.status(201).json(item);
    }
}

export { AddItemOrderController };