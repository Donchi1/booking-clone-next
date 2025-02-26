import { requireAdmin } from "../../utils/verifyToken";
import User from "@/app/api/models/User";
import { NextResponse } from "next/server";

// Get all users (Admin only)
export const GET = requireAdmin(async (req)=>{
    try {
      const users = await User.find();
      return NextResponse.json(users, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error:{message:err?.message || 'Something went wrong'}}, { status: 500 });
    }
  })