"use client"

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Wifi, Sun, Check } from 'lucide-react'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {useSearchStore} from '@/store/SearchStore'
import { DateRange } from 'react-day-picker'
import { OptionType } from '@/utils/types/hotel'

export default function SearchItem({ 
  item, 
  dates,
  options
}:{
  item: any,
  dates: DateRange
  options:OptionType
}) {
  const {setDates,setOptions} = useSearchStore();
  


  return (
    <Card className="flex md:flex-row flex-col  overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full md:w-1/3 h-64">
        <Image 
          src={item.photos[0]} 
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <CardContent className="md:w-2/3 w-full p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {item.name}
              </h2>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{item.distance}m from center</span>
              </div>
            </div>

            {item.rating && (
              <Badge variant="outline" className="bg-green-100 text-green-800 gap-1 md:text-inherit text-[10px] flex items-center">
                {item.rating} <span>Excellent</span>
              </Badge>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <Wifi className="w-4 h-4" />
              <span>Free airport taxi</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Sun className="w-4 h-4" />
              <span>Studio Apartment with Air conditioning</span>
            </div>
            <p className="text-gray-600">{item.desc}</p>
          </div>

          <div className="flex items-center space-x-2 text-green-600 mb-4">
            <Check className="w-5 h-5" />
            <span>Free cancellation - You can cancel later!</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              ${item.cheapestPrice}
            </div>
            <div className="text-sm text-gray-500">
              Includes taxes and fees
            </div>
          </div>

          <Link 
            href={`/main/lists/${item._id}`} 
            onClick={() => {
              setDates([dates])
              setOptions(options)
            }}
          >
            <Button className='bg-primary hover:bg-primary-light text-primary-white'>
              See Availability
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
