import { Dispatch, SetStateAction } from "react";


export const handleGuestChange = (type: 'adults' | 'children' | 'rooms', operation: 'increase' | 'decrease', setGuests: Dispatch<SetStateAction<{
    adults: number;
    children: number;
    rooms: number;
}>>) => {
    setGuests(prev => ({
      ...prev,
      [type]: operation === 'increase'
        ? prev[type] + 1
        : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
    }))
  }
