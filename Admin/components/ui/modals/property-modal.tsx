"use client";

import { Billboard, Category } from "@/types";
import { useEffect, useState } from "react";
import { Modal } from "../modal";
import { AlertModal } from "./alert-modal";
import { Separator } from "../separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../form";
import { Input } from "../input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select";
import { Button } from "../button";
import { Trash2 } from "lucide-react";



interface PropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
    onDelete: () => void;
    loading: boolean;
    initialData: any;
    billboards: Billboard[];
    form: any
    formOptions: { title: string, description: string, toastMessage: string, action: any }
}
interface FormData {
    name: string;
    value: string[];
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
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
                <div>

                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onConfirm)} className="space-y-8" id="myForm">
                        <div className="md:grid md:grid-cols-3 gap-8">
                            <FormField
                                control={form.control}
                                name="label"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Label</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Input list="browsers" disabled={loading} placeholder="" {...field} />
                                                <datalist id="browsers">
                                                    {initialData.map((item: any) => (
                                                        <option key={item.label} value={item.label} />
                                                    ))}
                                                </datalist>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                // control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Value</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="" {...field} />

                                            {/* {formData.value.map((value, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    name="value"
                                                    value={value}
                                                    onChange={(event) => handleChange(event, index)}
                                                />
                                            ))} */}
                                            {/* <button type="button" onClick={addValueInput}>
                                                Add Value
                                            </button> */}
                                        </FormControl>
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
                            form="myForm"
                        >
                            {formOptions.action}
                        </Button>

                        {/* {initialData && (
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
                        )} */}
                    </div>
                </Form>
            </div>
        </Modal>
    );
};