import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Product } from "@/models/Products";
import { Store } from "@/models/Store";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { productId: string, storeId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const [product_id, index, flag] = params.productId.split('_')

        const userId = session?.user.id

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!product_id) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        const storeByUserId = await Store.findOne({
            _id: params.storeId, userId,
        })
        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        
        const filter = { _id: product_id };
        const ProductDoc = await Product.findOne(filter);
        if (ProductDoc.detail.length == 1){
          const ProductDeletedDoc = await Product.deleteOne({ _id: product_id })
          return Response.json({ ProductDeletedDoc: ProductDeletedDoc, success: true });
        }else{
          ProductDoc.detail.splice(index, 1);
          const update = {
            $set: { "detail": ProductDoc.detail } 
          }
          const ProductDeletedDetailDoc = await Product.updateOne(filter, update);
          return Response.json({ ProductDeletedDoc: ProductDeletedDetailDoc, success: true });
        }
        
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { productId: string, storeId: string } }) {
    await mongooseConnect();
    try {
        const session = await getServerSession(authOptions)

        const { name, price, in_stock, categoryId, images, isFeatured, isArchived,  ...dynamicProperties } = await request.json();
        const userId = session?.user.id
        const [product_id, index, flag] = params.productId.split('_');

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
          }
      
          if (!product_id) {
            return new NextResponse("Product id is required", { status: 400 });
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
      

        const storeByUserId = await Store.findOne({
            _id: params.storeId, userId,
        })
        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }
        const filter = { _id: product_id, userId: userId };
        if (flag){
          const update = {
            $set: {
              name,
              isFeatured,
              isArchived,
              categoryId,
              storeId: params.storeId,
              images: images[0].url,
            },
            $push: {
              detail: {
                $each: [{ price, in_stock, dynamicProperties }],
              },
            },
          };
          
          const options = { returnOriginal: false };
          const ProductUpdatedDoc = await Product.findByIdAndUpdate(filter, update, options)

          return Response.json({ ProductUpdatedDoc: ProductUpdatedDoc, success: true });
        }else{
          const update = {
            $set: {
              name,
              isFeatured,
              isArchived,
              categoryId,
              storeId: params.storeId,
              images: images[0].url,
              [`detail.${index}.price`]: price,
              [`detail.${index}.in_stock`]: in_stock,
              [`detail.${index}.dynamicProperties`]: dynamicProperties,
            },
          };

          const options = {
            returnOriginal: false,
          };
          const ProductUpdatedDoc = await Product.findByIdAndUpdate(filter, update, options)

          return Response.json({ ProductUpdatedDoc: ProductUpdatedDoc, success: true });
        }
    } catch (err) {
        console.log(err);
        return Response.json({ message: err, success: false });
    }
}

export async function GET(request: Request, { params }: { params: { productId: string } }) {
    try{

        if (!params.productId) {
            return new NextResponse("Product id is required", { status: 400 });
          }

          const ProductDoc =  await Product.find({_id: params.productId})
            .populate({
              path: 'categoryId',
              model: 'Category',
            })
            .populate({
                path: 'storeId',
                model: 'Store',
              })

            return Response.json({ ProductDoc: ProductDoc, success: true });
        } catch (err) {
            console.log(err);
            return Response.json({ message: err, success: false });
        }

}