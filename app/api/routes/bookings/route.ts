import {  requireAuth } from '@/app/api/utils/verifyToken';
// app/api/routes/bookings/create.ts
import Booking from "@/app/api/models/BookingOrder";
import { NextRequest, NextResponse } from 'next/server';

export const POST = requireAuth(async (req: NextRequest) => {
  const jsonBody = await req.json();
    const {
    bookings,
    amount,
    parsedRooms,
    totalBookedDates,
  } = jsonBody;

  const newBooking = new Booking({
    ...jsonBody,
    totalNights: totalBookedDates.length,
    bookedDates: totalBookedDates,
    bookedRoomsInfo: parsedRooms,
    totalPrice: amount,
    prices: bookings.map((each:Record<string, any>) => each.price),
    totalBookedRooms: bookings.reduce((acc:any, init:any) => acc + init.totalBookings, 0)
  });

  try {
    const savedBooking = await newBooking.save();
    return NextResponse.json(savedBooking, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
})