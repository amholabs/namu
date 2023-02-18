import { AtSignIcon } from '@chakra-ui/icons'
import { HStack, Heading, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import MobileLayout from '@/app/MobileLayout'
import { TextButton } from '@/components/shared/TextButton'

export default function Username() {
  const router = useRouter()
  const nextPage = (uri: string) => {
    router.push(uri)
  }
  return (
    <>
      <MobileLayout>
        <Heading marginTop="auto">Claim your username.</Heading>
        <Text as="span" paddingTop={2} paddingBottom={2}>
          A crypto wallet is required.
        </Text>
        <InputGroup>
          {/* eslint-disable-next-line */}
          <InputLeftElement pointerEvents="none" children={<AtSignIcon boxSize={6} />} />
          <Input focusBorderColor="black" variant="flushed" />
        </InputGroup>
        <TextButton clickHandler={() => nextPage('/profile')}>Next</TextButton>
      </MobileLayout>
    </>
  )
}
