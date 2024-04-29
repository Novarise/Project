import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { Store } from "@/models/Store";
import { Billboard } from "@/models/Billboard";
import { Category } from "@/models/Category";

export async function POST(request: Request, { params }: { params: { storeId: string } }) {
    
    try {
    
        await mongooseConnect();
          const session = await getServerSession(authOptions)
          const userId = session?.user.id;
         
          const { name, billboardId }  = await request.json();
  
          if (!userId ) {
              return new NextResponse("Unauthorized", { status: 403 });
            }
        
            if (!name) {
                return new NextResponse("Name is required", { status: 400 });
              }
              
              if (!billboardId) {
                return new NextResponse("Billboard ID is required", { status: 400 });
              }

            if (!params.storeId) {
              return new NextResponse("Store id is required", { status: 400 });
            }
        
            const storeByUserId = await Store.findOne({
              _id: params.storeId, userId,
            })
            if (!storeByUserId) {
              return new NextResponse("Unauthorized", { status: 405 });
            }
  
            const CategorydDoc = await Category.create({
              name, billboardId, storeId: params.storeId
            })
            
            const categoryIdToAdd = CategorydDoc._id; 

            await Store.findByIdAndUpdate(
              params.storeId,
              { $push: { categories: categoryIdToAdd } },
              { new: true } 
            );

        return Response.json({ success: true, Category: CategorydDoc });
    } catch (err) {
        console.log(err);
        return Response.json({ message: err, success: false });
    }
  }