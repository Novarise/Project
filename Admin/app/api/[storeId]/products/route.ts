import { mongooseConnect } from "@/lib/mongoose";
import { Store } from "@/models/Store";
import { Product } from "@/models/Products";
import { Category } from "@/models/Category";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: Request, { params }: { params: { storeId: string } }) {
  try {
    await mongooseConnect();
    const session = await getServerSession(authOptions)
    const userId = session?.user.id;

    const body = await request.json();
    const { name, price, in_stock, categoryId, images, isFeatured, isArchived, ...dynamicProperties } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!in_stock) {
      return new NextResponse("In Stock quantity is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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
    const product = await Product.create({
      name,
      isFeatured,
      isArchived,
      categoryId,
      storeId: params.storeId,
      images: images[0].url,
      detail: [
        {
          price,
          in_stock,
          dynamicProperties,
        },
      ],
    });

    const productIdToAdd = product._id;

    await Store.findByIdAndUpdate(
      params.storeId,
      { $push: { products: productIdToAdd } },
      { new: true }
    );

    return NextResponse.json(product);

  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(request: Request, { params }: { params: { storeId: string } }) {

  try {
    await mongooseConnect();

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId') || '';
    const isFeatured = searchParams.get('isFeatured');
    const isArchived = searchParams.get('isArchived');

    console.log(typeof isFeatured, categoryId)

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const query: {
      storeId: string;
      categoryId?: string;
      isFeatured?: string;
      isArchived?: string;
    } = {
      storeId: params.storeId,
    };

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (isFeatured !== null) {
      query.isFeatured = isFeatured;
    }

    if (isArchived !== null) {
      query.isArchived = isArchived;
    }

    const ProductDoc = await Product.find(query)
      .populate({
        path: 'categoryId',
        model: 'Category',
      })
    // console.log("ProductDoc; ",ProductDoc)

    return Response.json({ ProductDoc: ProductDoc, success: true });
  } catch (err) {
    console.log(err);
    return Response.json({ message: err, success: false });
  }

}