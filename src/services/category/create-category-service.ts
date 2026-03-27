import { db } from "../../lib/prisma"

interface ICreateCategory {
    name: string
}

export class CreateCategoryService {
    async execute({ name }: ICreateCategory){
        const categoryExists = await db.category.findFirst({
            where: {
                name: name
            }
        })
        try {

            if(categoryExists){
                throw new Error('Categoria já existe')
            }

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
            if(categoryExists){
                throw new Error('Categoria já existe');
            }
            throw new Error('Falha ao criar categoria')
        }
    }
}