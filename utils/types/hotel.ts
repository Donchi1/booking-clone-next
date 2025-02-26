

export type HotelType = {
  _id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  distance: string;
  photos?: string[];
  title: string;
  desc: string;
  rating?: number;
  totalBookings: number;
  totalBookPrice: number;
  rooms?: string[];
  cheapestPrice: number;
  featured: boolean;
  amenities?: string[];
  reviews?: any[];
  location?: string;
  policies?: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
  contact?: {
    phone: string;
    email: string;
  };
  latitude?: number;
  longitude?: number;
  country?: string;
  state?: string;
  openedYear?: number;
  zipcode?: string;
  continent?: string;
};

export type RoomNumberType = { number: number; _id?: string; unavailableDates: Date[] }

export type RoomType = {
  _id: string;
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
  roomNumber?: number;
  roomNumbers: RoomNumberType[];
};

export type OptionType = {
  adults: number;
  children: number;
  rooms: number;
}

export interface SearchFilterParams {
  minPrice?: number;
  maxPrice?: number;
  propertyTypes?: string[] | string;
  amenities?: string[];
}