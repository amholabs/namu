import { useState } from 'react'

import { CeramicClient } from '@ceramicnetwork/http-client'
import { Button, Input } from '@chakra-ui/react'
import { ComposeClient } from '@composedb/client'
import { EthereumWebAuth } from '@didtools/pkh-ethereum'
import { AccountId, AccountIdParams, ChainId, ChainIdParams } from 'caip'
import { DIDSession } from 'did-session'
import { ExecutionResult } from 'graphql'
import { ethSignMessage, listKeys, readStorage } from 'halo-chip'

import { Query } from '../out/__generated__/graphql'
import { definition } from '../out/__generated__/runtime'

let ceramicUrl = ''
let graphqlUrl = ''

switch (process.env.NODE_ENV) {
  case 'development':
    // ceramicUrl = 'http://localhost:7007'
    // graphqlUrl = 'http://localhost:60021'
    ceramicUrl = `${process.env.NEXT_CERAMIC_URL}`
    graphqlUrl = `${process.env.NEXT_QL_URL}`
    break
  case 'test':
    ceramicUrl = `${process.env.NEXT_CERAMIC_URL}`
    graphqlUrl = `${process.env.NEXT_QL_URL}`
    break
  case 'production':
    ceramicUrl = 'https://amho.xyz/'
    graphqlUrl = `https://ql.amho.xyz`
    break
  default:
    ceramicUrl = 'error: ceramic'
    graphqlUrl = 'error: gqlserver'
    break
}

const ceramic = new CeramicClient(process.env.NEXT_CERAMIC_URL)
const compose = new ComposeClient({ ceramic: process.env.NEXT_CERAMIC_URL ? process.env.NEXT_CERAMIC_URL : 'https://amhocer.loca.lt', definition })
console.log('NODE_ENV' + process.env.NODE_ENV)
console.log('Starting with ceramic url: ' + ceramicUrl)
console.log('Starting with gql url: ' + graphqlUrl)

type AccountId = {
  address: string
  chainId: ChainId
  toString(): string
  toJSON(): AccountIdParams
}

type AuthMethodParams = Parameters<typeof EthereumWebAuth.getAuthMethod>[0]

const generateSession = async () => {
  const keys = await listKeys()
  const { address, slot } = keys[0]
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
  ceramic.did = session.did
  return session
}

// mutation

const createProfile = async (name: string, image: string, description: string) => {
  // Replace by the URL of the Ceramic node you want to deploy the models to
  compose.executeQuery(
    `
    mutation CreateProfile($i: CreateProfileInput!) {
      createProfile(input: $i) {
        document {
          name
          image
          description
        }
      }
    }`,
    {
      i: {
        content: {
          name,
          image,
          description,
        },
      },
    }
  )
}

const queryProfile = async (): Promise<ExecutionResult<Pick<Query, 'viewer'>>> => {
  const output = compose.executeQuery(
    `
      query {
        viewer {
          isViewer
          profile {
            name
          }
        }
      }
    `
  )
  return output
}

export default function Home() {
  const [did, setDID] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [inputName, setInputName] = useState<string>('testname')
  const [inputDesc, setDesc] = useState<string>('testdesc')
  const [inputImage, setImage] = useState<string>('testimage')
  // const [inputWallet, setWalletAddresses] = useState<WalletAddresses>({ address: '', blockchainNetwork: '' })

  const genSession = async () => {
    const sess = await generateSession()
    setDID(sess.id)
    console.log(compose.did)
  }

  const queryProfiles = async () => {
    const output = await queryProfile()
    console.log(output)
    setName(output.data?.viewer?.profile?.name)
  }

  const queryDid = async (): Promise<void> => {
    console.log(ceramic.did)
    console.log(compose.did)
  }

  return (
    <>
      <main className="flex flex-1">
        <div className="flex-center flex h-full flex-1 flex-col items-center justify-center text-center">
          <div className="pb-5">
            <h1 className="text-xs font-normal">Logged in with</h1>
            <h1 className="text-xs font-normal">{name}</h1>
            <h1 className="text-xs font-normal">{did}</h1>
          </div>
          <button className="btn btn-light btn-sm" onClick={genSession}>
            generate
          </button>
          <button className="btn btn-light btn-sm" onClick={queryProfiles}>
            query profile
          </button>
          <Input
            className="input input-bordered input-sm"
            type="text"
            placeholder="Name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
          <Input
            className="input input-bordered input-sm"
            type="text"
            placeholder="Description"
            value={inputDesc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <Input
            className="input input-bordered input-sm"
            type="text"
            placeholder="Image"
            value={inputImage}
            onChange={(e) => setImage(e.target.value)}
          />
          {/* <Input
            className="input input-bordered input-sm"
            type="text"
            placeholder="Wallet Addresses"
            value={inputWallet.address}
            onChange={(e) => setWalletAddresses({ ...inputWallet, address: e.target.value, blockchainNetwork: 'ethereum' })}
          /> */}
          <Button onClick={() => createProfile(inputName, inputDesc, inputImage)}>Create Profile</Button>
          <Button onClick={queryDid}>query did</Button>
        </div>
      </main>
    </>
  )
}
