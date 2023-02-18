import { AtSignIcon } from '@chakra-ui/icons'
import { Heading, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import MobileLayout from '@/app/MobileLayout'
import { TextButton } from '@/components/shared/TextButton'

export default function Twitter() {
  const router = useRouter()
  const nextPage = (uri: string) => {
    router.push(uri)
  }
  return (
    <>
      <MobileLayout>
        <Heading marginTop="auto">Twitter?</Heading>
        <InputGroup>
          {/* eslint-disable-next-line */}
          <InputLeftElement pointerEvents="none" children={<AtSignIcon boxSize={6} />} />
          <Input focusBorderColor="black" variant="flushed" />
        </InputGroup>
        <TextButton clickHandler={() => nextPage('/onboarding/profile/wallet')}>Next</TextButton>
      </MobileLayout>
    </>
  )
}
