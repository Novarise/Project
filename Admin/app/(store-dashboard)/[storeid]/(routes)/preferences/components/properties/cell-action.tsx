'use client';

import axios from 'axios';
import { useState } from 'react';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCategoryModal } from '@/hooks/use-category-modal';

import { PropertyColumn } from './columns';
import { AlertModal } from '@/components/ui/modals/alert-modal';
// import { ReusableModal } from "@/app/(store-dashboard)/[storeid]/(routes)/preferences/components/categories/reusable-modal";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Billboard, Category } from '@/types';
import { ReusableModal } from '@/components/ui/modals/reusable-modal';
import { PropertyModal } from '@/components/ui/modals/property-modal';

interface CellActionProps {
  data: PropertyColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const formOptions = {
    title: data ? 'Edit property' : 'Create property',
    description: data ? 'Edit a property.' : 'Add a new property',
    toastMessage: data ? 'Property updated.' : 'Property created.',
    action: data ? 'Save changes' : 'Create',
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeid}/properties/${data.id}`);
      toast.success('Property deleted.');
      router.refresh();
    } catch (error) {
      toast.error(
        'Make sure you removed all products using this property first.',
      );
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const onSubmit = async (formData: PropertyFormValues) => {
    try {
      setLoading(true);
      console.log(`/api/${params.storeid}/categories/${data.id}`);
      const res = await axios.patch(
        `/api/${params.storeid}/categories/${data.id}`,
        formData,
      );
      // await axios.post(`/api/${params.storeid}/properties`, formattedData);
      router.refresh();
      toast.success(formOptions.toastMessage);
    } catch (error: any) {
      toast.error(
        'Make sure you removed all products using this category first.',
      );
    } finally {
      setLoading(false);
      setOpenUpdate(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Category ID copied to clipboard.');
  };

  const formSchema = z.object({
    name: z.string().min(2),
    values: z.array(z.object({})),
  });

  type PropertyFormValues = z.infer<typeof formSchema>;

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      label: '',
      values: [{ name: '', value: '' }],
    },
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <PropertyModal
        isOpen={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onConfirm={onSubmit}
        onDelete={onDelete}
        loading={loading}
        initialData={[]}
        billboards={[]}
        form={form}
        formOptions={formOptions}
      />
      {/* <ReusableModal
        isOpen={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onConfirm={onSubmit}
        onDelete={onDelete}
        loading={loading}
        initialData={data as any} 
        form={form}
        formOptions={formOptions}
        /> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.name)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Name
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
