import { Center, Flex, Input, Stack } from '@chakra-ui/react'

import { useStore } from '@/src/store'

export default function UrlLink() {
  useStore.setState({ urlLinks: [''], authenticatedUser: '0x0' })
  return (
    <Flex border="3px">
      <Stack paddingTop={2} paddingLeft={4} paddingRight={4} paddingBottom={4}>
        <Center bg="white" outlineColor={'black'} outline="1">
          <Input focusBorderColor="brand.900" variant="flushed" placeholder="Enter Title" size="sm" />
        </Center>
        <Center>
          <Input focusBorderColor="brand.900" variant="flushed" placeholder="https://" size="sm" />
        </Center>
      </Stack>
    </Flex>
  )
}
