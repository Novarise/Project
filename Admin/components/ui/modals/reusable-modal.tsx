"use client";

import { Billboard, Category } from "@/types";
import { useEffect, useState } from "react";
import { Modal } from "../modal";
import { AlertModal } from "./alert-modal";
import { Separator } from "../separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../form";
import { Input } from "../input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { Button } from "../button";
import { Trash2 } from "lucide-react";



interface ReusableModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
    onDelete: () => void;
    loading: boolean;
    initialData: Category | null;
    billboards: Billboard[];
    form: any
    formOptions:{title:string,description:string,toastMessage:string, action:any}
}
interface FormData {
    name: string;
    username: string
}

export const ReusableModal: React.FC<ReusableModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    onDelete,
    loading,
    initialData,
    billboards,
    form,
    formOptions
}) => {
    const [isMounted, setIsMounted] = useState(false);
    // const title = initialData ? 'Edit category' : 'Create category';
    // const description = initialData ? 'Edit a category.' : 'Add a new category';
    // const toastMessage = initialData ? 'Category updated.' : 'Category created.';
    // const action = initialData ? 'Save changes' : 'Create';

    const [open, setOpen] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    return (
        <Modal
            title={formOptions.title}
            description={formOptions.description}
            isOpen={isOpen}
            onClose={onClose}
        >
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />

            <Separator />
            <div className="w-full pt-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onConfirm)} className="space-y-8" id="myForm">
                        <div className="md:grid md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Category name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="billboardId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Billboard</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {billboards.map((billboard) => (
                                                    <SelectItem key={billboard._id} value={billboard._id as string}>{billboard.label}</SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                    </form>
                    <div className="mt-2 flex items-center justify-between">
                        <Button
                            disabled={loading}
                            type="submit"
                            form="myForm" // Use the ID of your form here
                        >
                            {formOptions.action}
                        </Button>

                        {initialData && (
                            <Button
                                disabled={loading}
                                variant="destructive"
                                size="default"
                                onClick={() => setOpen(isOpen)}
                                className="align-middle"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        )}
                    </div>
                </Form>
            </div>
        </Modal>
    );
};