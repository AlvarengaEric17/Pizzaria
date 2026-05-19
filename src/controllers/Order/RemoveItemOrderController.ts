import { Request, Response } from "express";

import { RemoveItemOrderService } from "../../services/Order/RemoveItemOrderService.js";

class RemoveItemOrderController {
    async handle(req: Request, res: Response) {
        const { item_id } = req.query;

        const removeItemOrder = new RemoveItemOrderService();

        const item = await removeItemOrder.execute({
            item_id: item_id as string
        });

        return res.status(200).json(item);
    }
}

export { RemoveItemOrderController };
