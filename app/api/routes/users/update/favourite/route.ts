
import Users from "@/app/api/models/User";
import { requireAuth } from "@/app/api/utils/verifyToken";
import { NextResponse } from "next/server";

// Update hotel favourite
export const PATCH = requireAuth(async (req) => {
    const hotelId  = req.nextUrl.searchParams.get('hotelId'); 
    const userId  = req.nextUrl.searchParams.get('userId'); 

    const {isFavourite} = await req.json()

    const query = isFavourite ?{ $pull: { favouriteHotels: hotelId } } : { $push: { favouriteHotels: hotelId } } 

    try {
      const updatedUser = await Users.findByIdAndUpdate(
        userId,
        query,
        { new: true }
      );
      return NextResponse.json(updatedUser, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: {message: err?.message || 'Something went wrong' } }, { status: 500 });
    }
  });
  