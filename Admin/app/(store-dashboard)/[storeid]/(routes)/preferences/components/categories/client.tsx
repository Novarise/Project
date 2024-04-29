"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
// import { ApiAlert } from "@/components/ui/api-alert";

import { columns, CategoryColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { CategoryForm } from "./category-form";
import { Billboard, Category } from "@/types";
// import { ApiList } from "@/components/ui/api-list";

interface CategoriesClientProps {
  data: CategoryColumn[];
  initialData: Category | null;
  billboards: Billboard[];
}

export const CategoriesClient: React.FC<CategoriesClientProps> = ({
  data,
  initialData,
  billboards
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Categories (${data.length})`} description="Manage categories for your store" />
       
        <CategoryForm initialData={JSON.parse(JSON.stringify(initialData))} 
                      billboards={JSON.parse(JSON.stringify(billboards))}/>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* <Heading title="API" description="API Calls for Categories" /> */}
      {/* <Separator /> */}
      {/* <ApiList entityName="categories" entityIdName="categoryId" /> */}
    </>
  );
};