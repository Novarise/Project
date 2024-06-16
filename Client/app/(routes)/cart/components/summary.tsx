"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Currency from "@/components/ui/currency";
import { toast } from "react-hot-toast";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

interface Props {
  total: number;
  cartItems: {
    productId: string;
    detailId: string;
    detailSize: string;
    quantity: number;
  }[];
}

const Summary: React.FC<Props> = ({ total, cartItems }) => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  useEffect(() => {
    if (searchParams?.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }

    if (searchParams?.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const onCheckout = async () => {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/checkout`;
    const response = await axios.post(`${URL}`, {
      cartItems,
      successUrl: `${process.env.NEXT_CLIENT_URL}/cart?success=1`,
      cancelUrl: `${process.env.NEXT_CLIENT_URL}/cart?canceled=1`,
    });
    window.location = response.data.url;
    // axios.get(`${URL}?sessionId=${response.data.sessionId}`).then(response => {
    //   console.log(response)
    // });
  };

  return (
    <div className="mt-16 rounded-lg border px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium ">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-base font-medium ">Order total</div>
          <Currency value={total} />
        </div>
      </div>

      <Button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
