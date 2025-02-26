// app/api/routes/bookings/lastSixMonths.ts
import { requireAdmin } from "@/app/api/utils/verifyToken.js";
import Booking from "@/app/api/models/BookingOrder";
import { NextResponse } from 'next/server';

export const GET = requireAdmin(async () => {
  const date = new Date();
  const lastSixMonths = new Date(new Date().setMonth(date.getMonth() - 6));

  try {
    const info = await Booking.aggregate([
      { $match: { createdAt: { $gte: lastSixMonths, $lt: date } } },
      { $project: { price: "$totalPrice", month: { $month: "$createdAt" } } },
      { $group: { _id: "$month", total: { $sum: "$price" } } }
    ]).sort({ _id: 1 });
    return NextResponse.json(info, { status: 200 });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
})