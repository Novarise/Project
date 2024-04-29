import { mongooseConnect } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { Store } from "@/models/Store";

export async function POST(request: Request) {
  await mongooseConnect();
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id;
    const { name } = await request.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const StoreDoc = await Store.create({
      name, userId,
    })

    return NextResponse.json({ success: true, StoreDoc })

  } catch (error) {
    return NextResponse.json(false)
  }
}

export async function GET(request: Request) {
  await mongooseConnect();
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id

    const AllStoreDoc = await Store.find({ userId: userId })

    return NextResponse.json(AllStoreDoc)
  } catch (error) {
    return NextResponse.json(error)
  }
}

