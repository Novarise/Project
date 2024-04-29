import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Property } from "@/models/Property";
import { Store } from "@/models/Store";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { propertyId: string, storeId: string } }) {
    try {
        const session = await getServerSession(authOptions)

        const userId = session?.user.id

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!params.propertyId) {
            return new NextResponse("Property id is required", { status: 400 });
        }

        const storeByUserId = await Store.findOne({
            _id: params.storeId, userId,
        })
        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }
        const query = { userId: userId, storeId: params.storeId, 'properties.values._id': params.propertyId};
        const PropertyDeletedDoc = await Property.findOneAndUpdate(
            query,
            {
              $pull: {
                'properties.$.values': { _id: params.propertyId }
              }
            },
            { new: true }
          );
       
        return Response.json({ PropertyDeletedDoc: PropertyDeletedDoc, success: true });

    } catch (error) {
        console.log('[PROPERTY_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}