import { Text } from '@chakra-ui/react'
import { useEnsName } from 'wagmi'

import { useStore } from '@/src/store'

export default function EnsName() {
  const address = useStore.getState().address
  const { data, isError, isLoading } = useEnsName({
    // @ts-ignore
    address,
  })
  if (isLoading) return <div>Fetching name…</div>
  if (isError) return <div>Error fetching name</div>
  return (
    <Text paddingBottom="3" fontWeight="none" as="sub" fontSize="xs">
      {data}
    </Text>
  )
}
