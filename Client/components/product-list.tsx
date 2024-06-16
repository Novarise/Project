"use client";
import ProductCard from "@/components/ui/product-card";
import { Product } from "@/types";
import { useEffect, useState } from "react";
import NoResults from "@/components/ui/no-results";
import { Search } from "@/app/(routes)/products/components/search";
import SortBy from "@/app/(routes)/products/components/sort-by";
import { Separator } from "./ui/separator";

interface ProductListProps {
  title: string;
  items: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(items);
  const [sortedProducts, setSortedProducts] = useState(items);
  const sortOptions = [
    { label: "Featured", value: "feature" },
    // { label: "Best Selling", value: "best_selling" },
    { label: "Alphabetically: A-Z", value: "alphabetical_asc" },
    { label: "Alphabetically: Z-A", value: "alphabetical_desc" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Date: New to Old", value: "date_desc" },
    { label: "Date: Old to New", value: "date_asc" },
  ];

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const onSortChange = (option: string) => {
    let sorted = [...filteredProducts];

    if (option === "price_asc") {
      sorted.sort((a, b) => a.detail[0].price - b.detail[0].price);
    } else if (option === "price_desc") {
      sorted.sort((a, b) => b.detail[0].price - a.detail[0].price);
    } else if (option === "feature") {
      sorted = sorted.filter((product) => product.isFeatured);
    } else if (option === "date_asc") {
      sorted.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      );
    } else if (option === "date_desc") {
      sorted.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    } else if (option === "alphabetical_asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "alphabetical_desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    // else if (option === 'best_selling') {
    //   sorted.sort((a, b) => {
    //     const aDays = (new Date().getTime() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    //     const bDays = (new Date().getTime() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    //     const aRate = a.salesCount / aDays;
    //     const bRate = b.salesCount / bDays;
    //     return bRate - aRate;
    //   });
    // }
    setSortedProducts(sorted);
  };

  useEffect(() => {
    if (title === "Featured Products") {
      onSortChange("feature");
    } else {
      if (searchTerm) {
        const result = items.filter((product: any) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setSortedProducts(result);
      } else {
        setSortedProducts(items);
      }
    }
  }, [searchTerm, items]);

  return (
    <div className="space-y-4">
      {/* <Search products={items} onChange={handleSearch} /> */}
      {/* {
        filteredProducts.length == 0 && (
          <>
          <h3 className="font-bold text-3xl">{title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <ProductCard key={item._id} data={item} />
            ))}
          </div>
          </>
        )
      } */}

      {title !== "Featured Products" && sortedProducts.length > 0 && (
        <div className="grid grid-cols-6 gap-4">
          <h3 className="font-bold text-3xl">{title}</h3>
          <div></div>
          <div></div>
          <div></div>
          <SortBy options={sortOptions} onSortChange={onSortChange} />
          <Search products={items} onChange={handleSearch} />
        </div>
      )}

      {title === "Featured Products" && sortedProducts.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <h3 className="font-bold text-3xl">{title}</h3>
          </div>
          <Separator />
        </>
      )}

      {sortedProducts.length === 0 && title !== "Featured Products" && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <SortBy options={sortOptions} onSortChange={onSortChange} />
            <Search products={items} onChange={handleSearch} />
          </div>
          <NoResults />
        </>
      )}

      {sortedProducts.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProducts.map((item) => (
              <ProductCard key={item._id} data={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
