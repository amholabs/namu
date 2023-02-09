import { ethers } from 'ethers'
import { getPublicKeysFromScan, getSignatureFromScan } from 'pbt-chip-client/kong'

import { useStore } from '@/src/store'

export const hashMessageEIP191SolidityKeccak = (address: string, hash: string) => {
  const messagePrefix = '\x19Ethereum Signed Message:\n32'
  const message = address
    ? ethers.utils.solidityKeccak256(['address', 'bytes32'], [address, hash])
    : ethers.utils.solidityKeccak256(['bytes32'], [hash])
  return ethers.utils.solidityKeccak256(['string', 'bytes32'], [messagePrefix, ethers.utils.arrayify(message)])
}

export const getMintWithChipSig = async (address: string, blockNumberHash: string) => {
  try {
    const keyRaw = useStore.getState().chipHashedAddresses[0].slice(2)
    if (keyRaw) {
      const sig = await getSignatureFromScan({
        chipPublicKey: keyRaw,
        address,
        hash: blockNumberHash,
      })
      return sig ? sig : ''
    }
  } catch (err) {
    console.log(err)
  }
}
export const setPublicKeysFromScan = async () => {
  try {
    const keys = await getPublicKeysFromScan()
    if (keys) {
      useStore.setState({
        chipAddresses: [
          keys.primaryPublicKeyHash && keys.primaryPublicKeyHash,
          keys.secondaryPublicKeyHash && keys.secondaryPublicKeyHash,
          keys.tertiaryPublicKeyHash ? keys.tertiaryPublicKeyHash : '',
        ],
      })
      return keys
    }
  } catch (err) {
    console.log(err)
    return null
  }
}
