'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import Navbar from '@/components/navbar/Navbar';
import Header from '@/components/header/Header';
import SearchItem from '@/components/searchItem/SearchItem';
import Filter from '@/components/Filter';
import { HotelType, SearchFilterParams } from '@/utils/types/hotel';
import { Skeleton } from '@/components/ui/skeleton';
import Footer from '@/components/footer/Footer';
import MailList from '@/components/mailList/MailList';
import Loader from '@/components/loader/loader';

export default function Lists() {
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Header type='list' />
                <div className="container mx-auto px-4 ">
                    <div className=" py-8">
                        <Suspense fallback={<Loader />}>
                            <ListDataWrapper />
                        </Suspense>
                    </div>
                </div>
                <MailList />
                <Footer />
            </div>
        </>
    );
}

function ListDataWrapper() {
    const searchParams = useSearchParams()
    const propertyType = searchParams ? searchParams?.get("propertyType") : undefined
    const destination = searchParams ? searchParams.get("destination") : undefined

    const [searchFilterParams, setSearchFilterParams] = useState<SearchFilterParams>({
        propertyTypes: propertyType ? [propertyType?.toLowerCase() as string] : [],
        amenities: [],
        minPrice: 1,
        maxPrice: 1000
    })

    const { propertyTypes, amenities, minPrice, maxPrice } = searchFilterParams

    // Fetch hotels using React Query
    const {
        data: hotels,
        isLoading,
        error
    } = useQuery<HotelType[]>({
        queryKey: ['hotels', propertyType, destination, searchFilterParams],
        queryFn: async () => {
            const { data } = await axios.get('/api/routes/hotels', {
                params: {
                    propertyType: propertyType?.toLowerCase() || propertyTypes?.length as number > 0 ? (propertyTypes as string[])?.join(',') : [],
                    city: destination,
                    amenities: amenities?.length as number > 0 ? amenities?.join(',') : [],
                    min: minPrice,
                    max: maxPrice
                }
            });
            return data;
        },
        enabled: true
    });

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
                <Filter 
                    setFilterParams={setSearchFilterParams} 
                    hotels={hotels || []} 
                    filterParams={searchFilterParams} 
                />
            </div>
            <div className="w-full md:w-3/4 space-y-4">
                {isLoading ? (
                    <FallBackLoader />
                ) : error ? (
                    <div className="text-center text-red-600 h-screen flex justify-center items-center">
                        <div className='h-[80vh] flex justify-center items-center'>
                            {error.message || "An error occurred while fetching hotels"}
                        </div>
                    </div>
                ) : (
                    <ListDataComponent hotels={hotels || []} />
                )}
            </div>
        </div>
    );
}

const ListDataComponent = ({ hotels }: { hotels: HotelType[] }) => {
    return (
        <>
            {hotels.length > 0 ? hotels.map((hotel) => (
                <SearchItem
                    key={hotel._id}
                    item={hotel}
                />
            )) : (
                <div className="text-center text-red-600 h-screen flex justify-center items-center">
                    <div className='h-[80vh] flex justify-center items-center'>
                        No hotels found
                    </div>
                </div>
            )}
        </>
    )
}

const FallBackLoader = () => {
    return (
        <div>
            {[...Array(5)].map((_, index) => (
                <div key={index} className="h-64 w-full space-y-4">
                    <Skeleton className="h-full w-full shadow-md bg-gray-200" />
                </div>
            ))}
        </div>
    )
}