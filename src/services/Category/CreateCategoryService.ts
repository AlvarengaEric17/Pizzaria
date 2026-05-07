import prismaClient from "../../prisma/index.js";

interface CreateCategoryProps {
    name: string;
}

class CreateCategoryService {
    async execute({ name }: CreateCategoryProps) {
        try {
            const category = await prismaClient.category.create({
                data: {
                    name: name,
                }, select: {
                    id: true,
                    name: true,
                    createAt: true
                }
            })

            return category;


        } catch (err) {
            throw new Error("Falha ao criar categotia")
        }
    }
}

export { CreateCategoryService }