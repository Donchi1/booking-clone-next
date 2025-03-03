"use client"

import { useEffect, useState } from 'react'
import {
  Bed,
  Plane,
  Car,
  Landmark,
  CarIcon,
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { useSearchStore } from '@/store/SearchStore'
import { DatePickerRange } from '../DatePicker'
import GuestSelector from '../GuestSelector'



// Navigation items
const navigationItems = [
  { icon: Bed, label: "Stays", active: true },
  { icon: Plane, label: "Flights" },
  { icon: Car, label: "Car Rentals" },
  { icon: Landmark, label: "Attractions" },
  { icon: CarIcon, label: "Airport Taxis" }
]


export default function Header({ type = "default" }) {
  const router = useRouter()

  const {destination,dates,options, setDestination, setDates, setOptions } = useSearchStore()

  // const [localDestination, setLocalDestination] = useState(destination || "")

  // const [localDates, setLocalDates] = useState({
  //   from:  dates[0].from ,
  //   to: dates[0].to 
  // } as DateRange)



  const handleSearch = (e: React.FormEvent) => {
       e.preventDefault()
      // Create URLSearchParams with search data
      const searchParams = new URLSearchParams({
        destination: destination!,
        dates: JSON.stringify(dates),
        options: JSON.stringify(options),
      });
    router.push(`/main/lists?${searchParams.toString()}`);
  }

  if ( type === "bookings") return null


const handleGuestChange = (type: 'adults' | 'children' | 'rooms', operation: 'increase' | 'decrease') => {
    setOptions({
      ...options,
      [type]: operation === 'increase'
        ? options[type] + 1
        : Math.max(type === 'adults' ? 1 : 0, options[type] - 1)
    })
  }

  // useEffect(() => {
  //   setGuests(options)
  //   setLocalDates({
  //     from:  dates[0].from ,
  //     to: dates[0].to 
  //   })
  //   setLocalDestination(destination || "")
  // }, [options, destination, dates])

  return (
    <header className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white ${type === "default" ? "py-12" : "md:pt-0 pt-4 pb-4" }`}>
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <nav className="flex space-x-4 mb-8">
          {navigationItems.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full cursor-pointer transition-colors",
                item.active
                  ? "bg-white text-blue-600"
                  : "hover:bg-white/20"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Header Content */}
       { type === "default" && <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            A Special Discount for You? It's Real.
          </h1>
          <p className="text-lg">
            Grab rewards for your travels – unlock your special offer with a free Donnybook account!
          </p>
        </div>}

        {/* Search Container */}
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-xl">
          <form onSubmit={handleSearch}  className="gap-4 flex items-center justify-between flex-col md:flex-row ">
            <div className="grid md:grid-cols-3 flex-1 gap-4 w-full">
              {/* Destination Input */}
              <div className="flex items-center pr-1 pl-2 bg-white rounded-md border-white/20 space-x-2">
                <Bed className="text-primary-gray w-6 h-6" />
                <Input
                  required
                  placeholder="Where are you going?"
                  className=" text-primary-gray border-none outline-none  focus:!ring-0 rounded-none placeholder-gray-600/85"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              {/* Date Picker*/}
              <DatePickerRange dates={dates[0]} onChange={(item) => setDates([item!])} />
           

             <GuestSelector guests={options} onGuestChange={(key, value) => handleGuestChange(key, value)} />
            </div>

            {/* Search Button */}
            <div className=" text-center w-full md:w-auto ">
              <Button
                type="submit"
                className="bg-white text-blue-600 hover:bg-blue-50 w-full"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>
    </header>
  )
}
