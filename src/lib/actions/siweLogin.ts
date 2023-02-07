// import { hashMessage } from '@ethersproject/hashter'
// import { computeAddress, recoverAddress } from '@ethersproject/transactions'
// eslint-disable-next-line import/order
import { ethers } from 'ethers'
// eslint-disable-next-line import/order
import { getPublicKeysFromScan, getSignatureFromScan } from 'pbt-chip-client/kong'

// @ts-ignore
// import { ethSignMessage, listKeys } from 'halo-chip'
import { SiweMessage } from 'siwe'

import { SITE_NAME } from '@/src/lib/constants'

// import { scan } from '@/src/utils/scan'
// import { useAccount, useBlockNumber } from 'wagmi'
export const hashMessageEIP191SolidityKeccak = (address: string, hash: string) => {
  const messagePrefix = '\x19Ethereum Signed Message:\n32'
  const message = address
    ? ethers.utils.solidityKeccak256(['address', 'bytes32'], [address, hash])
    : ethers.utils.solidityKeccak256(['bytes32'], [hash])
  return ethers.utils.solidityKeccak256(['string', 'bytes32'], [messagePrefix, ethers.utils.arrayify(message)])
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

export const siweLoginWithChip = async (address: string, blockNumberHash: string) => {
  try {
    const keys = await getPublicKeysFromScan()
    if (keys) {
      getSignatureFromScan({
        chipPublicKey: keys.primaryPublicKeyRaw,
        address,
        hash: blockNumberHash,
      }).then((sig) => {
        if (sig) {
          console.log('address:', ethers.utils.computeAddress('0x' + keys.primaryPublicKeyRaw))
          const scanHash = hashMessageEIP191SolidityKeccak(address, blockNumberHash)
          console.log('scanHash: ', scanHash)
          console.log(sig)
          const recoveredAddr = ethers.utils.recoverAddress(scanHash, sig)
          console.log('recovered: ', recoveredAddr)
        }
      })
      return keys
    } else {
      return null
    }

    // getSignatureFromScan({
    //   chipPublicKey:
    // })
    // const nonceRes = await fetch('/api/account/nonce')
    // const nonce = await nonceRes.text()
    // const { address, slot } = await scan()

    // const message = new SiweMessage({
    //   domain: window.location.host,
    //   address,
    //   statement: `Sign in with Ethereum to ${SITE_NAME}`,
    //   uri: window.location.origin,
    //   version: '1',
    //   chainId: 1,
    //   nonce: nonce,
    // })
    // const preparedMessage = message.prepareMessage()
    // // const preparedMessage = 'test'
    // const sig = await ethSignMessage(preparedMessage, slot, address)
    // const recoveredAddress = recoverAddress(hashMessage(preparedMessage), sig)
    // console.log('original:', address)
    // console.log('recovered:', recoveredAddress)
  } catch (err) {
    return null
  }
}
