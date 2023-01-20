import { create } from 'zustand'

export const useStore = create(() => ({
  authenticatedUser: null,
  urlLinks: [],
}))
