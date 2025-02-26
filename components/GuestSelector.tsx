"use client"
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { Users } from 'lucide-react'


interface Guest {
    adults: number
    children: number
    rooms: number
  }
  


interface GuestSelectorInterface {
    guests: Guest
    onGuestChange: (type: keyof Guest, action: 'increase' | 'decrease') => void
}

function GuestSelector({ guests, onGuestChange }: GuestSelectorInterface) {
  return (
    <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className="w-full justify-start text-primary-gray">
        <Users className="mr-2 h-4 w-4" />
        {`${guests.adults} adult · ${guests.children} children · ${guests.rooms} room`}
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <div className="space-y-4">
        {Object.keys(guests).map((type) => (
          <div key={type} className="flex justify-between items-center">
            <span className="capitalize">{type}</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onGuestChange(type as keyof Guest, 'decrease')}
                disabled={type === 'adults' && guests[type] <= 1}
              >
                -
              </Button>
              <span>{guests[type as keyof Guest]}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onGuestChange(type as keyof Guest, 'increase')}
              >
                +
              </Button>
            </div>
          </div>
        ))}
      </div>
    </PopoverContent>
  </Popover>
  )
}

export default GuestSelector