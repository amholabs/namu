import { ComposeClient } from '@composedb/client'
import type { AuthMethod } from '@didtools/cacao'
import { EthereumWebAuth } from '@didtools/pkh-ethereum'
import { AccountId, AccountIdParams, ChainId, ChainIdParams } from 'caip'
import { DIDSession } from 'did-session'
// @ts-ignore
import { ethSignMessage, listKeys } from 'halo-chip'

import { AuthMethodParams } from '@/lib/types'
import { useStore } from '@/src/store'

export const scan = async () => {
  const keys = await listKeys()
  const { address, slot } = keys[0]
  return { address, slot }
}

export const loadSession = async (): Promise<DIDSession> => {
  const compose = useStore.getState().compose
  const { address, slot } = useStore.getState()
  const sessionStr = localStorage.getItem('didsession')

  let session
  let resources = compose.resources

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
      request: async ({ params }: AuthMethodParams) => ethSignMessage(params[0], slot, params[1]),
    },
    accountId
  )

  if (sessionStr) {
    session = await DIDSession.fromSession(sessionStr)
  }

  if (!session || (session.hasSession && session.isExpired)) {
    session = await DIDSession.authorize(authMethod, { resources })
    localStorage.setItem('didsession', session.serialize())
  }

  compose.setDID(session.did)
  return session
}

export const generateSession = async () => {
  const compose = useStore.getState().compose
  try {
    const { address, slot } = await scan()
    useStore.setState({ address, slot })
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
        request: async ({ params }: AuthMethodParams) => ethSignMessage(params[0], slot, params[1]),
      },
      accountId
    )
    const resources = compose.resources
    const session = await DIDSession.authorize(authMethod, { resources })
    localStorage.setItem('didsession', session.serialize())
    compose.setDID(session.did)
    return session
  } catch (err) {
    return null
  }
}
