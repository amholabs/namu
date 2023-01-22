import { Button, Flex } from '@chakra-ui/react'

export const CoreButton = ({ children }: { children: React.ReactNode }) => (
  <Flex paddingTop={'1em'}>
    <Button _hover={{ bg: 'black', color: 'white', border: '3px', borderColor: 'black' }} bg="white" border={'3px'} flex="1" padding="6">
      {children}
    </Button>
  </Flex>
)
