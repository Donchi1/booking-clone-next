import User from "@/app/api/models/User";
import { requireAuth } from "@/app/api/utils/verifyToken";
import { NextResponse } from "next/server";




export const GET = requireAuth(async (req) => {
    const id = req.user?.id
    const currentUser = await User.findById(id);

    if (!currentUser) {
        return NextResponse.json(
            { error: 'User not found' }, 
            { status: 404 }
        );
    }
    return NextResponse.json({user:currentUser, message:"Success"});
})