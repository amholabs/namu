import { PropsWithChildren } from 'react'

import { Text } from '@chakra-ui/react'
type ButtonProps = {
  clickHandler: () => void
  size?: 'xs' | 'sm' | 'md' | 'lg'
  isLoading?: boolean
  color: string
}
export const TextButton = (props: PropsWithChildren<ButtonProps>) => {
  const { clickHandler, size, color, children } = props
  return (
    <Text textAlign="center" color={color} onClick={clickHandler} size={size} fontSize="sm" marginTop="auto" paddingBottom="3rem">
      {children}
    </Text>
  )
}
