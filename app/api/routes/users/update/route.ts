import User from '@/app/api/models/User';
import { requireAuth } from '@/app/api/utils/verifyToken';

import { NextRequest, NextResponse } from 'next/server.js';

export const PUT = requireAuth(async (req:NextRequest)=>{

    const userId = req.nextUrl.searchParams.get('userId');
    const requestBody = await req.json();

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: requestBody },
      { new: true }
    );
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: {message: error?.message}}, { status: 500 });
  }
})


