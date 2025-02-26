"use client"
import Image from 'next/image'
import Link from 'next/link'
import { 
  MapPin, 
  Star, 
  DollarSign, 
  Heart, 
  HeartPulse
} from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card"
import { useFetch } from '@/utils/hooks/useFetch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { useAuthStore } from '@/store/AuthStore'

export default function FeaturedProperties() {
  const queryClient = useQueryClient()
  const {currentUser} = useAuthStore()

const {isError, isLoading, data: properties} = useFetch('/api/routes/hotels?featured=true&limit=4', {
  queryKey: ['featuredProperties']
})

const isFavourite = (id: string) => currentUser?.favouriteHotels?.includes(id)

const featuredMutation = useMutation({
  mutationFn: async (hotelId: string) => {
    const response = await axios.patch(`/api/routes/users/update/favourite?hotelId=${hotelId}&userId=${currentUser?._id}`,{
      isFavourite: !!isFavourite(hotelId)
    })
    return response.data
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries({queryKey:['currentUser']})
  }
})

//handle favourite
  const handleFavourite = async(id: string) => {
    try { 
      //mutate the data
       await featuredMutation.mutateAsync(id)

     //toast to change the status
      isFavourite(id) ? 
        toast.success("Removed from Favorites") : toast.success("Added to Favorites")
    }catch (error:any) {
      toast.error(error?.message || "Something went wrong")
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {[1, 2, 3, 4].map((_, index) => (
          <Skeleton key={index} className="h-[400px] w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center p-4">
        An error occurred while fetching properties
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {properties.length > 0 && properties?.map((property: any) => (
          <HoverCard key={property._id}>
            <HoverCardTrigger>
              <Card className="hover:shadow-xl transition-shadow duration-300 group">
                <CardContent className="p-0 relative">
                  <div className="relative h-48 w-full">
                    <Image
                      src={property.photos[0]}
                      alt={property.name}
                      fill
                      className="object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                        onClick={() => handleFavourite(property._id)}
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 bg-white/70 hover:bg-white"
                        >
                         {isFavourite(property._id)? <HeartPulse className="w-5 h-5 text-red-500" /> : <Heart className="w-5 h-5 text-red-500" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Add to Favorites
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {property.name}
                      </h3>
                      <Badge variant="secondary" className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.city}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">
                          {property.rating || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-primary">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-bold">
                          From ${property.cheapestPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-4">
                <h4 className="text-xl font-bold">{property.name}</h4>
                <p className="text-sm text-gray-600">{property.desc}</p>
                <div className="flex justify-end">
                  <Link className='cursor-pointer' href={`/main/lists/${property._id}`}>
                  <Button className='bg-primary hover:bg-primary-light'>Book Now</Button>
                  </Link>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </TooltipProvider>
  )
}
