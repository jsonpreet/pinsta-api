// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'GET') {
        const requestType = req.query.type
        const id = req.query.id
        const profile = req.query.profile
        const name = req.query.name
        const data = req.body
        const slug = name?.toLowerCase()
       // console.log('board request', requestType, id, profile, data);
        
        if (requestType === 'board' && id !== null) {
            const board = await prisma.boards.findUnique({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json(board)
        }

        if (requestType === 'checkName' && name !== null && profile !== null) {
            // const board = await prisma.$queryRaw`SELECT * FROM boards WHERE name ILIKE '${name}'`;
            // console.log(board)
            // console.log('check name', name, profile)
            const board = await prisma.$queryRawUnsafe(
                'SELECT * FROM "boards" WHERE (name = $1 OR name ILIKE $2)',
                name,
                `%${name}`
            )
            // const board = await prisma.boards.findMany({
            //     where: {
            //         OR: [
            //             {
            //                 name:  name as string
            //             },
            //             {
            //                 name: slug as string
            //             }
            //         ],
            //     }
            // })
            if (board && board.length > 0 && board[0].user === profile) {
                return res.status(200).json({ success: false, message: 'Board name already exists!' })
            }
            return res.status(200).json({ success: true, message: 'Board name is available!' })
   
        }

        if (requestType === 'profile' && id !== null) {
            const boards = await prisma.boards.findMany({
                where: {
                    user: id as string
                }
            })
            return res.status(200).json(boards)
        }

        if (requestType === 'profileBoard' && id === null && profile !== null) {
            const board = await prisma.pins.findMany({
                where: {
                    user: profile as string,
                    board: id as string
                }
            })
            return res.status(200).json(board)   
        }

        if (requestType === 'board' && id !== null) {
            const board = await prisma.boards.findUnique({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json(board)
        }

        if (requestType === 'all') {
            const boards = await prisma.boards.findMany()
            return res.status(200).json(boards)
        } 

        return res.status(400).json({ success: false, message: 'Bad request!' })
    }

    if (req.method === 'POST') {
        const body = req.body
        const data = req.body.data
        const id = data.id as string
        console.log('board request', body)
        if (body.type === 'create') {
            try {
                const board = await prisma.boards.create({
                    data: {
                        name: body.data.name,
                        slug: body.data.slug,
                        description: body.data.description ? body.data.description : '',
                        user: body.data.user,
                        pfp: body.data.pfp ? body.data.pfp : '',
                        cover: body.data.cover ? body.data.cover : '',
                        category: body.data.category ? body.data.category : '',
                        tags: body.data.tags ? body.data.tags : '',
                        is_private: body.data.is_private,
                    }
                })
                return res.status(200).json(board)
            } catch (e) {
                console.log(e);
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    // The .code property can be accessed in a type-safe manner
                    console.log(e.code)
                }
                return res.status(400).json({ success: false, message: 'Bad request!' })
            }
        }

        if (body.type === 'update') {
            const board = await prisma.boards.update({
                where: {
                    id: body.data.id
                },
                data: {
                    name: body.data.name,
                    slug: body.data.slug,
                    description: body.data.description ? body.data.description : '',
                    user: body.data.user,
                    pfp: body.data.pfp ? body.data.pfp : '',
                    cover: body.data.cover ? body.data.cover : '',
                    is_private: body.data.is_private,
                    category: body.data.category ? body.data.category : '',
                    tags: body.data.tags ? body.data.tags : '',
                }
            })
            return res.status(200).json(board)
        }

        if (body.type === 'delete') {
            // delete pins
            const pinsExist = await prisma.pins.count({
                where: {
                    board: id
                } 
            })
            if (pinsExist > 0) {
                const pins = await prisma.pins.findMany({
                    where: {
                        boardId: id as string
                    }
                })
                pins.forEach(async pin => {
                    await prisma.pins.delete({
                        where: {
                            id: pin.id
                        }
                    })
                })
            }
                        
            const board = await prisma.boards.delete({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json(board)
        }

        // const board = await prisma.boards.create({
        //     data: {
        //         name: req.body.name,
        //         description: req.body.description,
        //         user: req.body.user,
        //         pfp: req.body.pfp,
        //         cover: req.body.cover,
        //         is_private: req.body.is_private,
        //         category: req.body.category,
        //         tags: req.body.tags,
        //     }
        // })
        // res.status(200).json(board)
    }
}
