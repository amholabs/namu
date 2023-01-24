import { PropsWithChildren } from 'react'

import { Button, Flex } from '@chakra-ui/react'

type ButtonProps = {
  clickHandler: () => void
  size?: 'xs' | 'sm' | 'md' | 'lg'
  isLoading?: boolean
}
export const CoreButton = (props: PropsWithChildren<ButtonProps>) => {
  const { clickHandler, size, isLoading, children } = props
  return (
    <Flex>
      <Button
        onClick={clickHandler}
        _hover={{ bg: 'black', color: 'white', border: '3px', borderColor: 'black' }}
        bg="white"
        size={size}
        border={'3px'}
        isLoading={isLoading}
        flex="1"
        padding="6">
        {children}
      </Button>
    </Flex>
  )
}
