import { useState } from 'react'

import { Box, Button, Center, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { ExecutionResult } from 'graphql'
import { useRouter } from 'next/router'
import { SiBehance, SiDribbble, SiGithub, SiGumroad, SiInstagram, SiSubstack, SiTiktok, SiTwitter, SiYoutube } from 'react-icons/si'

import { MUTATE_CREATE_URLLINK, QUERY_URLLINK_VIEWER } from '@/lib/constants'
import { Query, UrlLinkSocialType } from '@/out/__generated__/graphql'
import UrlLink from '@/src/components/app/UrlLink'
import { CoreButton } from '@/src/components/shared'
import { useStore } from '@/src/store'
import MobileLayout from 'app/MobileLayout'

export default function Setup() {
  const router = useRouter()
  const compose = useStore.getState().compose
  // eslint-disable-next-line
  const createUrlLink = async (type: UrlLinkSocialType, title: string, link: string, profileId: string) => {
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

  // eslint-disable-next-line
  const queryUrlLink = async (): Promise<ExecutionResult<Pick<Query, 'viewer'>>> => {
    const output = compose.executeQuery(QUERY_URLLINK_VIEWER)
    return output
  }
  const name = useStore.getState().name
  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1)
  const [isLoading, setLoading] = useState<boolean>(false)
  const nextPage = (uri: string) => {
    router.push(uri)
  }
  return (
    <MobileLayout>
      <VStack align="stretch">
        <Box justifyContent="start">
          <Heading>Hello, {nameCapitalized}</Heading>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <Heading size="md">Let's start setting up your links.</Heading>
        </Box>
        <UrlLink uri="" icon={SiTwitter} placeholder="@" />
        <UrlLink icon={SiInstagram} placeholder="@" />
        <UrlLink icon={SiTiktok} placeholder="@" />
        <UrlLink icon={SiBehance} placeholder="@" />
        {/* <UrlLink icon={SiYoutube} placeholder="@" /> */}
        {/* <UrlLink icon={SiGithub} placeholder="@" /> */}
        {/* <UrlLink icon={SiSubstack} placeholder="@" /> */}
        {/* <UrlLink icon={SiDribbble} placeholder="@" /> */}
        {/* <UrlLink icon={SiGumroad} placeholder="@" /> */}
        <VStack align="stretch">
          <Box pt="0.5em">
            <CoreButton
              isLoading={isLoading}
              clickHandler={() => {
                nextPage('/onboarding/profile/complete')
                setLoading(true)
              }}>
              SUBMIT
            </CoreButton>
          </Box>
          <Button
            onClick={() => {
              nextPage('/onboarding/profile/complete')
            }}
            size="xs"
            variant="unstyled">
            SKIP
          </Button>
        </VStack>
      </VStack>
    </MobileLayout>
  )
}
