import React, { PropsWithChildren } from 'react'

import { Box, VStack } from '@chakra-ui/react'

type MobileLayoutProps = {
  children: React.ReactNode
  backgroundImageUrl?: string
}
export default function MobileLayout(props: PropsWithChildren<MobileLayoutProps>) {
  const { children } = props
  return (
    // <Box padding="2rem" display="flex" justifyContent="center" alignItems="center" h="calc(100vh)" w="100%" bg="white">
    <Box padding="3rem" display="flex" h="calc(100vh)" flexDirection="column" flex={1}>
      {children}
    </Box>
  )
}
