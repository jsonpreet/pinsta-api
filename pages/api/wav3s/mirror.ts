import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts'
import type { NextApiRequest, NextApiResponse } from 'next'
import { API_ORIGINS, IS_MAINNET, WAV3S_TOKEN, WAV3S_URL } from '@utils/constants'
import axios from 'axios'

const token = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }
    const origin = req.headers.origin
    if (IS_MAINNET && (!origin || !API_ORIGINS.includes(origin))) {
        return res.status(403).json({ success: false })
    }
    if (req.method !== 'POST' || !req.body)
        return res.status(400).json({ success: false })
    try {
        const headers = {
            'Content-Type': 'application/json',
            'wav3s-access-token': `Bearer ${WAV3S_TOKEN}`
        }
        const payload = JSON.stringify(req.body)

        const response = await axios.post(
            `${WAV3S_URL}/publication/mirror`, payload, { headers }
        )


        console.log(response)
        if (response.status === 200) {
            return res.status(200).json({ success: true })
        }
        if (response.status === 404) {
            return res.status(200).json({ success: false, message: 'Not Found' })
        }

        return res.status(200).json({ success: false, message: response })
    } catch (error) {
        console.log('[API Error Get Wav3s]', error)
        return res.status(200).json({ success: false })
    }
}

export default token