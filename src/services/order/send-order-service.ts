import { db } from "../../lib/prisma"

interface SendOrderServiceProps {
    name: string
    order_id: string
}

export class SendOrderService {
    async execute({ name, order_id }: SendOrderServiceProps){
        try {
            const order = await db.order.findFirst({
                where: {
                    id: order_id
                }
            })

            if(!order){
                throw new Error('Pedido não encontrado')
            }

            const updateOrder = await db.order.update({
                where: {
                    id: order_id
                },
                data: {
                    draft: false,
                    name: name
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    draft: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                }
            })

            return updateOrder
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao enviar o pedido')
        }
    }
}