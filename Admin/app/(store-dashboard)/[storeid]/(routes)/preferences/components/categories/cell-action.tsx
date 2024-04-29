"use client";

import axios from "axios";
import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useCategoryModal } from "@/hooks/use-category-modal";

import { CategoryColumn } from "./columns";
import { AlertModal } from "@/components/ui/modals/alert-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Billboard, Category } from "@/types";
import { CategoryModal } from "./category-modal";

interface CellActionProps {
  data: CategoryColumn;
  billboards: Billboard[];
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
  billboards

}) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const toastMessage = data ? 'Category updated.' : 'Category created.';

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeid}/categories/${data.id}`);
      toast.success('Category deleted.');
      router.refresh();
    } catch (error) {
      toast.error('Make sure you removed all products using this category first.');
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const onSubmit = async (formData: CategoryFormValues) => {
    try {
      setLoading(true);
      console.log(`/api/${params.storeid}/categories/${data.id}`)
    //   if (initialData) {
        const res = await axios.patch(`/api/${params.storeid}/categories/${data.id}`, formData);
    //   } else {
        // await axios.post(`/api/${params.storeid}/categories`, data);
    //   }
      router.refresh();
    //   router.push(`/${params.storeId}/categories`);
      toast.success(toastMessage);
    } catch (error: any) {
        toast.error('Make sure you removed all products using this category first.');
      } finally {
        setLoading(false);
        setOpenUpdate(false);
      }
  };

  

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Category ID copied to clipboard.');
  }

  const formSchema = z.object({
    name: z.string().min(2),
    billboardId: z.string().min(1),
  });
  
  type CategoryFormValues = z.infer<typeof formSchema>
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:data || {
      name: "",
      billboardId: ""
    }
  });

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <CategoryModal
        isOpen={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onConfirm={onSubmit}
        onDelete={onDelete}
        loading={loading}
        initialData={data as any} billboards={billboards}
        form={form}
        />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onCopy(data.name)}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy Name
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={() => setOpenUpdate(true)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>


          <DropdownMenuItem
            onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};