"use client";

import Image from "next/image";
import { MouseEventHandler } from "react";
import { Expand, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import Currency  from "@/components/ui/currency";
import IconButton  from "@/components/ui/icon-button";
import { Product } from "@/types";
import useCart from "@/hooks/use-cart";
import usePreviewModal from "@/hooks/use-preview-modal";

interface ProductCard {
  data: Product
}

const ProductCard: React.FC<ProductCard> = ({
  data
}) => {
  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${data?._id}`);
  };

  const handlePreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    previewModal.onOpen(data);
  };

  const handleAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    cart.addItem(data);
  };

  return ( 
    <div onClick={handleClick} className="group cursor-pointer rounded-xl border p-3 space-y-4 shadow-xl dark:shadow-lg dark:shadow-gray-900 ">
    {/* <div onClick={handleClick} className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4"> */}
      {/* Image & actions */}
      <div className="aspect-square rounded-xl relative">
      {/* <div className="aspect-square rounded-xl bg-gray-100 relative"> */}
        <Image 
          src={data.images[0] as unknown as string} 
          alt="" 
          fill
          className="aspect-square object-cover rounded-md"
        />
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <IconButton
              className="bg-gray-100" 
              onClick={handlePreview} 
              icon={<Expand size={20} className="text-gray-600" />}
            />
            <IconButton
            className="bg-gray-100"
              onClick={handleAddToCart} 
              icon={<ShoppingCart size={20} className="text-gray-600" />} 
            />
            
          </div>
        </div>
      </div>
      {/* Description */}
      <div>
        <p className="font-semibold text-lg">{data.name}</p>
        <div className="flex items-center">
          <p className="text-sm text-gray-500">{(data.categoryId as any)?.name}</p>
        </div>
      </div>
      {/* Price & Reiew */}
      <div className="flex items-center justify-between">
        <Currency value={data.detail[0].price }/>
      </div>
    </div>
  );
}

export default ProductCard;
