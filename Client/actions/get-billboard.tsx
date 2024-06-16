import { Billboard } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

const getBillboard = async (id: string): Promise<Billboard> => {
  const response = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch billboard with id: ${id}`);
  }
  return response.json();
};

export default getBillboard;
