import { mongooseConnect } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { NextResponse } from 'next/server';
import { Store } from '@/models/Store';
import { Property } from '@/models/Property';

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    await mongooseConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    const { label, name, value } = await request.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }
    if (!label || !name || !value) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId,
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const newPropertyData = {
      label: label,
      values: [
        {
          value: value,
          name: name,
        },
      ],
    };

    const PropertyDoc = await Property.findOne({
      userId,
      storeId: params.storeId,
    }).then((result) => {
      if (!result) {
        return Property.create({
          userId,
          storeId: params.storeId,
          properties: [newPropertyData],
        });
      } else {
        const existingLabel = result.properties.find(
          (property: any) => property.label === newPropertyData.label,
        );

        if (existingLabel) {
          existingLabel.values.push(...newPropertyData.values);
        } else {
          result.properties.push(newPropertyData);
        }

        return result.save();
      }
    });
    const propertyIdToAdd = PropertyDoc._id;

    await Store.findByIdAndUpdate(
      params.storeId,
      { $set: { properties: propertyIdToAdd } },
      { new: true },
    );

    return Response.json({ success: true, Property: PropertyDoc });
  } catch (err) {
    console.log(err);
    return Response.json({ message: err, success: false });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } },
) {
  const session = await getServerSession(authOptions);
  await mongooseConnect();
  try {
    const userId = session?.user.id;
    // if (!userId) {
    //     return new NextResponse("Unauthorized", { status: 403 });
    // }

    const PropertyDoc = await Property.findOne({
      userId: userId,
      storeId: params.storeId,
    });

    return Response.json({ PropertyDoc: PropertyDoc, success: true });
  } catch (err) {
    console.log(err);
    return Response.json({ message: err, success: false });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }
    const url = new URL(request.url);
    const propertyID = url.searchParams.get('propertyID');
    if (!propertyID) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId,
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }
    const query = {
      userId: userId,
      storeId: params.storeId,
      'properties._id': propertyID,
    };

    const PropertyDeletedDoc = await Property.findOneAndUpdate(
      query,
      {
        $pull: {
          properties: { _id: propertyID },
        },
      },
      { new: true },
    );
    // if (PropertyDeletedDoc.properties.length === 0) {
    //     await Store.updateOne(
    //         { _id: params.storeId },
    //         { $unset: { properties: 1 } },
    //     );
    // }

    return Response.json({
      PropertyDeletedDoc: PropertyDeletedDoc,
      success: true,
    });
  } catch (error) {
    console.log('[PROPERTY_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
