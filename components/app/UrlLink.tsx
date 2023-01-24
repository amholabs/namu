import { PropsWithChildren, useState } from 'react'

import { CheckIcon } from '@chakra-ui/icons'
import { Box, Flex, Input, InputGroup, InputLeftAddon, Spinner, Stack } from '@chakra-ui/react'
import { IconType } from 'react-icons'

import { useStore } from '@/src/store'

type UrlLinkProps = {
  uri?: string
  placeholder: string
  icon: IconType
}

export default function UrlLink(props: PropsWithChildren<UrlLinkProps>) {
  const { placeholder, icon, uri } = props
  const [newUri, setUri] = useState<string>(uri || '')
  const [isComplete, setComplete] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value.length === 0) {
      setComplete(false)
    }
    setUri(value)
  }
  const handleBlur = (): string => {
    const result = checkValue(newUri)
    const validity = result.length > 0
    setComplete(validity)
    return result
  }

  // generate function to check from "@" at the beginning of the string if not add it
  const checkValue = (uri: string) => {
    // check if value is empty
    if (uri.length === 0) {
      return ''
    }
    const regex = new RegExp('^@', 'i')
    return regex.test(uri) ? uri : `@${uri}`
  }

  return (
    <Flex>
      <Stack w="100%">
        <InputGroup>
          <InputLeftAddon
            css={{
              background: 'white',
              borderRadius: '0',
              border: 'none',
            }}
            pointerEvents="none"
            // eslint-disable-next-line react/no-children-prop
            children={isComplete ? <CheckIcon fontSize="md" /> : <Box fontSize="2xl" as={icon} />}
          />
          <Input
            onChange={handleChange}
            focusBorderColor="brand.900"
            onBlur={handleBlur}
            variant="unstyled"
            value={newUri.length > 0 ? newUri : ''}
            placeholder={placeholder}
            size="md"
          />
        </InputGroup>
      </Stack>
    </Flex>
  )
}
