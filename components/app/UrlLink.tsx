import { PropsWithChildren, useState } from 'react'

import { Center, Flex, Input, Stack } from '@chakra-ui/react'

type UrlLinkProps = {
  title: string
  uri: string
}

export default function UrlLink(props: PropsWithChildren<UrlLinkProps>) {
  const { title, uri } = props
  const [newTitle, setTitle] = useState<string>(title)
  const [newUri, setUri] = useState<string>(uri)
  return (
    <Flex border="3px">
      <Stack paddingTop={2} paddingLeft={4} paddingRight={4} paddingBottom={4}>
        <Center bg="white" outlineColor={'black'} outline="1">
          <Input
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            focusBorderColor="brand.900"
            variant="flushed"
            value={newTitle.length > 0 ? newTitle : ''}
            placeholder="Enter Title"
            size="sm"
          />
        </Center>
        <Center>
          <Input
            onChange={(e) => {
              setUri(e.target.value)
            }}
            focusBorderColor="brand.900"
            variant="flushed"
            value={newUri.length > 0 ? newUri : ''}
            placeholder="https://"
            size="sm"
          />
        </Center>
      </Stack>
    </Flex>
  )
}
