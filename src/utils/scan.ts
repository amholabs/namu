import { ComposeClient } from '@composedb/client'
import type { AuthMethod } from '@didtools/cacao'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
import { AccountId, AccountIdParams, ChainId, ChainIdParams } from 'caip'
import { DIDSession } from 'did-session'
// @ts-ignore
import { ethSignMessage, listKeys } from 'halo-chip'

import { definition } from '@/out/__generated__/runtime'
import { AuthMethodParams } from '@/src/lib/types'
import { useStore } from '@/src/store'

export const scan = async () => {
  const keys = await listKeys()
  return keys
}

export const setScanVariables = async () => {
  try {
    const keys = await scan()
    const { address, slot } = keys[0]
    const keysAddresses = keys.map((key) => Object.values(key)[2])
    const hashedKeysAddresses = keys.map((key) => Object.values(key)[0])
    useStore.setState({ address, slot })
    useStore.setState({ chipAddresses: keysAddresses, chipHashedAddresses: hashedKeysAddresses })
    return keys
  } catch (err) {}
}

export const formatKeys = (keys) => {
  const keysAddresses = keys.map((key) => Object.values(key)[2])
  const hashedKeysAddresses = keys.map((key) => Object.values(key)[0])
  return { keysAddresses, hashedKeysAddresses }
}

export const loadAuthMethod = async (address: string, slot: string): Promise<AuthMethod> => {
  const accountId: AccountId = {
    address: address.toLowerCase(),
    chainId: {
      reference: '1',
      namespace: 'eip155',
      toJSON: (): ChainIdParams => {
        return {
          reference: '1',
          namespace: 'eip155',
        }
      },
    },
    toJSON: (): AccountIdParams => {
      return {
        address: address.toLowerCase(),
        chainId: {
          reference: '1',
          namespace: 'eip155',
        },
      }
    },
  }
  const authMethod = await EthereumWebAuth.getAuthMethod(
    {
      request: async ({ params }: AuthMethodParams) => slot && ethSignMessage(params[0], slot, params[1]),
    },
    accountId
  )
  return authMethod
}

export const loadSession = async (): Promise<DIDSession> => {
  const compose = useStore.getState().compose
  // const compose = new ComposeClient({ ceramic: 'https://amhocer.tunnelto.dev/', definition })
  const { address, slot } = useStore.getState()
  const sessionStr = localStorage.getItem('didsession')

  let session
  let resources = compose.resources

  if (sessionStr) {
    session = await DIDSession.fromSession(sessionStr)
  }

  if (!session || (session.hasSession && session.isExpired)) {
    const authMethod = await loadAuthMethod(address, slot)
    session = await DIDSession.authorize(authMethod, { resources })
    // localStorage.setItem('didsession', session.serialize())
  }

  // compose.setDID(session.did)
  // return session
}

export const generateSession = async () => {
  const compose = useStore.getState().compose
  try {
    const keys = await setScanVariables()
    const { address, slot } = keys[0]
    const resources = compose.resources
    const authMethod = await loadAuthMethod(address, slot)
    const session = await DIDSession.authorize(authMethod, { resources })
    localStorage.setItem('didsession', session.serialize())
    compose.setDID(session.did)
    return session
  } catch (err) {
    return null
  }
}
