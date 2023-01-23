import { Box, Heading, Text, VStack } from '@chakra-ui/react'

import MobileLayout from '@/components/layout/MobileLayout'
import { useStore } from '@/src/store'

export default function Setup() {
  const name = useStore.getState().name
  return (
    <MobileLayout>
      <VStack>
        <Box>
          <Heading>Hello {name}</Heading>
        </Box>
      </VStack>
    </MobileLayout>
  )
}
