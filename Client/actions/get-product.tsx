import { Product } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch product with id: ${id}`);
  }
  return response.json();
};

export default getProduct;
