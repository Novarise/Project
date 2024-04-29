
import { Category } from "@/models/Category";
import { ProductForm } from "./components/product-form";
import { Product } from "@/models/Products";
import axios from "axios";
import { Property } from "@/models/Property";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const ProductPage = async ({
  params
}: {
  params: { productId: string, storeid: string }
}) => {
  
  const session = await getServerSession(authOptions)
  let product_id = params.productId.split('_')
  const product = params.productId === "new" ? null : await Product.find({_id: product_id[0]})
  if (product) {
    if (product_id.length == 2) {
      const [desiredObject] = product[0].detail.slice(product_id[1], product_id[1] + 1);
      product[0].detail = desiredObject
    } else {
      product[0].detail = [{
        price: 0,
        in_stock: 0,
        dynamicProperties: {
          Size: ""
        },
      }]
    }
  }

  const categories = await Category.find({storeId: params.storeid})
  const properties = await Property.findOne({ userId: session?.user.id, storeId: params.storeid })

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={JSON.parse(JSON.stringify(categories))} 
          properties={JSON.parse(JSON.stringify(properties)) }
          initialData={JSON.parse(JSON.stringify(product))} 
        />
      </div>
    </div>
  );
}

export default ProductPage;
