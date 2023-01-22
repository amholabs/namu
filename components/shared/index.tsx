import { PropsWithChildren } from 'react'

import { Button, Flex } from '@chakra-ui/react'

type ButtonProps = {
  clickHandler: () => void
}
export const CoreButton = (props: PropsWithChildren<ButtonProps>) => (
  <Flex paddingTop={'1em'}>
    <Button
      onClick={props.clickHandler}
      _hover={{ bg: 'black', color: 'white', border: '3px', borderColor: 'black' }}
      bg="white"
      border={'3px'}
      flex="1"
      padding="6">
      {props.children}
    </Button>
  </Flex>
)
