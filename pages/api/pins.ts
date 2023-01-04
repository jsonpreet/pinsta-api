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
        const pin = req.query.pin
        const profile = req.query.profile

        if (requestType === 'profileBoard' && id !== null && profile !== null) {
            const pinsExist = await prisma.pins.count({
                where: {
                    AND: [
                        { userId: profile as string },
                        { boardId: id as string  }
                    ],
                }
            })

            if (pinsExist === 0) {
                return res.status(200).json({ success: false, message: 'No pins found!' })
            }

            const board = await prisma.pins.findMany({
                where: {
                    AND: [
                        { userId: profile as string },
                        { boardId: id as string }
                    ],
                }
            })
            return res.status(200).json(board)   
        }

        if (requestType === 'profile' && id !== null) {
            const boards = await prisma.pins.findMany({
                where: {
                    userId: id as string
                }
            })
            return res.status(200).json(boards)
        }

        if (requestType === 'board' && id !== null) {
            const board = await prisma.pins.findMany({
                where: {
                    boardId: id as string
                }
            })
            return res.status(200).json(board)
        }

        if (requestType === 'all') {
            const boards = await prisma.pins.findMany()
            return res.status(200).json(boards)
        } 

        if (requestType === 'checkSaved' && id !== null && pin !== null) {
            console.log('checking saved pins', id, pin)
            const checked = await prisma.pins.findMany({
                where: {
                    AND: [
                        { userId: id as string },
                        { postId: pin as string }
                    ],
                }
            })
            console.log('checking saved pins', checked)
            return res.status(200).json(checked)
        }

        return res.status(400).json({ success: false, message: 'Bad request!' })
    }

    if (req.method === 'POST') {
        const body = req.body
        const requestType = body.type
        console.log('pins request', requestType, body.data);

        if (requestType === 'save') {
            const check = await prisma.pins.findMany({
                where: {
                    AND: [
                        { postId: body.data.post },
                        { userId: body.data.user },
                        { boardId: body.data.board }
                    ],
                }
            })
            if (check && check.length > 0) {
                return res.status(200).json({ success: false, message: 'Already saved!' })
            }
            const pin = await prisma.pins.create({
                data: {
                    userId: body.data.user,
                    boardId: body.data.board,
                    postId: body.data.post
                }
            })
            
            return res.status(200).json(pin)
        }

        if (requestType === 'unsave') {
            const unsaved = await prisma.pins.deleteMany({
                where: {
                    AND: [
                        { postId: body.data.post },
                        { userId: body.data.user  }
                    ],
                }
            })
            
            return res.status(200).json(unsaved)
        }
    }
}
