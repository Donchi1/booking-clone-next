import Hotels from "@/app/api/models/Hotel";
import { dbConnect } from "@/app/api/utils/dbConnect";
import { NextResponse } from "next/server";

// Count hotels by type
export async function GET() {
    await dbConnect();
  
    try {
      const hotelTypes = ['hotel', 'apartment', 'resort', 'villa', 'cabin'];
      const typeCounts = await Promise.all(
        hotelTypes.map(async (type) => ({
          type: type === 'apartment' ? 'apartments' : type + 's',
          count: await Hotels.countDocuments({ type })
        }))
      );
  
      return NextResponse.json(typeCounts, { status: 200 });
    } catch (err:any) {
      return NextResponse.json({ error: err?.message }, { status: 500 });
    }
  }
  