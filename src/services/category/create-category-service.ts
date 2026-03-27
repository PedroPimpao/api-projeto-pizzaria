import { db } from "../../lib/prisma"

interface ICreateCategory {
    name: string
}

export class CreateCategoryService {
    async execute({ name }: ICreateCategory){
        try {
            const category = await db.category.create({
                data: {
                    name: name
                },
                select: {
                    id: true,
                    name: true,
                    products: true,
                    createdAt: true,
                    updatedAt: true,
                }
            })
            return category
        } catch (error) {
            console.log(error)
            throw new Error('Falha ao criar categoria')
        }
    }
}