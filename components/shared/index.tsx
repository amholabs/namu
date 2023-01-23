import { PropsWithChildren } from 'react'

import { Button, Flex } from '@chakra-ui/react'

type ButtonProps = {
  clickHandler: () => void
  size: 'xs' | 'sm' | 'md' | 'lg'
}
export const CoreButton = (props: PropsWithChildren<ButtonProps>) => (
  <Flex>
    <Button
      onClick={props.clickHandler}
      _hover={{ bg: 'black', color: 'white', border: '3px', borderColor: 'black' }}
      bg="white"
      size={props.size}
      border={'3px'}
      flex="1"
      padding="6"
      marginTop="1em">
      {props.children}
    </Button>
  </Flex>
)
