'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import Navbar from '@/components/navbar/Navbar';
import Header from '@/components/header/Header';
import SearchItem from '@/components/searchItem/SearchItem';

import { useSearchParams } from 'next/navigation';
import Filter from '@/components/Filter';
import { HotelType, SearchFilterParams } from '@/utils/types/hotel';
import { Skeleton } from '@/components/ui/skeleton';
import Footer from '@/components/footer/Footer';
import MailList from '@/components/mailList/MailList';

// Define types for search parameters and hotel






export default function Lists() {

    // Get search parameters from URL
    const propertyType = useSearchParams().get("propertyType")
    const dates = JSON.parse(useSearchParams().get("dates") || '{}')
    const options = JSON.parse(useSearchParams().get("options") || '{}')
    const destination = useSearchParams().get("destination")
    
    const [searchParams, setSearchParams] = useState<SearchFilterParams>({
        propertyTypes: propertyType?[propertyType?.toLowerCase() as string]:[],
        amenities: [],
        minPrice: 1,
        maxPrice: 1000
    })
     const { propertyTypes, amenities, minPrice, maxPrice } = searchParams
    // Fetch hotels using React Query
    const {
        data: hotels,
        isLoading,
    } = useQuery<HotelType[]>({
        queryKey: ['hotels', propertyType, destination, searchParams],
        queryFn: async () => {
            const { data } = await axios.get('/api/routes/hotels', {
                params: {
                    propertyType: propertyType?.toLowerCase() || propertyTypes?.length as number> 0 ? (propertyTypes as string[])?.join(','): [],
                    city: destination,
                    amenities: amenities?.length as number > 0 ? amenities?.join(','):[],
                    min: minPrice,
                    max: maxPrice
                }
            });
            return data;
        },
        // Disable initial fetch if no destination is set
        enabled: true
    });


    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Header type='list' />
            <div className="container mx-auto px-4 ">
                <div className=" py-8">
                    <div className="flex flex-col  md:flex-row gap-8 ">
                        <div className="w-full md:w-1/4">
                            <Filter setFilterParams={setSearchParams} hotels={hotels!} filterParams={searchParams} />
                        </div>
                        <div className="w-full md:w-3/4 space-y-4">
                            {isLoading ? [...Array(5)].map((_, index) => (
                                <div key={index} className="h-64 w-full space-y-4">
                                    <Skeleton className="h-full w-full shadow-md bg-gray-200" />
                                </div>
                            )) : (
                                hotels?.length as number > 0 ? hotels?.map((hotel) => (
                                    <SearchItem
                                        key={hotel._id}
                                        item={hotel}
                                        dates={dates}
                                        options={options}
                                    />
                                )) :
                                    <div className="text-center text-red-600 h-screen flex justify-center items-center">
                                        <div className='h-[80vh] flex justify-center items-center'>
                                            No hotels found
                                        </div>
                                    </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <MailList />
            <Footer />
        </div>
    );
}