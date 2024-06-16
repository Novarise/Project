import { Product } from '@/models/Products';
import { format } from 'date-fns';

import { formatter } from '@/lib/utils';
import { ProductsClient } from './components/client';
import { ProductColumn } from './components/columns';
import { Property } from '@/models/Property';
import { Category } from '@/models/Category';
const ProductsPage = async ({ params }: { params: { storeid: string } }) => {
  const products = await Product.find({ storeId: params.storeid }).populate({
    path: 'categoryId',
    model: Category,
  });

  const formattedProducts: ProductColumn[] = [];

  products.forEach((item) => {
    if (Array.isArray(item.detail)) {
      item.detail.forEach((detail, index) => {
        formattedProducts.push({
          id: `${item._id}_${index}`,
          name: item.name,
          isFeatured: item.isFeatured,
          isArchived: item.isArchived,
          price: formatter.format(detail?.price),
          category: item.categoryId?.name,
          detail: detail,
          createdAt: format(item.createdAt, 'MMMM do, yyyy'),
          size: detail?.dynamicProperties.Size,
        });
      });
    } else {
      formattedProducts.push({
        id: item._id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price),
        category: item.categoryId?.name,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
        detail: {},
        size: '',
      });
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={JSON.parse(JSON.stringify(formattedProducts))} />
      </div>
    </div>
  );
};

export default ProductsPage;
