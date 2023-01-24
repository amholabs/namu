import { Box, Heading, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import MobileLayout from '@/components/layout/MobileLayout'
import { CoreButton } from '@/components/shared'
import { scan } from '@/src/utils/scan'

export default function Complete() {
  const router = useRouter()
  const nextPage = (uri: string) => {
    router.push(uri)
  }
  const handleClick = async () => {
    const { address, slot } = await scan()
    console.log(address, slot)
    nextPage('/onboarding/profile/complete')
  }
  return (
    <MobileLayout>
      <Box justifyContent="start">
        <Heading size="2xl">Registration Complete!</Heading>
      </Box>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <CoreButton size="sm" clickHandler={handleClick}>
        LOGIN WITH BAG
      </CoreButton>
    </MobileLayout>
  )
}
