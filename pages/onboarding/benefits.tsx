import { Heading } from '@chakra-ui/react'

import MobileLayout from '@/app/MobileLayout'
import { TextButton } from '@/components/shared/TextButton'

export default function Benefits() {
  return (
    <>
      <MobileLayout>
        <Heading>Benefits.</Heading>
        <TextButton clickHandler={() => {}}>Next</TextButton>
      </MobileLayout>
    </>
  )
}
