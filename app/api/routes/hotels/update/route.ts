import Hotels from "@/app/api/models/Hotel";
import { requireAdmin } from "@/app/api/utils/verifyToken";
import { NextResponse } from "next/server";

// Update a hotel (Admin only)
export const PUT = requireAdmin(async (req) => {
    const hotelId  = req.nextUrl.searchParams.get('hotelId'); 
    const reqData = await req.json();
    try {
      const updatedHotel = await Hotels.findByIdAndUpdate(
        hotelId,
        { $set: reqData },
        { new: true }
      );
      return NextResponse.json(updatedHotel, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err?.message }, { status: 500 });
    }
  });
  