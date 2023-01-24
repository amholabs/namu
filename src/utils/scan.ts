import { ComposeClient } from '@composedb/client'
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

export const generateSession = async () => {
  const compose = useStore.getState().compose
  const { address, slot } = await scan()
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
  // const session = await DIDSession.authorize(authMethod, {
  //   resources: [`ceramic://*?model=${process.env.NEXT_PROFILE_STREAM_ID}`],
  // })
  localStorage.setItem('didsession', session.serialize())
  // compose.setDID(session.did)
  compose.setDID(session.did)
  // ceramic.did = session.did
  return session
}
