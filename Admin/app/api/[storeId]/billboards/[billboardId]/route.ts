import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { mongooseConnect } from '@/lib/mongoose';
import { Billboard } from '@/models/Billboard';
import { Store } from '@/models/Store';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { billboardId: string; storeId: string } },
) {
  await mongooseConnect();
  try {
    const session = await getServerSession(authOptions);

    const { label, imageUrl, active_billboard } = await request.json();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!label) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId,
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const filter = { _id: params.billboardId, userId: userId };
    const update = {
      $set: { label: label, imageUrl: imageUrl, active_billboard },
    };

    const options = { returnOriginal: false };

    if (active_billboard) {
      await Billboard.updateMany(
        { active_billboard: true },
        { $set: { active_billboard: false } },
      );
    }

    const BillboardUpdatedDoc = await Billboard.findOneAndUpdate(
      filter,
      update,
      options,
    );

    const billboardIdToAdd = BillboardUpdatedDoc._id;
    let updateStoreBillboard = null;

    if (active_billboard) {
      updateStoreBillboard = billboardIdToAdd;
    } else {
      const ActiveBillboard = await Billboard.findOne({
        storeId: params.storeId,
        userId: userId,
        active_billboard: true,
      });
      updateStoreBillboard = ActiveBillboard;
    }

    await Store.findByIdAndUpdate(
      params.storeId,
      { $set: { activeBillboard: updateStoreBillboard } },
      { new: true },
    );

    return Response.json({
      BillboardUpdatedDoc: BillboardUpdatedDoc,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return Response.json({ message: err, success: false });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { billboardId: string; storeId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId,
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const BillboardDeletedDoc = await Billboard.deleteOne({
      _id: params.billboardId,
    });
    await Store.updateOne(
      { billboards: params.billboardId },
      { $pull: { billboards: params.billboardId } },
    );

    return Response.json({
      BillboardDeletedDoc: BillboardDeletedDoc,
      success: true,
    });
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { billboardId: string } },
) {
  try {
    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    const BillboardDoc = await Billboard.findOne({ _id: params.billboardId });

    return Response.json({ BillboardDoc: BillboardDoc, success: true });
  } catch (err) {
    console.log(err);
    return Response.json({ message: err, success: false });
  }
}
