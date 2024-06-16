'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Category, Product, Image } from '@/types';
import { AlertModal } from '@/components/ui/modals/alert-modal';
import UploadingProductPage from './uploading';

interface ProductFormProps {
  initialData: any;
  categories: Category[];
  properties: any;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  properties,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit product' : 'Create product';
  const description = initialData ? 'Edit a product.' : 'Add a new product';
  const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? 'Save changes' : 'Create';
  const formSchema = z.object({
    name: z.string().min(1),
    images: z
      .array(
        z.object({
          url: z.array(z.string()),
        }),
      )
      .length(1),

    price: z.coerce.number().min(1),
    in_stock: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
    ...properties?.properties.reduce((acc: any, property: any) => {
      acc[property.label] = z.string().min(1);
      return acc;
    }, {}),
  });

  type ProductFormValues = z.infer<typeof formSchema>;

  const dynamicProperties = properties?.properties.map(
    (property: any) => property.label,
  );

  const defaultValues = initialData
    ? {
        ...initialData[0],
      }
    : {
        name: '',
        images: [],
        price: 0,
        in_stock: 0,
        categoryId: '',
        isFeatured: false,
        isArchived: false,
      };

  if (initialData) {
    defaultValues.price = parseFloat(String(initialData[0]?.detail[0]?.price));
    defaultValues.in_stock = parseInt(
      String(initialData[0]?.detail[0]?.in_stock),
    );
    defaultValues.images = [{ url: initialData[0].images || [] }];
  }
  const modifiedDefaultValues = {
    ...defaultValues,
    ...dynamicProperties?.reduce((acc: any, propName: any) => {
      acc[propName] =
        (initialData &&
          initialData[0].detail[0]?.dynamicProperties[propName]) ||
        '';
      return acc;
    }, {}),
  };
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: modifiedDefaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData && initialData[0].detail.length == 0) {
        await axios.patch(
          `/api/${params.storeid}/products/${params.productId}`,
          data,
        );
      } else if (initialData) {
        await axios.patch(
          `/api/${params.storeid}/products/${params.productId}`,
          data,
        );
      } else {
        await axios.post(`/api/${params.storeid}/products`, data);
      }
      router.refresh();
      router.push(`/${params.storeid}/products`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeid}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeid}/products`);
      toast.success('Product deleted.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <UploadingProductPage
                    value={(field.value[0]?.url as any)?.map(
                      (image: string) => image,
                    )}
                    onChange={(url: any) => {
                      if (field.value.length > 0) {
                        field.onChange([{ url }]);
                      } else {
                        field.onChange([...field.value, { url }]);
                      }
                    }}
                    onRemove={(url) => {
                      const currImages = [...field.value][0].url as any;
                      const updatedImages = currImages.filter(
                        (item: any) => item !== url,
                      );
                      field.onChange([{ url: updatedImages }]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="in_stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>In Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category._id}
                          value={category._id as string}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {properties?.properties.map((property: any) => (
              <div key={property._id}>
                <FormField
                  control={form.control}
                  name={property.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{property.label}</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder={`Select a ${property.label}`}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {property.values.map((value: any) => (
                            // <SelectItem key={value._id} value={value._id as string}>{`${value.name} - ${value.value}`}</SelectItem>
                            <SelectItem
                              key={value._id}
                              value={
                                value.value !== 'NA'
                                  ? `${value.value} ${value.name}`
                                  : value.name
                              }
                            >
                              {value.value !== 'NA'
                                ? `${value.value} ${value.name}`
                                : value.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
