import Hotels from "@/app/api/models/Hotel";
import { imageDeleteMultiple, imageUploaderMultiple } from "@/app/api/utils/cloudImage";
import { dbConnect } from "@/app/api/utils/dbConnect";
import { requireAdmin } from "@/app/api/utils/verifyToken";
import { UploadApiResponse } from "cloudinary";
import { NextResponse } from "next/server";

// Create a new hotel (Admin only)
export const POST = requireAdmin(async (req) => {
    await dbConnect();
  
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];
    const hotelInfo = await req.json();
  
    // Validate files
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }
  
    
    const info = await imageUploaderMultiple(files) ;
    if (info.error) return NextResponse.json({ error: info.error.message }, { status: 400 });
  
    const newHotel = new Hotels({ ...hotelInfo, photos: (info.data as UploadApiResponse[])?.map(each => each.secure_url) });
    try {
      const savedHotel = await newHotel.save();
      return NextResponse.json(savedHotel, { status: 201 });
    } catch (err: any) {
      await imageDeleteMultiple(info?.data as UploadApiResponse[]);
      return NextResponse.json({ error: err?.message }, { status: 500 });
    }
  });