import { Heading, Input } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import MobileLayout from '@/app/MobileLayout'
import { TextButton } from '@/components/shared/TextButton'

export default function Name() {
  const router = useRouter()
  const nextPage = (uri: string) => {
    router.push(uri)
  }
  return (
    <>
      <MobileLayout>
        {/* eslint-disable-next-line */}
        <Heading marginTop="auto">What's your name?</Heading>
        <Input focusBorderColor="black" variant="flushed" />
        <TextButton clickHandler={() => nextPage('/onboarding/profile/instagram')}>Next</TextButton>
      </MobileLayout>
    </>
  )
}
