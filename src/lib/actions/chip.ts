import { ethers } from 'ethers'
import { getPublicKeysFromScan, getSignatureFromScan } from 'pbt-chip-client/kong'

import { useStore } from '@/src/store'

// Address and block hash and nonce
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
