"use client";

import { useEffect, useState } from 'react';

import Container from '@/components/ui/container';

import Summary from './components/summary'
import CartItem from './components/cart-item';
import useCart from '@/hook/use-cart';

export const revalidate = 0;

interface CartItemData {
  productId: string;
  detailId: string;
  detailSize: string;
  quantity: number,
  price: number,
  in_stock: number
}

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const updateTotal = (itemTotal: number) => {
    if(itemTotal == 0){
      setTotal((prevTotal) => 0);
    }else{
      setTotal((prevTotal) => prevTotal + itemTotal);
    }
  };

  const handleAddCartItem = (newCartItemData: CartItemData) => {
    setCartItems(prevCartItems => {
      const updatedCartItems = prevCartItems.filter(
        item => item.productId !== newCartItemData.productId
      );
      return [...updatedCartItems, newCartItemData];
    });
  };
  

  useEffect(() => {
    setIsMounted(true);

  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <div className="light:bg-white">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold ">Shopping Cart</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && <p className="light:text-neutral-500">No items added to cart.</p>}
              <ul>
                {cart.items.map((item) => (
                  <CartItem key={item._id} data={item} updateTotal={updateTotal} addCartItem={handleAddCartItem} cartItems={cartItems} setCartItems={setCartItems}/>
                ))}
              </ul>
            </div>
            <Summary total={total} cartItems={cartItems}/>
          </div>
        </div>
      </Container>
    </div>
  )
};

export default CartPage;
