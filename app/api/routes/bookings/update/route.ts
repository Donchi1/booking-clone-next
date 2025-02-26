// app/api/routes/bookings/update.ts
import { requireAuth } from "@/app/api/utils/verifyToken";
import Bookings from "@/app/api/models/BookingOrder";
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from "@/app/api/utils/dbConnect";

export const PATCH = requireAuth(async (req: NextRequest) => {

  await dbConnect();

  const bookingId = req.nextUrl.searchParams.get("bookingId");

  const updateInfo = await req.json();

  try {
    const updatedBooking = await Bookings.findByIdAndUpdate(
      bookingId,
      { $set: updateInfo },
      { new: true }
    );
    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
})