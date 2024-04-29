"use client"

import * as z from "zod"
import axios from "axios"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Plus, Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"


import { Billboard, Category } from "@/types"
import { ReusableModal } from "@/components/ui/modals/reusable-modal"
import { PropertyModal } from "@/components/ui/modals/property-modal"

const formSchema = z.object({
    label: z.string().min(2),
    name: z.string().min(2),
    value: z.string().min(2)
});

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
    initialData: Category | null;
};

export const ModalAction: React.FC<CategoryFormProps> = ({
    initialData,
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [Property, setProperty] = useState(null);
    const [loading, setLoading] = useState(false);

    const formOptions = {
        title: initialData ? 'Edit property' : 'Create property',
        description: initialData ? 'Edit a property.' : 'Add a new property',
        toastMessage: initialData ? 'Property updated.' : 'Property created.',
        action: initialData ? 'Save changes' : 'Create'
    }

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
            label: ''
        }
    });

    useEffect(() => {
        axios.get(`/api/${params.storeid}/properties`).
            then((res) => {
                setProperty(res.data?.PropertyDoc?.properties)
            })
    })
    // console.log(Property)
    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);
            const formattedData = {
                name: data.name,
                value: data.value,
                label: data.label
            }
            await axios.post(`/api/${params.storeid}/properties`, formattedData);
            router.refresh();
            //   window.location.reload()
            toast.success(formOptions.toastMessage);
        } catch (error: any) {
            toast.error('Make sure you removed all products using this category first.');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success('Category deleted.');
        } catch (error: any) {
            toast.error('Make sure you removed all products using this category first.');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }


    return (
        <>
            <PropertyModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onSubmit}
                onDelete={onDelete}
                loading={loading}
                initialData={Property || []} billboards={[]}
                form={form}
                formOptions={formOptions}
            />
            <div className="flex items-center justify-between gap-2">

                {/* <Button disabled={loading}
                    variant="default"
                    size="sm"
                    onClick={() => setOpen(true)} className="ml-auto" type="button">
                    <Plus className="mr-2 h-4 w-4" /> Add New
                </Button> */}

                <Button disabled={loading}
                    variant="default"
                    size="sm"
                    onClick={() => setOpen(true)} className="ml-auto" type="button">
                    <Plus className="mr-2 h-4 w-4" /> Add Property
                </Button>
            </div>
        </>
    );
};
