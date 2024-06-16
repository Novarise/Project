import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { mongooseConnect } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Store } from '@/models/Store';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { categoryId: string; storeId: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!params.categoryId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId,
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const CategoryDeletedDoc = await Category.deleteOne({
      _id: params.categoryId,
    });
    await Store.updateOne(
      { categories: params.categoryId },
      { $pull: { categories: params.categoryId } },
    );
    return Response.json({
      CategoryDeletedDoc: CategoryDeletedDoc,
      success: true,
    });
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { categoryId: string; storeId: string } },
) {
  await mongooseConnect();
  try {
    const session = await getServerSession(authOptions);

    const { name, billboardId } = await request.json();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId,
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const filter = { _id: params.categoryId, userId: userId };
    const update = { $set: { name: name, billboardId: billboardId } };

    const options = { returnOriginal: false };

    const CategoryUpdatedDoc = await Category.findByIdAndUpdate(
      filter,
      update,
      options,
    );

    return Response.json({
      CategoryUpdatedDoc: CategoryUpdatedDoc,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return Response.json({ message: err, success: false });
  }
}
