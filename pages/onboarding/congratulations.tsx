import { Box, Heading, Text, VStack, HStack, PinInput, PinInputField } from '@chakra-ui/react'

import { CoreButton } from '@/components/shared'

export default function Congratulations() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" h="calc(100vh)" w="100%" bg="white">
      <VStack align="stretch">
        <Box justifyContent="start">
          <Heading size="2xl">Congratulations on your purchase!</Heading>
        </Box>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Text fontSize="3xl">Let's start registration</Text>
        <Text fontSize="md">Enter the six digit code you received with your package.</Text>
        <HStack paddingTop="1em" paddingBottom="1em">
          <PinInput variant="outline" focusBorderColor="black" type="alphanumeric" size="lg">
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>
        <CoreButton>CONFIRM</CoreButton>
      </VStack>
    </Box>
  )
}
