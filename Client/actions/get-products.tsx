import { Product } from "@/types";
import qs from "query-string";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface QueryParams {
  categoryId?: string;
  isFeatured?: boolean;
  isArchived?: boolean;
}

const getProducts = async (queryParams: QueryParams): Promise<any> => {
  const url = qs.stringifyUrl({
    url: BASE_URL,
    query: { 
      isFeatured: queryParams.isFeatured,
      isArchived: queryParams.isArchived,
      categoryId: queryParams.categoryId,
    },
  });
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

export default getProducts;
