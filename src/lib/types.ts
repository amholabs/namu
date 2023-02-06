import { EthereumWebAuth } from '@didtools/pkh-ethereum'

export type AuthMethodParams = Parameters<typeof EthereumWebAuth.getAuthMethod>[0]
