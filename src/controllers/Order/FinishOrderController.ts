import { Request, Response } from "express";
import { FinishOrderService } from "../../services/Order/FinishOrderService.js";

class FinishOrderController {
    async handle(req: Request, res: Response) {
        const { order_id } = req.body;

        const finishOrder = new FinishOrderService();
        const Updatedorder = await finishOrder.execute({ order_id: order_id });

        res.json(Updatedorder);
    }
}

export { FinishOrderController };
