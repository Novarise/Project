import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { Store } from "@/models/Store";
import { Category } from "@/models/Category";
import { Product } from "@/models/Products";
import { Billboard } from "@/models/Billboard";

export async function PATCH(request: Request, { params }: { params: { storeId: string } }) {
    await mongooseConnect();
    try {
        const session = await getServerSession(authOptions)
        const { name } = await request.json();
        const userId = session?.user.id


        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const filter = { _id: params.storeId, userId: userId };
        const update = { $set: { name: name } };

        const options = { returnOriginal: false };

        const store = await Store.findOneAndUpdate(filter, update, options)
        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORE_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { storeId: string } }) {
    await mongooseConnect();
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user.id

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const filter = { _id: params.storeId, userId: userId };

        const store = await Store.findOneAndDelete(filter)
        
        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORE_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: { storeId: string } }) {
    await mongooseConnect();
    try{

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
          }

          const StoreDoc =  await Store.findOne({_id: params.storeId})
            .populate({
              path: 'categories',
              model: Category,
            })
            .populate({
                path: 'products',
                model: Product,
                populate: {
                    path: 'categoryId',
                    model: Category,
                  },
              })
            .populate({
                path:"activeBillboard",
                model: Billboard
            })
            
           
            return Response.json({ StoreDoc: StoreDoc, success: true });
        } catch (err) {
            console.log(err);
            return Response.json({ message: err, success: false });
        }

}
