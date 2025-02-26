// app/api/routes/bookings/delete.ts
import { requireAdmin } from "@/app/api/utils/verifyToken";
import Booking from "../../../models/BookingOrder";
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = requireAdmin(async (req:NextRequest) => {

    const bookingId = req.nextUrl.searchParams.get("bookingId");

  try {
    await Booking.findByIdAndDelete(bookingId);
    return NextResponse.json({ message: "Booking has been deleted." }, { status: 200 });
  } catch (err:any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
})