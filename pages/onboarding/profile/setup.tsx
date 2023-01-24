import { useState } from 'react'

import { Box, Center, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { SiBehance, SiDribbble, SiGithub, SiGumroad, SiInstagram, SiSubstack, SiTiktok, SiTwitter, SiYoutube } from 'react-icons/si'

import UrlLink from '@/components/app/UrlLink'
import MobileLayout from '@/components/layout/MobileLayout'
import { CoreButton } from '@/components/shared'
import { useStore } from '@/src/store'

export default function Setup() {
  const router = useRouter()
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
          <Heading size="md">Now let's start setting up your links</Heading>
        </Box>
        <UrlLink uri="" icon={SiTwitter} placeholder="@" />
        <UrlLink icon={SiInstagram} placeholder="@" />
        <UrlLink icon={SiTiktok} placeholder="@" />
        <UrlLink icon={SiYoutube} placeholder="@" />
        <UrlLink icon={SiBehance} placeholder="@" />
        <UrlLink icon={SiGithub} placeholder="@" />
        <UrlLink icon={SiSubstack} placeholder="@" />
        <UrlLink icon={SiDribbble} placeholder="@" />
        <UrlLink icon={SiGumroad} placeholder="@" />
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
          <Button size="xs" variant="unstyled">
            SKIP
          </Button>
        </VStack>
      </VStack>
    </MobileLayout>
  )
}
