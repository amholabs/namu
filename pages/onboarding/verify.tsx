import { useState } from 'react'

import { Center, Heading, Image, Text, Toast, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import MobileLayout from '@/app/MobileLayout'
import { CoreButton } from '@/components/shared/CoreButton'
import { TextButton } from '@/components/shared/TextButton'
import { generateSession } from '@/src/utils/scan'

export default function Verify() {
  const toast = useToast()
  const router = useRouter()
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false)
  const handleGenerateSession = async () => {
    setLoading(true)
    try {
      const session = await generateSession()
      if (session) {
        router.push('/onboarding/found')
      } else {
        setLoading(false)
        toast({
          title: 'Scanning Failed. Try again.',
          status: 'error',
          isClosable: true,
        })
      }
    } catch (error) {}
  }
  return (
    <MobileLayout>
      {/* eslint-disable-next-line */}
      <Heading paddingTop="2rem" paddingBottom="1.5rem" fontSize="3xl" lineHeight={'3rem'}>
        First, scan your bag.
      </Heading>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <Text fontSize="lg" fontWeight="bold" paddingBottom="1em">
        Your handbag will serve as your ID.{' '}
      </Text>
      <Text fontSize="lg" fontWeight="bold">
        People can scan your bag to see your links. Your socials. Your NFTs.
      </Text>
      <Center marginTop="auto">
        <Image marginTop="2rem" boxSize="230px" objectFit="cover" src="/image/bagplaceholder.png" />
      </Center>
      {/* <CoreButton isLoading={loading} size="xs" clickHandler={handleGenerateSession}> */}
      {/* <CoreButton isLoading={loading} size="xs" clickHandler={handleGenerateSession}> */}
      <TextButton color="" clickHandler={handleGenerateSession}>
        Scan
      </TextButton>
      {/* </CoreButton> */}
    </MobileLayout>
  )
}
