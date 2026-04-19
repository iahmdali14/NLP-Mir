import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FounderModeStore {
  isFounderMode: boolean;
  toggleFounderMode: () => void;
}

export const useFounderMode = create<FounderModeStore>()(
  persist(
    (set) => ({
      isFounderMode: false,
      toggleFounderMode: () => set((state) => ({ isFounderMode: !state.isFounderMode })),
    }),
    { name: 'founder-mode' }
  )
);
