import { Box, Heading, Text, VStack } from '@chakra-ui/react'

import { CoreButton } from '@/components/shared'
import { generateSession } from '@/src/utils/scan'

export default function Congratulations() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" h="calc(100vh)" w="100%" bg="white">
      <VStack align="stretch">
        <Box justifyContent="start">
          <Heading size="2xl">Congratulations on your purchase!</Heading>
        </Box>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Text fontSize="3xl">Let's start registration</Text>
        <Text fontSize="md">Scan to verify you are the owner.</Text>
        <CoreButton clickHandler={generateSession}>SCAN</CoreButton>
      </VStack>
    </Box>
  )
}
