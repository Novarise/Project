import { format } from "date-fns";
import { Order } from "@/models/Orders";
import { formatter } from "@/lib/utils";

import { OrderColumn } from "./components/columns"
import { OrderClient } from "./components/client";


const OrdersPage = async ({
  params
}: {
  params: { storeid: string }
}) => {


const orders = await Order.find({ storeId: params.storeid })
    
    .populate({
        path: 'orderItems',
        populate: {
            path: 'productId',
            model: 'Product'
        }
    })
    .sort({ createdAt: 'desc' });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem:any) => `${orderItem.productId.name} (${orderItem.quantity})`).join(', '),
    totalPrice: formatter.format(item.orderItems.reduce((total:any, orderItem:any) => {
      const detailObject = orderItem.productId.detail.find((detail: any) => detail._id.toString() === orderItem.detailId);
      const price = detailObject ? detailObject.price : 0;
      return total + Number(price) * orderItem.quantity;
    }, 0)),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;