import type { NextApiRequest, NextApiResponse } from 'next'
import {
  API_ORIGINS,
  IS_MAINNET,
  LIVEPEER_API_TOKEN,
} from '@utils/constants'
import axios from 'axios'


const token = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }
    const origin = req.headers.origin
    if (IS_MAINNET && (!origin || !API_ORIGINS.includes(origin))) {
        return res.status(403).json({ success: false })
    }
    if (req.method !== 'POST') return res.status(400).json({ success: false })
    try {
        const payload = req.body
        const headers = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${LIVEPEER_API_TOKEN}`
            }
        }
        const { data } = await axios.get(
            `https://thumbnails.withlivepeer.com/api/generate?playbackId=${payload.videoId}&width=${payload.width}&height=${payload.height}&format=${payload.format}&time=${payload.duration}`,
            headers
        )
        if (data && data?.success) {
            return res.setHeader('Cache-Control', 's-maxage=84100').status(200).json({
                success: true,
                data: data
            })
        }
            
        return res.status(200).json({ success: false })
    } catch (error) {
        console.log('[API Error Get STS]', error)
        return res.status(200).json({ success: false })
    }
}

export default token