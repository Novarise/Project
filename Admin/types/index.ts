export interface User {
  _id?: string;
  email: string;
  name: string;
}

export interface Billboard {
  _id?: string;
  label: string;
  imageUrl: string;
  storeId: string;
  store: Store;
  categories: Category[];
  activeBillboard: boolean; // Use camelCase for consistency
}

export interface Store {
  _id?: string;
  name: string;
  userId: string;
}

export interface Category {
  _id?: string;
  name: string;
  storeId: string;
  store: Store;
  billboardId: string;
  // billboard: Billboard;
  // products: Product[];
}

export interface Product {
  _id?: string;
  storeId: string;
  // store: Store;
  categoryId: string;
  // category: Category;
  name: string;
  price: number;
  inStock: number; // Use camelCase for consistency
  isFeatured: boolean;
  isArchived: boolean;
  images: Image[];
}

export interface Image {
  _id?: string;
  productId: string;
  product: Product;
  url: string;
}

export interface Order {
  storeId: string;
  store: string; // Consider renaming to storeName for clarity
  orderItems: Product[];
  isPaid: boolean;
  phone: string;
  address: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
}
