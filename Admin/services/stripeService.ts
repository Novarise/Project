import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

interface CartItem {
  quantity: number;
  price: number;
  name: string;
}

interface CreateCheckoutSessionData {
  cartItems: CartItem[];
  successUrl: string;
  cancelUrl: string;
  orderId: string;
}

export async function createStripeCheckoutSession(
  data: CreateCheckoutSessionData,
) {
  const { cartItems, successUrl, cancelUrl } = data;

  const lineItems = cartItems.map((item: CartItem) => ({
    price_data: {
      currency: 'USD',
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  // Create the Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      orderId: data.orderId,
    },
  });

  return session;
}

export async function getStripeCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status === 'paid') {
    session.metadata = { ...session.metadata, message: 'Payment successful' };
  } else {
    session.metadata = { ...session.metadata, message: 'Payment failed' };
  }
  return session;
}
