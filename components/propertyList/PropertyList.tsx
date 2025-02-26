"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetch } from '@/utils/hooks/useFetch'
import Link from 'next/link'


const propertyImages = [
  {
    src: "https://cf.bstatic.com/xdata/images/xphoto/square300/57584488.webp?k=bf724e4e9b9b75480bbe7fc675460a089ba6414fe4693b83ea3fdd8e938832a6&o=",
    type: "Hotels"
  },
  {
    src: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-apartments_300/9f60235dc09a3ac3f0a93adbc901c61ecd1ce72e.jpg",
    type: "Apartments"
  },
  {
    src: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/bg_resorts/6f87c6143fbd51a0bb5d15ca3b9cf84211ab0884.jpg",
    type: "Resorts"
  },
  {
    src: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-villas_300/dd0d7f8202676306a661aa4f0cf1ffab31286211.jpg",
    type: "Villas"
  },
  {
    src: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-chalet_300/8ee014fcc493cb3334e25893a1dee8c6d36ed0ba.jpg",
    type: "Chalets"
  }
]

export default function PropertyList() {
const { data: propertyData, isLoading, error } = useFetch('/api/routes/hotels/countByType')



  if (isLoading) {
    return (
      <div className="container px-4 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-64 w-full" />
        ))}
      </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load property types
      </div>
    )
  }

  return (
    <section className="py-12 bg-gray-50 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {propertyImages.map((property, index) => (
            <Link  key={index}  href={`/main/lists?propertyType=${property.type}`}>
            <Card 
              
              className="overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative w-full h-48">
                <Image
                  src={property.src}
                  alt={property.type}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {property.type}
                </h3>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">
                    {propertyData?.[index]?.count || 0} {property.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
