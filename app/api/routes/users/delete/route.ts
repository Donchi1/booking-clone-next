import User from '@/app/api/models/User';
import { imageDelete } from '@/app/api/utils/cloudImage';
import { requireAdmin } from '@/app/api/utils/verifyToken';
import { NextRequest, NextResponse } from 'next/server';


export const DELETE = requireAdmin(async (req: NextRequest)=>{
    const userId = req.nextUrl.searchParams.get('userId')
   
  
    try {
      const user = await User.findByIdAndDelete(userId);
      const info = await imageDelete(user?.img!)
      if(info.error) return NextResponse.json(info.data, { status: 400 })
      return NextResponse.json({message:"User has been deleted."}, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({error:{message:err?.message || 'Something went wrong'}}, { status: 500 });
    }
  })