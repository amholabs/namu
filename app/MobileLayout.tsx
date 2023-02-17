import React, { PropsWithChildren } from 'react'

import { Box, VStack } from '@chakra-ui/react'

type MobileLayoutProps = {
  children: React.ReactNode
  backgroundImageUrl?: string
  backgroundStyles?: string
  filter?: string
}
export default function MobileLayout(props: PropsWithChildren<MobileLayoutProps>) {
  const { children, backgroundImageUrl, backgroundStyles } = props
  return (
    // <Box padding="2rem" display="flex" justifyContent="center" alignItems="center" h="calc(100vh)" w="100%" bg="white">
    <Box
      bg={`${backgroundStyles} url('${backgroundImageUrl}') center/cover no-repeat`}
      // filter={filter}
      padding="2.2rem"
      display="flex"
      h="calc(100vh)"
      flexDirection="column"
      flex={1}>
      {children}
    </Box>
  )
}
