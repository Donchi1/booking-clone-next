"use client"

import Image from 'next/image'
import Link from 'next/link'

import { Separator } from "@/components/ui/separator"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"

export default function Footer() {
  const footerLinks = [
    {
      title: "Travel Destinations",
      items: [
        { label: "Countries", href: "/destinations/countries" },
        { label: "Regions", href: "/destinations/regions" },
        { label: "Cities", href: "/destinations/cities" },
        { label: "Districts", href: "/destinations/districts" },
        { label: "Airports", href: "/destinations/airports" },
        { label: "Hotels", href: "/hotels" }
      ]
    },
    {
      title: "Accommodation Types",
      items: [
        { label: "Homes", href: "/stays/homes" },
        { label: "Apartments", href: "/stays/apartments" },
        { label: "Resorts", href: "/stays/resorts" },
        { label: "Villas", href: "/stays/villas" },
        { label: "Hostels", href: "/stays/hostels" },
        { label: "Guest houses", href: "/stays/guest-houses" }
      ]
    },
    {
      title: "Travel Resources",
      items: [
        { label: "Unique Places", href: "/resources/unique-places" },
        { label: "Reviews", href: "/reviews" },
        { label: "Travel Articles", href: "/articles" },
        { label: "Travel Communities", href: "/communities" },
        { label: "Seasonal Deals", href: "/deals" }
      ]
    },
    {
      title: "Services",
      items: [
        { label: "Car Rental", href: "/services/car-rental" },
        { label: "Flight Finder", href: "/services/flights" },
        { label: "Restaurant Reservations", href: "/services/restaurants" },
        { label: "Travel Agents", href: "/services/agents" }
      ]
    },
    {
      title: "Company",
      items: [
        { label: "Customer Service", href: "/support" },
        { label: "Partner Help", href: "/partners" },
        { label: "Careers", href: "/careers" },
        { label: "Press Center", href: "/press" },
        { label: "Safety Resources", href: "/safety" },
        { label: "Investor Relations", href: "/investors" },
        { label: "Terms & Conditions", href: "/terms" }
      ]
    }
  ]

  const socialLinks = [
    { 
      icon: "/assets/icons/facebook.svg", 
      href: "https://facebook.com/donnybook", 
      label: "Facebook" 
    },
    { 
      icon: "/assets/icons/twitter.svg", 
      href: "https://twitter.com/donnybook", 
      label: "Twitter" 
    },
    { 
      icon: "/assets/icons/instagram.svg", 
      href: "https://instagram.com/donnybook", 
      label: "Instagram" 
    },
    { 
      icon: "/assets/icons/linkedin.svg", 
      href: "https://linkedin.com/company/donnybook", 
      label: "LinkedIn" 
    }
  ]

  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className=" space-y-8 md:space-y-0">
         
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 w-full">
            {footerLinks.map((section, index) => (
              <div key={index} className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">{section.title}</h4>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link 
                        href={item.href} 
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <Separator className="my-8" />
        <div className='flex flex-col md:flex-row justify-between items-center'>

        <div className="text-center text-sm text-gray-500 flex-1">
          Copyright {new Date().getFullYear()} Donnybook. All Rights Reserved.
        </div>
        <div className=" space-y-4">
            {/* <Image 
              src="/assets/imgs/donnybook.png" 
              alt="Donnybook Logo" 
              width={120} 
              height={40} 
              className="object-contain"
            /> */}
            <div className="flex space-x-4">
              <TooltipProvider>
                {socialLinks.map((social) => (
                  <Tooltip key={social.label}>
                    <TooltipTrigger asChild>
                      <Link 
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:opacity-75 transition-opacity"
                      >
                        <Image 
                          src={social.icon} 
                          alt={social.label} 
                          width={24} 
                          height={24} 
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      {social.label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          
          </div>
        </div>
      </div>
    </footer>
  )
}
