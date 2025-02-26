// app/api/routes/bookings/get.ts
import Booking from "@/app/api/models/BookingOrder";
import { requireAuth } from "@/app/api/utils/verifyToken";
import { NextRequest, NextResponse } from 'next/server';

export const GET = requireAuth(async (req:NextRequest) => {

    const bookingId = req.nextUrl.searchParams.get("bookingId");
  try {
    const booking = await Booking.findById(bookingId);
    return NextResponse.json(booking, { status: 200 });
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
})