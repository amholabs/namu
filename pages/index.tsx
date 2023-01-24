/* eslint-disable unused-imports/no-unused-vars */
import { useState } from 'react'

import { Button, Input, Select } from '@chakra-ui/react'
import { ComposeClient } from '@composedb/client'
import { ExecutionResult } from 'graphql'

import UrlLink from '@/components/app/UrlLink'
import UrlLinkWrapper from '@/components/app/UrlLinkWrapper'
import {
  MUTATE_CREATE_PROFILE,
  MUTATE_CREATE_URLLINK,
  MUTATE_UPDATE_PROFILE,
  MUTATE_UPDATE_URLLINK,
  QUERY_PROFILE_VIEWER,
  QUERY_URLLINK_VIEWER,
  SocialType,
} from '@/lib/constants'
import { useStore } from '@/src/store'
import { generateSession } from '@/src/utils/scan'

import { Query } from '../out/__generated__/graphql'

let ceramicUrl = ''
let graphqlUrl = ''

switch (process.env.NODE_ENV) {
  case 'development':
    ceramicUrl = `${process.env.NEXT_PUBLIC_CERAMIC_URL}`
    graphqlUrl = `${process.env.NEXT_PUBLIC_QL_URL}`
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

// const ceramic = new CeramicClient(process.env.NEXT_CERAMIC_URL)

console.log('NODE_ENV=' + process.env.NODE_ENV)
console.log('Starting with ceramic url: ' + ceramicUrl)
console.log('Starting with gql url: ' + graphqlUrl)

export default function Home() {
  const [did, setDID] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [inputName, setInputName] = useState<string>('')
  const [inputDesc, setDesc] = useState<string>('')
  const [inputImage, setImage] = useState<string>('')
  // give me input for type, title, link
  const [inputType, setType] = useState<SocialType>(SocialType.TWITTER)
  const [inputTitle, setTitle] = useState<string>('')
  const [inputLink, setLink] = useState<string>('')
  const [inputProfileId, setProfileId] = useState<string>('')

  const compose = useStore.getState().compose

  // const [inputWallet, setWalletAddresses] = useState<WalletAddresses>({ address: '', blockchainNetwork: '' })

  // mutation

  const createProfile = async (
    name: string,
    image: string,
    description: string,
    walletAddresses: { address: string; blockchainNetwork: 'ethereum' }
  ) => {
    // Replace by the URL of the Ceramic node you want to deploy the models to
    compose.executeQuery(`${MUTATE_CREATE_PROFILE}`, {
      i: {
        content: {
          name,
          image,
          description,
          walletAddresses: walletAddresses,
        },
      },
    })
  }

  const createUrlLink = async (type: SocialType, title: string, link: string, profileId: string) => {
    compose.executeQuery(`${MUTATE_CREATE_URLLINK}`, {
      i: {
        content: {
          type,
          title,
          link,
          profileId,
        },
      },
    })
  }

  const queryProfile = async (): Promise<ExecutionResult<Pick<Query, 'viewer'>>> => {
    const output = compose.executeQuery(QUERY_PROFILE_VIEWER)
    return output
  }

  const queryUrlLink = async (): Promise<ExecutionResult<Pick<Query, 'viewer'>>> => {
    const output = compose.executeQuery(QUERY_URLLINK_VIEWER)
    return output
  }

  const genSession = async () => {
    await generateSession().then((data) => {
      queryProfiles()
      setDID(data.id)
    })
  }

  const queryProfiles = async () => {
    const output = await queryProfile()
    if (output.data?.viewer?.profile) {
      setName(output.data?.viewer?.profile?.name)
      setProfileId(output.data?.viewer?.profile?.id)
    }
  }
  const queryUrlLinks = async () => {
    const output = await queryUrlLink()
    console.log(output)
  }

  const queryDid = async (): Promise<void> => {
    // console.log(ceramic.did)
    console.log(compose.did)
  }

  return (
    <>
      <main className="flex flex-1">
        <div className="flex-center flex h-full flex-1 flex-col items-center justify-center text-center">
          <div className="pb-5">
            <h1 className="text-xs font-normal">Logged in with</h1>
            <h1 className="text-xs font-normal">Authenticated name: {name}</h1>
            <h1 className="text-xs font-normal">Authenticated profile id: {inputProfileId}</h1>
            <h1 className="text-xs font-normal">Authenticated DID: {did}</h1>
          </div>
          <Button className="btn btn-sm" onClick={genSession}>
            Start
          </Button>
          <Button className="btn btn-sm" onClick={queryProfiles}>
            Query Profile
          </Button>
          <h1 className="py-5 text-xl">Create a profile</h1>
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
          <Button
            className="btn btn-sm"
            onClick={() => createProfile(inputName, inputDesc, inputImage, { address: '0x0', blockchainNetwork: 'ethereum' })}>
            Create Profile
          </Button>
          <h1 className="py-5 text-xl">Create a UrlLink</h1>
          <Select className="input input-bordered input-sm" value={inputType} onChange={(e) => setType(e.target.value as SocialType)}>
            {Object.keys(SocialType).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </Select>
          <Input
            className="input input-bordered input-sm"
            type="text"
            placeholder="Title"
            value={inputTitle}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            className="input input-bordered input-sm"
            type="text"
            placeholder="Link"
            value={inputLink}
            onChange={(e) => setLink(e.target.value)}
          />
          <Button className="btn btn-sm" onClick={() => createUrlLink(inputType, inputTitle, inputLink, inputProfileId)}>
            Create Url Link
          </Button>
          <Button className="btn btn-sm" onClick={queryUrlLinks}>
            Query Url Links
          </Button>
          {/* <UrlLinkWrapper> */}
          {/* <UrlLink />
            {useStore.getState().urlLinks.map((urlLink: string, key: number) => (
              <h1 key={key}>{urlLink}</h1>
            ))}
          {useStore.getState().authenticatedUser} */}
          {/* </UrlLinkWrapper> */}
        </div>
      </main>
    </>
  )
}
