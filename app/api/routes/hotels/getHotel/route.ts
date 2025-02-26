import Hotels from "@/app/api/models/Hotel";
import { dbConnect } from "@/app/api/utils/dbConnect";
import { requireAuth } from "@/app/api/utils/verifyToken";
import { NextResponse } from "next/server";

// Get a hotel
export const GET = requireAuth(async (req) => {
    await dbConnect();
     
    const hotelId = req.nextUrl.searchParams.get("hotelId")

    
    try {
      const hotel = await Hotels.findById(hotelId);
      return NextResponse.json(hotel, { status: 200 });
    } catch (err:any) {
      return NextResponse.json({ error: err?.message }, { status: 500 });
    }
  });