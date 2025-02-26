import Hotels from "@/app/api/models/Hotel";
import { getPublicId, imageDeleteMultiple } from "@/app/api/utils/cloudImage";
import { dbConnect } from "@/app/api/utils/dbConnect";
import { requireAdmin } from "@/app/api/utils/verifyToken";
import { NextResponse } from "next/server";

// Delete a hotel (Admin only)
export const DELETE = requireAdmin(async (req) => {
    await dbConnect();
    const hotelId = req.nextUrl.searchParams.get('id');
    try {
      const hotel = await Hotels.findByIdAndDelete(hotelId);
      if (!hotel) return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
  
      const info = await imageDeleteMultiple(hotel.photos.map((each: string) => ({public_id: getPublicId(each)})))
  
      if (info.error) return NextResponse.json({ error: info.data }, { status: 400 });
      return NextResponse.json({ message: 'Hotel has been deleted' }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err?.message }, { status: 500 });
    }
  });