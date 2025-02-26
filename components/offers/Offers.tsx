"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Offers() {
  const offers = [
    {
      title: "Escape for a while",
      description: "Enjoy the freedom of a monthly stay on Donnybook",
      image: "/assets/imgs/offer.jpeg",
      linkText: "Discover Monthly Stay",
      linkHref: "/offers",
      badge: "New"
    },
    {
      title: "New year, new adventures",
      description: `Save 15% or more when you book and stay before March 31, ${new Date().getFullYear()}`,
      image: "/assets/imgs/offer1.jpeg",
      linkText: `Find offer ${new Date().getFullYear()}`,
      linkHref: "/offers",
      badge: "Discount"
    }
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {offers.map((offer, index) => (
            <Card 
              key={index} 
              className="overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <CardHeader className="p-0 relative">
                <div className="relative w-full h-64">
                  <Image 
                    src={offer.image} 
                    alt={offer.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <Badge 
                    variant={offer.badge === "New" ? "default" : "destructive"} 
                    className="absolute top-4 right-4"
                  >
                    {offer.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-gray-600">
                    {offer.description}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={offer.linkHref} passHref>
                  <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-white">
                    {offer.linkText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
