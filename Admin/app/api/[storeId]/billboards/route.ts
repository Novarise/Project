import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { mongooseConnect } from "@/lib/mongoose";
import { Billboard } from "@/models/Billboard";
import { Store } from "@/models/Store";
import { PutObjectCommand, S3Client, S3 } from "@aws-sdk/client-s3";
import { NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { storeId: string } }) {

  try {

    await mongooseConnect();
    const session = await getServerSession(authOptions)
    const userId = session?.user.id;

    const { label, imageUrl, active_billboard } = await request.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
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

    if (active_billboard){
      await Billboard.updateMany({active_billboard:true},{ $set: { active_billboard: false } })
    }
    
    const BillboardDoc = await Billboard.create({
      label, imageUrl, userId, storeId: params.storeId, store: storeByUserId, active_billboard
    })

    

    const billboardIdToAdd = BillboardDoc._id;
    const updateObject = active_billboard
      ? {
        $push: { billboards: billboardIdToAdd },
        $set: { activeBillboard: billboardIdToAdd },
      }
      : {
        $push: { billboards: billboardIdToAdd },
      };

    await Store.findByIdAndUpdate(
      params.storeId,
      updateObject,
      { new: true }
    );

    return Response.json({ success: true, Billboard: BillboardDoc });
  } catch (err) {
    console.log(err);
    return Response.json({ message: err, success: false });
  }
}

export async function GET(request: Request, { params }: { params: { storeId: string } }) {
  const session = await getServerSession(authOptions)
  await mongooseConnect();

  try {

    // const BillboardDoc = await Billboard.find({userId: session?.user.id ,storeId: params.storeId})
    const BillboardDoc = await Billboard.find({ storeId: params.storeId })


    return Response.json({ BillboardData: BillboardDoc, success: true });
  } catch (err) {
    console.log(err);
    return Response.json({ message: err, success: false });
  }
}
