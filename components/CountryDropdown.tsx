"use client"

import React from 'react'
import { MapPin } from 'lucide-react'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", 
  "Argentina", "Australia", "Austria", "Bahamas", "Bahrain", 
  "Bangladesh", "Belgium", "Brazil", "Canada", "China", 
  "Denmark", "Egypt", "France", "Germany", "Greece", 
  "Hong Kong", "India", "Indonesia", "Ireland", "Italy", 
  "Japan", "Kenya", "Malaysia", "Mexico", "Netherlands", 
  "New Zealand", "Nigeria", "Norway", "Pakistan", "Peru", 
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", 
  "Russia", "Saudi Arabia", "Singapore", "South Africa", 
  "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", 
  "Turkey", "UAE", "UK", "USA", "Vietnam"
]

export default function CountryDropdown({ 
  state, 
  setState, 
  label = "Select Country", 
  placeholder = "Choose a country" 
}:{
  state: any,
  setState: React.Dispatch<React.SetStateAction<any>>,
  label?: string,
  placeholder?: string
}) {
  const handleCountryChange = (selectedCountry:string) => {
    setState({
      ...state,
      country: selectedCountry,
    })
  }

  return (
    <div className="space-y-2">
      <Label 
        htmlFor="country" 
        className="flex items-center space-x-2"
      >
        <MapPin className="w-4 h-4 text-gray-500" />
        <span>{label}</span>
      </Label>
      
      <Select 
        onValueChange={handleCountryChange}
        value={state?.country || ""}
      >
        <SelectTrigger 
          id="country" 
          className="w-full"
          aria-label="Country Selection"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map((country) => (
            <SelectItem 
              key={country} 
              value={country}
            >
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
