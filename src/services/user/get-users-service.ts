import { db } from "../../lib/prisma";

export class GetUsersService {
    async getAll(){
        const users = await db.user.findMany({})

        return users
    }

    // async getUnique(email?: string){
    //     const user = await db.user.findUnique({
    //         where: {
    //             email: email
    //         }
    //     })

    //     if(!user){
    //         throw new Error('Usuário não encontrado')
    //     }

    //     return user
    // }
}