import { PropsWithChildren } from 'react'

import { Button, Flex, Text } from '@chakra-ui/react'

type ButtonProps = {
  clickHandler: () => void
  size?: 'xs' | 'sm' | 'md' | 'lg'
  isLoading?: boolean
  color?: string
}
export const CoreButton = (props: PropsWithChildren<ButtonProps>) => {
  const { clickHandler, size, isLoading, children } = props
  return (
    <Button
      onClick={clickHandler}
      _hover={{ bg: 'black', color: 'white', border: '3px', borderColor: 'black' }}
      bg="white"
      size={size}
      border={'3px'}
      isLoading={isLoading}
      width="300px"
      flex="1"
      padding="6">
      {children}
    </Button>
  )
}

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
