"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'
import { HotelType, SearchFilterParams } from '@/utils/types/hotel'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { Slider } from './ui/slider'
import { Separator } from './ui/separator'
import { Checkbox } from './ui/checkbox'
import Map from './Map'


interface FilterProps {
    setFilterParams: React.Dispatch<React.SetStateAction<SearchFilterParams>>
    filterParams: SearchFilterParams
    hotels: HotelType[]
}

const filterInfo = {
    propertyTypes: ["Hotel", "Apartment", "Villa", "Resort"],
    amenities: ["WiFi", "TV", "Air conditioning","Spa","Fitness Center","Kitchen","Restaurant","Pool","Balcony", "Parking"],
}

type FilterKey = 'propertyTypes' | 'amenities'


function Filter({ setFilterParams, filterParams, hotels }: FilterProps) {
    
    // State for price range
    const [priceRange, setPriceRange] = useState({
        minPrice: 1,
        maxPrice: 1000
    })

    const toggleFilterInfo = (value: string, key: FilterKey) => {
        // Update the filter params
        setFilterParams((prev) => {
            if ((prev[key as keyof SearchFilterParams] as string[])?.includes(value)) {
                return {
                    ...prev,
                    [key]: (prev[key as keyof SearchFilterParams] as string[])?.filter((item) => item !== value)
                }
            } else {
                return {
                    ...prev,
                    [key]: [...prev[key as keyof SearchFilterParams] as string[] || [], value]
                }
            }
        })
    }

    const handlePriceChange = async (value: number[]) => {
        // Update the price range
        setPriceRange({ minPrice: value[0], maxPrice: value[1] })

        // Wait for 1 second
        await new Promise(r => setTimeout(r, 1000))

        // Update the filter params
        setFilterParams((prev) => ({
            ...prev,
            minPrice: value[0],
            maxPrice: value[1]
        }))
    }

    const mapInfo = hotels?.length > 0 ? { cods: { lng: hotels[0]?.longitude!, lat: hotels[0]?.latitude! } } : { cods: { lng: 106.5348, lat: 38.7946 } }
    return (
        <div className='w-full md:sticky static top-20 overflow-x-hidden overflow-y-scroll h-[90vh]' >

            {/* Search Sidebar */}
            <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-1 gap-4">
                <h1 className="text-2xl font-bold mb-4 col-span-1">Filters By:</h1>

                {/* Destination Input */}
                <div >
                    <Map cods={mapInfo.cods!} />
                </div>
                <div className="mb-4 col-span-1">
                    <label className="block mb-2 font-semibold">Your Budget (Per Night)</label>
                    <div className="mt-4">
                        <div className='mb-4'>
                            <span>{priceRange.minPrice}</span>
                            {' - '}
                            <span>{priceRange.maxPrice}</span>
                        </div>
                        <Slider className='w-full bg-gray-100 text-primary'  
                        step={1} min={1} 
                        max={1000} 
                        value={[priceRange.minPrice!, priceRange.maxPrice!]} 
                        onValueChange={handlePriceChange}
                         />

                    </div>
                </div>
                <Separator />

                {/* Property Type Filter */}
                <div className="mb-4 col-span-1">
                    <label className="block mb-2 font-semibold ">Property Type</label>
                    <div className='space-y-2'>

                        {filterInfo.propertyTypes.map((property) => (
                            <div className="flex items-center space-x-2" key={property} onClick={() => toggleFilterInfo(property, 'propertyTypes')}>
                                <Checkbox className='checked:bg-primary w-5 h-5 ' checked={(filterParams.propertyTypes?.includes(property) || false)} />
                                <label>{property}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />
                {/* Date Range */}
                <div className="mb-4 col-span-1">
                    <label className="block mb-2 font-semibold ">Amenities</label>
                    <div className='space-y-2'>
                        {filterInfo.amenities.map((facility) => (
                            <div className="flex items-center space-x-2" key={facility} onClick={() => toggleFilterInfo(facility, 'amenities')}>
                                <Checkbox className='checked:bg-primary w-5 h-5 ' checked={(filterParams.amenities as string[]).includes(facility)} />
                                <label>{facility}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Search Button */}

                {/* <Button
                    className="w-full mt-4 col-span-1"
                    onClick={() => reFetch()}
                >
                    Search
                </Button> */}
            </div>
        </div>
    )
}

export default Filter