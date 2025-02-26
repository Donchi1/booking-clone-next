'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, Hotel } from 'lucide-react';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
;
import { useAppStore } from '@/store/AppStore';
import { useFetch } from '@/utils/hooks/useFetch';

interface FeaturedCity {
  name: string;
  country: string;
  image: string;
  description?: string;
}

const FEATURED_CITIES: FeaturedCity[] = [
  {
    name: "Berlin",
    country: "Germany",
    image: "https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o=",
    description: "Experience the vibrant culture and rich history of Berlin."
  },
  {
    name: "Madrid",
    country: "Spain",
    image: "https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o=",
    description: "Discover the passion and energy of Spain's capital."
  },
  {
    name: "London",
    country: "United Kingdom",
    image: "https://www.studying-in-uk.org/wp-content/uploads/2019/05/study-in-london.jpg",
    description: "Explore the timeless charm of London's iconic landmarks."
  }
];

export default function Featured() {
  const router = useRouter();
  const { setCity } = useAppStore();

  const { isLoading, isError, data: propertyCounts } = useFetch('/api/routes/hotels/countByCity?cities=berlin,madrid,london');

  const handleCitySelect = (cityName: string) => {
    setCity(cityName);
    router.push(`/main/lists?destination=${cityName}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {[1, 2, 3].map((_, index) => (
          <Skeleton key={index} className="h-96 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>An error occurred while fetching data</p>
        {/* <p>{error.message}</p> */}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Explore Popular Destinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_CITIES.map((city, index) => (
            <Tooltip key={city.name}>
              <TooltipTrigger asChild>
                <Card 
                  className="group hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleCitySelect(city.name)}
                >
                  <CardContent className="p-0 relative">
                    <div className="relative h-64 w-full overflow-hidden rounded-t-xl">
                      <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        priority={index < 2}
                      />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors">
                          {city.name}
                        </h3>
                        <Badge variant="secondary" className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {city.country}
                        </Badge>
                      </div>
                      <p className="text-gray-600 line-clamp-2">
                        {city.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Hotel className="w-5 h-5" />
                          <span>
                            {propertyCounts?.[index]} Available Properties
                          </span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="group-hover:bg-primary group-hover:text-primary-white transition-colors"
                        >
                          Explore
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                Explore amazing hotels in {city.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}