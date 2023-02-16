// import { hashMessage } from '@ethersproject/hashter'
// import { computeAddress, recoverAddress } from '@ethersproject/transactions'
// eslint-disable-next-line import/order
// import { ethers } from 'ethers'
// eslint-disable-next-line import/order
// import { getPublicKeysFromScan, getSignatureFromScan } from 'pbt-chip-client/kong'

// @ts-ignore
// import { ethSignMessage, listKeys } from 'halo-chip'
import { SiweMessage } from 'siwe'

import { SITE_NAME } from '@/src/lib/constants'

// import { scan } from '@/src/utils/scan'
// import { useAccount, useBlockNumber } from 'wagmi'

export const siweLogout = async (): Promise<boolean> => {
  try {
    await fetch('/api/account/logout')
    // @TODO: This is a hack to remove the cookie from the browser
    //        This should be done with the cookieOptions.httpOnly = true
    //        but that is not working. This is a workaround until
    //        the issue is resolved. See:
    //        /api/account/logout
    document.cookie = `${SITE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    return true
  } catch (error: any) {
    // if (error instanceof AxiosError == true) {
    //   return false
    // }
    throw new Error(`Unexpected Error`)
  }
}

export const generateNonce = async (): Promise<string> => {
  const nonceRes = await fetch('/api/account/nonce')
  const nonce = await nonceRes.text()
  return nonce
}

export const siweLogin = async ({ address, chain, signMessageAsync }: any) => {
  // 1. Get random nonce from API
  const nonceRes = await fetch('/api/account/nonce')
  const nonce = await nonceRes.text()

  // 2. Create SIWE message with pre-fetched nonce and sign with wallet
  const message = new SiweMessage({
    domain: window.location.host,
    address,
    statement: `Sign in with Ethereum to ${SITE_NAME}`,
    uri: window.location.origin,
    version: '1',
    chainId: chain.id,
    nonce: nonce,
  })

  // 3. Sign message
  const signature = await signMessageAsync({
    message: message.prepareMessage(),
  })

  // 3. Verify signature
  const verifyRes = await fetch('/api/account/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, signature }),
  })

  console.log(verifyRes, 'verifyRes')

  if (!verifyRes.ok) throw new Error('Error verifying message')
  if (verifyRes.status === 200) {
    dispatchEvent(new Event('verified'))
  }
}

// export const siweLoginWithChip = async (address: string, blockNumberHash: string) => {
//   try {
//     const keys = await getPublicKeysFromScan()
//     if (keys) {
//       getSignatureFromScan({
//         chipPublicKey: keys.primaryPublicKeyRaw,
//         address,
//         hash: blockNumberHash,
//       }).then((sig) => {
//         if (sig) {
//           return sig
//           // console.log('address:', ethers.utils.computeAddress('0x' + keys.primaryPublicKeyRaw))
//           // const scanHash = hashMessageEIP191SolidityKeccak(address, blockNumberHash)
//           // console.log('scanHash: ', scanHash)
//           // console.log(sig)
//           // const recoveredAddr = ethers.utils.recoverAddress(scanHash, sig)
//           // console.log('recovered: ', recoveredAddr)
//         }
//       })
//     } else {
//       return null
//     }

//     // getSignatureFromScan({
//     //   chipPublicKey:
//     // })
//     // const nonceRes = await fetch('/api/account/nonce')
//     // const nonce = await nonceRes.text()
//     // const { address, slot } = await scan()

//     // const message = new SiweMessage({
//     //   domain: window.location.host,
//     //   address,
//     //   statement: `Sign in with Ethereum to ${SITE_NAME}`,
//     //   uri: window.location.origin,
//     //   version: '1',
//     //   chainId: 1,
//     //   nonce: nonce,
//     // })
//     // const preparedMessage = message.prepareMessage()
//     // // const preparedMessage = 'test'
//     // const sig = await ethSignMessage(preparedMessage, slot, address)
//     // const recoveredAddress = recoverAddress(hashMessage(preparedMessage), sig)
//     // console.log('original:', address)
//     // console.log('recovered:', recoveredAddress)
//   } catch (err) {
//     return null
//   }
// }
