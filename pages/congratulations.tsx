import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'

export default function Congratulations() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" h="calc(100vh)" w="100%" bg="white">
      <VStack align="stretch">
        <Box justifyContent="start">
          <Heading>Congratulations on your purchase!</Heading>
        </Box>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Text>Let's start registration</Text>
        <Flex paddingTop={'1em'}>
          <Button bg="white" border={'3px'} flex="1">
            Start
          </Button>
        </Flex>
      </VStack>
    </Box>
  )
}
