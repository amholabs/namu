import { Box, Heading, Text } from '@chakra-ui/react'
import { ExecutionResult } from 'graphql'
import { useRouter } from 'next/router'

import MobileLayout from '@/components/layout/MobileLayout'
import { CoreButton } from '@/components/shared'
import { MUTATE_CREATE_PROFILE, QUERY_PROFILE_VIEWER } from '@/lib/constants'
import { useStore } from '@/src/store'
import { Query } from 'out/__generated__/graphql'

export default function Complete() {
  const router = useRouter()
  const compose = useStore.getState().compose

  // eslint-disable-next-line
  const queryProfile = async (): Promise<ExecutionResult<Pick<Query, 'viewer'>>> => {
    const output = compose.executeQuery(QUERY_PROFILE_VIEWER)
    return output
  }

  // const output = await queryProfile()
  // if (output.data?.viewer?.profile) {
  //   setName(output.data?.viewer?.profile?.name)
  //   setProfileId(output.data?.viewer?.profile?.id)
  // }

  // eslint-disable-next-line
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

  const nextPage = (uri: string) => {
    router.push(uri)
  }
  const handleClick = async () => {
    // TODO: Save the complete profile
    nextPage('/onboarding/profile/complete')
  }
  return (
    <MobileLayout>
      <Box justifyContent="start">
        <Heading size="2xl">Registration Complete!</Heading>
        <Text fontSize="sm">Save your profile by tapping your bag</Text>
      </Box>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <CoreButton size="sm" clickHandler={handleClick}>
        SAVE
      </CoreButton>
    </MobileLayout>
  )
}
