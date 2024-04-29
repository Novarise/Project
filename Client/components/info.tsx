"use client";

import { ShoppingCart } from "lucide-react";

import Currency from "@/components/ui/currency";
import { Product } from "@/types";
import useCart from "@/hook/use-cart";
import { Button } from "./ui/button";

interface InfoProps {
  data: Product
};

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();

  const onAddToCart = () => {
    cart.addItem(data);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold ">{data.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-2xl ">
          <Currency value={data.detail[0].price} />
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        {
          Object.keys(data.detail[0].dynamicProperties).map((key) => (
            key !== '_id' && (
            <div key={key} className="flex items-center gap-x-4">
              <h3 className="font-semibold ">{key}:</h3>
              <div>
                {data.detail[0].dynamicProperties.Size}
              </div>
            </div>
            )
          ))
        }

        {/* <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Color:</h3>
          <div className="h-6 w-6 rounded-full border border-gray-600" style={{ backgroundColor: "blue"}} />
        </div> */}
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button onClick={onAddToCart} className="flex items-center gap-x-2">
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
}

export default Info;
