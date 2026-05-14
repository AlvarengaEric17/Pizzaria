import { Request, Response } from "express";
import { ListProductByCategoryService } from "../../services/Product/ListProductByCategoryService.js";

class ListProductByCategoryController {
    async handle(req: Request, res: Response) {
        const category_id = req.query.category_id as string;

        const listProductByCategoryService = new ListProductByCategoryService();

        const products = await listProductByCategoryService.execute({
            category_id: category_id,
        });

        return res.status(200).json(products);
    }
}

export { ListProductByCategoryController };
