import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Products';
import { Store } from '@/models/Store';
import {
  createStripeCheckoutSession,
  getStripeCheckoutSession,
} from '@/services/stripeService';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import { Order, OrderItem } from '@/models/Orders';

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }
interface CartItem {
  quantity: number;
  price: number;
  name: string;
}
export async function POST(
  request: Request,
  { params }: { params: { storeId: string } },
) {
  await mongooseConnect();
  const session = await getServerSession(authOptions);
  // const userId = session?.user.id;

  const body = await request.json();
  let data: CartItem[] = [];

  for (let item of body.cartItems) {
    const { productId, detailId, quantity } = item;
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    const detail = product.detail.find(
      (d: any) => d._id.toString() === detailId,
    );

    if (!detail) {
      throw new Error('Detail not found');
    }

    const result: CartItem = {
      name: product.name,
      price: detail.price,
      quantity: quantity,
    };
    data.push(result);
  }

  let order = new Order({
    storeId: params.storeId,
    isPaid: false,
  });

  await order.save();

  const orderItems = await Promise.all(
    body.cartItems.map(
      async (productData: {
        productId: string;
        detailId: string;
        quantity: number;
      }) => {
        const product = await Product.findById(productData.productId);
        if (!product) {
          throw new Error(
            `Product with ID ${productData.productId} not found.`,
          );
        }
        const orderItem = new OrderItem({
          orderId: order._id,
          productId: productData.productId,
          detailId: productData.detailId,
          quantity: productData.quantity,
        });
        await orderItem.save();
        return orderItem;
      },
    ),
  );

  order.orderItems = orderItems;
  await order.save();

  let { cartItems, successUrl, cancelUrl } = body;
  // Call the Stripe service function with the request body data
  //TODO: change this to be make sure it comes from body
  successUrl = 'http://kappaespresso.com/cart?success=1';
  cancelUrl = 'http://kappaespresso.com/cart?canceled=1';
  const stripeSession = await createStripeCheckoutSession({
    cartItems: data,
    successUrl,
    cancelUrl,
    orderId: order._id,
  });

  // if (!userId) {
  //   return new NextResponse("Unauthenticated", { status: 403 });
  // }

  // const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  // let products = body.cartItems
  // products.forEach((product:any) => {
  //   line_items.push({
  //     quantity: product.quantity,
  //     price_data: {
  //       currency: 'USD',
  //       product_data: {
  //         name: product.detailId,
  //       },
  //       unit_amount: product.price * 100
  //     }
  //   });
  // });

  // const sessionStripe = await stripe.checkout.sessions.create({
  //   line_items,
  //   mode: 'payment',
  //   billing_address_collection: 'required',
  //   phone_number_collection: {
  //     enabled: true,
  //   },
  //   success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
  //   cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
  //   metadata: {
  //     orderId:"4565"
  //   },
  // });

  // if (!price) {
  //   return new NextResponse("Price is required", { status: 400 });
  // }

  // if (!in_stock) {
  //   return new NextResponse("In Stock quantity is required", { status: 400 });
  // }

  // if (!params.storeId) {
  //   return new NextResponse("Store id is required", { status: 400 });
  // }

  // const storeByUserId = await Store.findOne({
  //   _id: params.storeId, userId,
  // })

  // if (!storeByUserId) {
  //   return new NextResponse("Unauthorized", { status: 405 });
  // }

  try {
    return Response.json({
      BillboardData: body,
      url: stripeSession.url,
      success: true,
      sessionId: stripeSession.id,
    });
  } catch (err) {
    console.log(err);
    return Response.json({ message: err, success: false });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    const stripeSession = await getStripeCheckoutSession(sessionId as string);

    return Response.json({
      BillboardData: {},
      url: stripeSession.url,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return Response.json({ message: err, success: false });
  }
}
