import Hotels from "@/app/api/models/Hotel";
import Room from "@/app/api/models/Room";
import { dbConnect } from "@/app/api/utils/dbConnect";
import { requireAuth } from "@/app/api/utils/verifyToken";
import { HotelType, RoomType } from "@/utils/types/hotel";
import { NextResponse } from "next/server";

// Get hotel rooms
export const GET = requireAuth(async (req) => {
    await dbConnect();

    const hotelId = req.nextUrl.searchParams.get('hotelId');
  
    try {
      const hotel = await Hotels.findById(hotelId) as HotelType;
      if (!hotel) {
        return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
      }
  
      const list: RoomType[] = await Promise.all(
        (hotel.rooms as string[]).map((room: string) => Room.findById(room))
      );
  
      return NextResponse.json(list, { status: 200 });
    } catch (err:any) {
      return NextResponse.json({ error: err?.message }, { status: 500 });
    }
  });
  