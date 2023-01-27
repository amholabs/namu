import { ComposeClient } from '@composedb/client'
import { create } from 'zustand'

import { definition } from '../out/__generated__/runtime'

export const useStore = create(() => ({
  compose: new ComposeClient({ ceramic: process.env.NEXT_CERAMIC_URL || 'http://localhost:7007', definition }),
  address: `0x${'00000000000'}`,
  slot: '',
  name: '',
  ensName: '',
  authenticatedUser: '',
  urlLinks: [''],
  twitter: {
    value: '',
    loading: false,
  },
  instagram: {
    value: '',
    loading: false,
  },
}))
