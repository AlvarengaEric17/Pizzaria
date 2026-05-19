import { Request, Response } from "express";
import { DeleteOrderService } from "../../services/Order/DeleteOrderService.js";

class DeleteOrderController {
    async handle(req: Request, res: Response) {
        const  order_id  = req.query?.order_id as string;

        const deleteOrder = new DeleteOrderService();
        const deletedOrder = await deleteOrder.execute({ order_id: order_id });

        res.json(deletedOrder);
    }
}

export { DeleteOrderController };
