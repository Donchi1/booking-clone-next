import Booking from "@/app/api/models/BookingOrder";
import { NextResponse } from 'next/server';

export const GET = async () => {
  const date = new Date();
  const tomorrow = new Date(new Date().setDate(date.getDate() + 1));
  const yesterday = new Date(new Date().setDate(date.getDate() - 1));

  try {
    const info = await Booking.aggregate([
      { $match: { createdAt: { $gt: yesterday, $lt: tomorrow } } },
      { $project: { price: "$totalPrice" } },
      { $group: { _id: "$_id", revenue: { $sum: "$price" } } }
    ]);
    return NextResponse.json(info, { status: 200 });
  } catch (error:any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
};