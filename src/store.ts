import { ComposeClient } from '@composedb/client'
import { create } from 'zustand'

import { definition } from '../out/__generated__/runtime'

export const useStore = create(() => ({
  compose: new ComposeClient({ ceramic: process.env.NEXT_CERAMIC_URL || 'http://localhost:7007', definition }),
  name: '',
  authenticatedUser: '',
  urlLinks: [''],
}))
