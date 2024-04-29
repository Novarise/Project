export interface UserTypes {
    _id?: string;
    email: string;
    name: string;
}

export interface Billboard {
    _id?: string;
    label: string;
    imageUrl: string;
    storeId: string
    store: Store
    categories:Category[]
    active_billboard: boolean
   
}

export interface Store {
    _id?: string;
    name: string;
    userId: string;
}

export interface Category{
    _id?: string;
    name: string;
    storeId: string;
    store: Store;
    billboardId: string;
    // billboard: Billboard
    // products: Products[]

}


export interface Product {
    _id?: string | undefined;
    storeId: string;
    // store: Store;
    categoryId: string   
    // category: Category  
    name: string
    price: number
    in_stock: number,
    isFeatured: boolean  
    isArchived: boolean   
    images: Image[]
  }


  export interface Image {
    _id?: string;
    productId: string 
    product: Product  
    url: string
  
  }

  export interface Order {
    storeId: string;
    store: string;
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