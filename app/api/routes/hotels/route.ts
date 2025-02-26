
import Hotels from "@/app/api/models/Hotel";
import { dbConnect } from "@/app/api/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

// GET all hotels
export async function GET(req: NextRequest) {

    await dbConnect();
    
    const { searchParams } = req.nextUrl;
    const min = searchParams.get('min') || '1';
    const max = searchParams.get('max') || '999999';
    const city = searchParams.get('city') || '';
    const fromAdmin = searchParams.get('fromAdmin') || false;
    const featured = searchParams.get('featured') ? Boolean(searchParams.get('featured')) : false;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const propertyTypeInfo = searchParams.get('propertyType') || "";
    const amenitiesInfo = searchParams.get('amenities')  || '';
    const amenities = amenitiesInfo.length ? amenitiesInfo.split(',') : [];
    const propertyType = propertyTypeInfo.length ? propertyTypeInfo.split(',') : [];

    try {
      let hotels;
      
      if (fromAdmin) {
        hotels = await Hotels.find();
      } else if (featured) {
        hotels = await Hotels.find({ featured: true }).limit(limit || 10);
      } else {
        hotels = await Hotels.find({
          $or: [
            { city: city ? { $regex: city, $options: 'i' } : city },
            { cheapestPrice: { $gt: Number(min), $lt: Number(max) } },
            { type: { $in: propertyType.length ? propertyType : [null] } }, // Matches any property type
            { amenities: { $all: amenities.length ? amenities : [null] } } // Matches all amenities
        ]
        });
      }
  
      return NextResponse.json(hotels, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err?.message }, { status: 500 });
    }
  }