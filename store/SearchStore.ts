// store/SearchStore.ts
"use client"
import { DateRange } from 'react-day-picker';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Use interfaces instead of classes
interface SearchState {
  destination?: string;
  dates: DateRange[];
  options: {
    adults: number;
    children: number;
    rooms: number;
  };
  setDestination: (destination: string) => void;
  setDates: (dates: DateRange[]) => void;
  setOptions: (options: Partial<SearchState['options']>) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      destination: undefined,
      dates: [{ from: new Date(), to: new Date() } as DateRange],
      options: {
        adults: 1,
        children: 0,
        rooms: 1
      },
      setDestination: (destination) => set({ destination }),
      setDates: (dates) => set({ dates }),
      setOptions: (options) => set((state) => ({
        options: { ...state.options, ...options }
      }))
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, latest) => ({
        ...latest,
        dates: latest.dates.map((date, index) => ({
          ...date,
          from: new Date(date.from!),
          to: new Date(date.to!)
        }))
      })
    }
  )
);