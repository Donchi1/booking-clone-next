import mongoose from "mongoose";
export type BookingType = {
  hotelId: string;
  totalNights: number;
  totalPrice: number;
  prices: number[];
  status: string;
  payment_method?: string;
  currency?: string;
  userId: string;
  bookedRoomsInfo: any[];
  bookedDates: string[];
  totalBookedRooms: number;
};

const BookingSchema = new mongoose.Schema<BookingType>({
  hotelId: {
    type: String,
    required: true,
  },
  totalNights: {
    type: Number,
    required: true,
  },

  totalPrice: {
    type: Number,
    required: true,
  },
  prices: {
    type: [Number],
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
  payment_method: String,
  currency: String,
  userId: {
    type: String,
    required: true,
  },
  bookedRoomsInfo: Array,
  bookedDates:[String],
  totalBookedRooms: {
    type: Number,
  },
 
}, {timestamps: true });

export const Bookings = mongoose.models.Bookings as mongoose.Model<BookingType> || mongoose.model("Bookings", BookingSchema);

export default Bookings
