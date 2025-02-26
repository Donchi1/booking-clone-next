
import { requireAdmin } from '@/app/api/utils/verifyToken';
import Booking from "@/app/api/models/BookingOrder";
import User from "@/app/api/models/User";
import Hotel from "@/app/api/models/Hotel";
import { NextRequest, NextResponse } from 'next/server';

export const GET = requireAdmin(async (req:NextRequest) => {
  const limit = req.nextUrl.searchParams.get('limit');

  try {
    const bookings = await Booking.find().limit(limit ? Number(limit) : 1000);
    const mainBooking = await Promise.all(bookings.map(async (each) => {
      const dbUser = await User.findById(each.userId);
      const dbHotel = await Hotel.findById(each.hotelId);
      return { user: dbUser, hotel: dbHotel, booking: each };
    }));
    return NextResponse.json(mainBooking, { status: 200 });
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
})