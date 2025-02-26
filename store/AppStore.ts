"use client"
import { create } from "zustand"


interface AppStoreState {
    isOpen: boolean
    city: string

    onOpen: () => void
    onClose: () => void
    setCity: (city: string) => void
}

export const useAppStore = create<AppStoreState>((set) => ({
    isOpen: false,
    city: "",

    setCity: (city) => set({ city }),
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));