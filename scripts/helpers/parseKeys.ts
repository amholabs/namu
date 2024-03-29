import { ethers } from 'ethers'

const formatHex = (bytes: string) => (bytes.slice(0, 2) == '0x' ? bytes : '0x' + bytes)

export default function parseKeys({ payload }: { payload: any }) {
  const pkLength = parseInt('0x' + payload.slice(0, 2)) * 2
  const pkRaw = payload.slice(2, pkLength + 2)

  const key = ethers.utils.keccak256('0x' + ethers.utils.computePublicKey(formatHex(pkRaw)).slice(4))

  return key
}
