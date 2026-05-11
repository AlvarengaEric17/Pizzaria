import prismaClient from "../../prisma/index.js";

class ListCategoryService {
    async execute() {

        try {
            const categories = await prismaClient.category.findMany({
                select: {
                    id: true,
                    name: true,
                    createAt: true,
                }, orderBy: {
                    createAt: "desc"
                }
            })

            return categories;

        } catch (err) {
            throw new Error("Falha ao listar categorias")
        }


    }
}

export { ListCategoryService }
