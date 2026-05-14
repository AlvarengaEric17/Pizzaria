import { Request, Response } from "express";

import { ListOrderService } from "../../services/Order/ListOrderService.js";

class ListOrderController {
    async handle(req: Request, res: Response) {
        const draft = req.query?.draft as string | undefined;

        const listOrder = new ListOrderService();

        const order = await listOrder.execute({
            draft: draft,
        });
        return res.status(200).json(order);

    }


}

export { ListOrderController }; 