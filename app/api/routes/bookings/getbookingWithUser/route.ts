import {  requireAuth } from '@/app/api/utils/verifyToken';
import Booking from "@/app/api/models/BookingOrder";
import User from "@/app/api/models/User";
import Hotel from "@/app/api/models/Hotel";
import { NextRequest, NextResponse } from 'next/server';


export const GET = requireAuth(async (req:NextRequest) => {

  const userId = req.nextUrl.searchParams.get('userId');


  try {
    const bookings = await Booking.find({
         $and:[{userId: userId}]
    });
    if (bookings.length === 0) {
      return NextResponse.json({ error: 'No bookings found' }, { status: 404 });
    }
    const mainBooking = await Promise.all(bookings.map(async (each) => {
      const dbUser = await User.findById(userId);
      const dbHotel = await Hotel.findById(each.hotelId);
      return { user: dbUser, hotel: dbHotel, booking: each };
    }));
    return NextResponse.json(mainBooking, { status: 200 });
  } catch (err:any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
})