import prismaClient from "../../prisma/index.js";

interface ListProductByCategoryServiceProps {
  category_id: string;
}

class ListProductByCategoryService {
  async execute({ category_id }: ListProductByCategoryServiceProps) {
    try {
      const products = await prismaClient.product.findMany({
        where: {
          category_id: category_id,
          disabled: false,
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          banner: true,
          disabled: true,
          category_id: true,
          createAt: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createAt: "desc",
        },
      });

      return products;
    } catch (err) {
      throw new Error("Falha ao buscar produtos da categoria");
    }
  }
}

export { ListProductByCategoryService };
