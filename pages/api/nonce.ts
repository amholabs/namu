import { NextApiRequest, NextApiResponse } from 'next'
import { generateNonce } from 'siwe'

// NextRequest function to return a fake nonce
// Set variable for a fake nonce
// Return the fake nonce

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // generate a nonce and return it
  const nonce = generateNonce()
  res.setHeader('Content-Type', 'text/plain')
  res.send({ nonce })
}
