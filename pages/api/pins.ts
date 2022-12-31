// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'GET') {
        const requestType = req.query.type
        const id = req.query.id
        const data = req.body
        const profile = req.query.profile
        console.log('pins request', requestType, id, profile, data);

        if (requestType === 'profileBoard' && id !== null && profile !== null) {
            const pinsExist = await prisma.pins.count({
                where: {
                    AND: [
                        { user: profile as string },
                        { board: id as string  }
                    ],
                }
            })

            if (pinsExist === 0) {
                return res.status(200).json({ success: false, message: 'No pins found!' })
            }

            const board = await prisma.pins.findMany({
                where: {
                    AND: [
                        { user: profile as string },
                        { board: id as string }
                    ],
                }
            })
            return res.status(200).json(board)   
        }

        if (requestType === 'profile' && id !== null) {
            const boards = await prisma.pins.findMany({
                where: {
                    user: id as string
                }
            })
            return res.status(200).json(boards)
        }

        if (requestType === 'board' && id !== null) {
            const board = await prisma.pins.findMany({
                where: {
                    board: id as string
                }
            })
            return res.status(200).json(board)
        }

        if (requestType === 'all') {
            const boards = await prisma.pins.findMany()
            return res.status(200).json(boards)
        } 

        return res.status(400).json({ success: false, message: 'Bad request!' })
    }

    if (req.method === 'POST') {
        const requestType = req.query.type
        const id = req.query.id
        const data = req.body
        //console.log(requestType, id, data);
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
