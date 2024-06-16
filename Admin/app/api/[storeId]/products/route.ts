import { mongooseConnect } from '@/lib/mongoose';
import { Store } from '@/models/Store';
import { Product } from '@/models/Products';
import { Category } from '@/models/Category';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';

const validateProductData = (data: any) => {
  const { name, price, in_stock, categoryId, images } = data;

  if (!name || !images?.length || !price || !in_stock || !categoryId) {
    return { valid: false, message: "Required fields are missing" };
  }

  return { valid: true };
};

const createProduct = async (body: any, storeId: string) => {
  const { name, price, in_stock, categoryId, images, isFeatured, isArchived, ...dynamicProperties } = body;

  const product = await Product.create({
    name,
    isFeatured,
    isArchived,
    categoryId,
    storeId,
    images: images[0].url,
    detail: [{ price, in_stock, dynamicProperties }],
  });

  const productIdToAdd = product._id;
  await Store.findByIdAndUpdate(storeId, { $push: { products: productIdToAdd } }, { new: true });

  return product;
};

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    await mongooseConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    const body = await request.json();
    const validation = validateProductData(body);

    if (!validation.valid) {
      return new NextResponse(validation.message, { status: 400 });
    }

    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId,
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }
    const product = await createProduct(body, params.storeId);

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

const buildQuery = (searchParams: any, storeId: string) => {
  const categoryId = searchParams.get('categoryId') || '';
  const isFeatured = searchParams.get('isFeatured');
  const isArchived = searchParams.get('isArchived');

  const query: {
    storeId: string;
    categoryId?: string;
    isFeatured?: string;
    isArchived?: string;
  } = { storeId };

  if (categoryId) query.categoryId = categoryId;
  if (isFeatured !== null) query.isFeatured = isFeatured;
  if (isArchived !== null) query.isArchived = isArchived;

  return query;
};

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    await mongooseConnect();
    const { searchParams } = new URL(request.url);
    const query = buildQuery(searchParams, params.storeId);

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const ProductDoc = await Product.find(query).populate({
      path: 'categoryId',
      model: 'Category',
    });

    return Response.json({ ProductDoc: ProductDoc, success: true });

  } catch (err) {
      console.log(err);
      return Response.json({ message: err, success: false });
  }
}
