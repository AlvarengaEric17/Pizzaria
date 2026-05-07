import { Request, Response } from "express";

import { DetailUserSevice } from "../../services/user/detailUserService.js";

class DetailUserController {
    async handle(req: Request, res: Response) {

        const user_id = req.user_id;

        const detailUser = new DetailUserSevice();

        const user = await detailUser.execute(user_id)

        return res.json(user)

    }
}

export { DetailUserController }