export const NEXT_PUBLIC_EVER_BUCKET_NAME = 'pinsta'

export const EVER_ENDPOINT = 'https://endpoint.4everland.co'
export const EVER_ACCESS_KEY = process.env.EVER_ACCESS_KEY as string
export const EVER_ACCESS_SECRET = process.env.EVER_ACCESS_SECRET as string
export const EVER_REGION = 'us-west-2'

export const LENS_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT
export const IS_MAINNET = LENS_ENV === 'mainnet'

export const API_ORIGINS = [
  'https://pinsta.xyz',
  'https://testnet.pinsta.xyz',
  'http://localhost:3000'
]

export const APP = {
  ID: 'pinsta',
  Name: 'Pinsta',
  URLName: 'Pinsta.xyz',
  URL: 'https://testnet.pinsta.xyz',
  Description: 'Pinsta is a decentralized Image & Video Sharing service, designed to save and collect discovery information using Images, Videos, and Animated Gifs in the form of Pin Boards.',
  Twitter: 'PinstaApp',
  Meta: {
    image: `/meta.png`,
    type: 'website',
  }
}

// bundlr
export const BUNDLR_NODE_URL = IS_MAINNET
  ? 'https://node1.bundlr.network'
  : 'https://devnet.bundlr.network'
export const BUNDLR_METADATA_UPLOAD_URL = IS_MAINNET
  ? 'https://node2.bundlr.network'
  : 'https://devnet.bundlr.network'
export const BUNDLR_CURRENCY = 'matic'
export const BUNDLR_WEBSITE_URL = 'https://bundlr.network'
export const ARWEAVE_WEBSITE_URL = 'https://arweave.net'
export const BUNDLR_PRIVATE_KEY = process.env.BUNDLR_PRIVATE_KEY as string
export const BUNDLR_CONNECT_MESSAGE = 'Sign to initialize & estimate upload...'