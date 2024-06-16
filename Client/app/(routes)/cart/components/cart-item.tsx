import Image from "next/image";
import { toast } from "react-hot-toast";
import { X, Plus, Minus } from "lucide-react";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import { Product } from "@/types";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface CartItemProps {
  data: any;
  updateTotal: (value: number) => void;
  addCartItem: (cartItemData: any) => void;
  cartItems: any[];
  setCartItems: any
}

interface CartItemData {
  productId: string;
  detailId: string;
  detailSize: string;
  quantity: number;
  price: number;
  in_stock: number;
}


const CartItem: React.FC<CartItemProps> = ({
  data,
  updateTotal,
  addCartItem,
  cartItems,
  setCartItems
}) => {
  const cart = useCart();
  const [quantity, setQuantity] = useState(0);
  const [currentDetail, setCurrentDetail] = useState(data.detail[0]);
  const [cartItemData, setCartItemData] = useState<CartItemData>({
    productId: data._id,
    detailId: data.detail[0]._id,
    detailSize: data.detail[0].dynamicProperties.Size,
    price: data.detail[0].price,
    in_stock: data.detail[0].in_stock,
    quantity: 1,
  });

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    const newQuantity = quantity + 1;
    const newItemTotal = currentDetail.price * newQuantity;
    const prevItemTotal = currentDetail.price * quantity;
    const totalDiff = newItemTotal - prevItemTotal;
    updateTotal(totalDiff);
    
    if (cartItemData) {

      setCartItemData({
          productId: data._id,
          detailId: currentDetail._id,
          detailSize: currentDetail.dynamicProperties.Size,
          quantity: newQuantity,
          price: currentDetail.price,
          in_stock: data.detail[0].in_stock,
  });
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      const newQuantity = quantity - 1;
      const newItemTotal = currentDetail.price * newQuantity;
      const prevItemTotal = currentDetail.price * quantity;
      const totalDiff = newItemTotal - prevItemTotal;
      updateTotal(totalDiff);
      
      if (cartItemData) {
        setCartItemData({
          productId: data._id,
          detailId: currentDetail._id,
          detailSize: currentDetail.dynamicProperties.Size,
          quantity: newQuantity,
          price: currentDetail.price,
          in_stock: data.detail[0].in_stock,
  });
      }
    }
  };

  const onRemove = () => {
    const currentItemTotal = currentDetail.price * quantity;
    updateTotal(-currentItemTotal);
    cart.removeItem(data._id);
    const updatedCartItems = cartItems.filter(
      (item:any) => item.productId !== data._id
      );
      setCartItems([...updatedCartItems]);
  };
  
  const handleSelectChange = (value: string) => {
      const selectedDetail = data.detail.find(
        (detail: any) => detail.dynamicProperties.Size === value
      );

      if (selectedDetail) {
        setCurrentDetail(selectedDetail);
        setQuantity(0);
        const currentItemTotal = currentDetail.price * quantity;
        updateTotal(-currentItemTotal);

        const updatedCartItems = cartItems.filter(
          (item:any) => item.productId !== data._id
          );
    
        const newCartItemData = {
          productId: data._id,
          detailId: selectedDetail._id,
          detailSize: selectedDetail.dynamicProperties.Size,
          quantity: 1,
          price: selectedDetail.price,
          in_stock: selectedDetail.in_stock,
        };
        setCartItems([...updatedCartItems, newCartItemData]);
      } else {
        console.error('No detail found for selected size');
      }
    };

    useEffect(() => {
      if (cartItemData) {
        addCartItem(cartItemData);
      }
    }, [quantity]);


  return (
    <ul className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          fill
          src={data.images[0]}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div><br/>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className=" text-lg font-semibold ">
              {data.name}
            </p>
          </div>

          <div className="mt-1 flex-col text-sm">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Size</Label>
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder={currentDetail.dynamicProperties.Size} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {data.detail.map((detail:any, index:any) => (
                      <SelectItem key={index} value={detail.dynamicProperties.Size} >
                        {detail.dynamicProperties.Size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
             
          </div>
          <Currency value={currentDetail.price} />

          <li className="flex py-6 items-center">
            <Button
              variant="outline"
              onClick={handleDecrement}
              className="px-2 py-1 light:bg-gray-200 rounded-md"
              disabled={quantity <= 1}
              size="icon"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min={1}
              max={currentDetail.in_stock}
              value={quantity}
              readOnly
              className=" text-center mx-2"
            />
            <Button
              variant="outline"
              onClick={handleIncrement}
              className="px-2 py-1 light:bg-gray-200 rounded-md"
              disabled={quantity >= currentDetail.in_stock}
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </li>
        </div>
      </div>
    </ul>
  );
}

export default CartItem;
