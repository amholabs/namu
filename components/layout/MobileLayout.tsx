import React from 'react'

import { Box, VStack } from '@chakra-ui/react'

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" h="calc(100vh)" w="100%" bg="white">
      <VStack align="stretch">{children}</VStack>
    </Box>
  )
}
