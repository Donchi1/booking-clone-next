import Hotels from "@/app/api/models/Hotel";
import { dbConnect } from "@/app/api/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

// Count hotels by city
export async function GET(req: NextRequest) {
    await dbConnect();
    
    const { searchParams } = req.nextUrl;
    const cities = searchParams.get('cities')?.split(',') || [];
  
    try {
      const list = await Promise.all(
        cities.map((city) => Hotels.countDocuments({ city }))
      );
  
      return NextResponse.json(list, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  