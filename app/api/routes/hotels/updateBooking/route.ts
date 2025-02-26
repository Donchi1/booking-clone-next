import Hotels from "@/app/api/models/Hotel";
import { dbConnect } from "@/app/api/utils/dbConnect";
import { requireAuth } from "@/app/api/utils/verifyToken";
import { NextResponse } from "next/server";

// Update hotel total and booking
export const PATCH = requireAuth(async (req) => {
    await dbConnect();
  
    const { bookings } = await req.json();
    
    try {
      await Promise.all(bookings.map(async (each: any) => {
        const dbHotel = await Hotels.findOne({ rooms: { $in: [each.id] } });
        return await dbHotel?.updateOne({
          $set: {
            totalBookings: Number(dbHotel.totalBookings) + Number(each.totalBookings),
            totalBookPrice: Number(dbHotel.totalBookPrice) + Number(each.totalBookPrice)
          }
        });
      }));
      return NextResponse.json({ message: 'Hotel updated' }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err?.message }, { status: 500 });
    }
  });