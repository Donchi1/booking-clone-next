import Rooms from "@/app/api/models/Room";
import { dbConnect } from "@/app/api/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest) {
    await dbConnect();

    const id = req.nextUrl.searchParams.get("roomId");
    const body = await req.json();

        try {
          await Rooms.updateOne(
            { "roomNumbers._id": id },
            {
              $push: {
                "roomNumbers.$.unavailableDates": body.dates
              },
            },
            
      
          );
      
          return NextResponse.json("Room status has been updated.", { status: 200 });
       
      }catch(error:any){
        return NextResponse.json({message:error?.message}, { status: 500 })
      }
    
}