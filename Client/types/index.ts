interface DynamicProperties {
  [key: string]: string;
}

export interface Product {
    _id?: string | undefined;
    storeId: string;
    categoryId: string   
    name: string
    price: number
    isFeatured: boolean  
    isArchived: boolean   
    images: Image[]
    dynamicProperties: DynamicProperties
    detail:[{price:0, dynamicProperties:{Size:""}}]
    updatedAt: string
  }

  export interface Image {
    _id?: string;
    productId: string 
    product: Product  
    url: string
  }

  export interface Billboard {
    _id?: string;
    label: string;
    imageUrl: string;
    storeId: string
    store: Store
    categories:Category[]
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
}