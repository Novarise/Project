"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Billboard } from "@/types/index"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/ui/modals/alert-modal"
import Loading from "../../loading"
import UploadingPage from "../uploading"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
// import { ApiAlert } from "@/components/ui/api-alert"
// import { useOrigin } from "@/hooks/use-origin"

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
  active_billboard: z.boolean().default(false).optional(),
});

type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormProps {
  initialData: Billboard | null;
  onCancel: () => void;
};

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
  onCancel
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState("")

  const title = initialData ? 'Edit billboard' : 'Create billboard';
  const description = initialData ? 'Edit a billboard.' : 'Add a new billboard';
  const toastMessage = initialData ? 'Billboard updated.' : 'Billboard created.';
  const action = initialData ? 'Save changes' : 'Create';


  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
      active_billboard: false,
    }
  });


  useEffect(() => {
    if (initialData) {
      form.setValue('label', initialData.label);
      form.setValue('imageUrl', initialData.imageUrl);
      form.setValue('active_billboard', initialData.active_billboard);
    }
  }, [initialData, form.setValue]);


  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeid}/billboards/${initialData._id}`, data);
      } else {
        await axios.post(`/api/${params.storeid}/billboards`, data);
      }
      router.refresh();
      window.location.reload()
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
      await axios.delete(`/api/${params.storeid}/billboards/${initialData?._id}`);
      router.refresh();
      window.location.reload()
      // router.push(`/${params.storeId}/billboards`);
      toast.success('Billboard deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this billboard first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  const handleCancel = () => {
    onCancel();
    form.reset()
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <UploadingPage
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Billboard label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
          control={form.control}
          name="active_billboard"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Use/Activate billboard on main front page
                </FormLabel>
                <FormDescription>
                  You can manage featuring by clicking the billboards below.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>

          {initialData && (
            <Button variant={"outline"} disabled={loading} className="text-red-500 ml-auto m-3" type="button" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </form>
      </Form>
    </>
  );
};