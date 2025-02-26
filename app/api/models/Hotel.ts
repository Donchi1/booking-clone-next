import mongoose from "mongoose";

interface HotelType {
  name: string;
  _id: string;
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
}


const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  totalBookPrice: {
    type: Number,
    default: 0
  },
  rooms: {
    type: [String],
  },
  cheapestPrice: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
});


export const Hotels = mongoose.models.Hotels as mongoose.Model<HotelType> || mongoose.model<HotelType>("Hotels", HotelSchema);
export default Hotels;