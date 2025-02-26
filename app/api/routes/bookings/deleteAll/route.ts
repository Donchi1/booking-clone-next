// app/api/routes/bookings/deleteAll.ts
import { requireAdmin } from "@/app/api/utils/verifyToken";
import Booking from "../../../models/BookingOrder";
import { NextResponse } from 'next/server';

export const DELETE = requireAdmin( async (req) => {
  try {
    await Booking.deleteMany({ _id: { $ne: "" } });
    return NextResponse.json({ message: "All bookings have been deleted." }, { status: 200 });
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
})