import { Product } from "@/types";
import qs from "query-string";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  categoryId?: string;
  isFeatured?: boolean;
  isArchived?: boolean;
}

const getProducts = async (query: Query): Promise<any> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: { 
      isFeatured: query.isFeatured,
      isArchived: query.isArchived,
      categoryId: query.categoryId,
    },
  });
  const res = await fetch(url, {cache: "no-store"});

  return res.json();
};

export default getProducts;
