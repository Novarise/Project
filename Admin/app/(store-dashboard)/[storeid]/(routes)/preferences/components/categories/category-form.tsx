'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Plus, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertModal } from '@/components/ui/modals/alert-modal';
import { Billboard, Category } from '@/types';
import { CategoryModal } from './category-modal';

const formSchema = z.object({
  name: z.string().min(2),
  billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit category' : 'Create category';
  const description = initialData ? 'Edit a category.' : 'Add a new category';
  const toastMessage = initialData ? 'Category updated.' : 'Category created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: '',
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      //   if (initialData) {
      //     await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
      //   } else {
      await axios.post(`/api/${params.storeid}/categories`, data);
      //   }
      router.refresh();
      window.location.reload();
      //   router.push(`/${params.storeId}/categories`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error(
        'Make sure you removed all products using this category first.',
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`,
      );
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success('Category deleted.');
    } catch (error: any) {
      toast.error(
        'Make sure you removed all products using this category first.',
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <CategoryModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onSubmit}
        onDelete={onDelete}
        loading={loading}
        initialData={null}
        billboards={billboards}
        form={form}
      />
      <div className="flex items-center justify-between">
        <Button
          disabled={loading}
          variant="default"
          size="sm"
          onClick={() => setOpen(true)}
          className="ml-auto"
          type="button"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
    </>
  );
};
