"use client";
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../../../../../components/ui/card'
import axios from 'axios';
import { Heading } from '../../../../../../../components/ui/heading';
import { useParams } from 'next/navigation';
import { format } from 'date-fns'
import Image from "next/image";
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';


interface BillboardsProp {
    label: string;
    imageUrl: string
    createdAt: string
    active_billboard: boolean
}

interface BillBoardsCardsProps {
    billboardToEdit: string | null;
    editBillboard: (newValue: string | null) => void;
}


const BillBoardsCards = ({ billboardToEdit, editBillboard }: BillBoardsCardsProps) => {
    const params = useParams()
    const [billboards, setBillboards] = useState<BillboardsProp[]>([])

    useEffect(() => {
        axios.get(`/api/${params.storeid}/billboards`).then(response => {
            const formattedBillboards = response.data.BillboardData.map((item: any) => ({
                _id: item._id,
                label: item.label,
                imageUrl: item.imageUrl,
                createdAt: format(new Date(item.createdAt), 'MMMM do, yyyy'),
                active_billboard: item.active_billboard
            }));

            setBillboards(formattedBillboards)
        });
    }, []);


    const handleEditBillboard = (billBo: any) => {
        const value = {
            _id: billBo._id,
            label: billBo.label,
            imageUrl: billBo.imageUrl,
            active_billboard: billBo.active_billboard
        }
        editBillboard(value as any);
    };


    return (
        <>
            <div className='pb-3'>
                <Heading title="All BillBoards" description="" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {billboards.map((item) => (
                    <div onClick={() => handleEditBillboard(item)}
                        className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4 opacity-100 hover:opacity-80"
                        key={item.label}
                    >

                        <div className='font-bold flex justify-between items-center text-lg'>
                            {item.label.toUpperCase()}
                            {item.active_billboard && (
                                <Badge variant="outline"> <Check color='green'/></Badge>
                            )}
                        </div>
                        <div className="aspect-square rounded-xl bg-gray-100 relative">
                            <Image
                                src={item.imageUrl}
                                alt=""
                                fill
                                className="aspect-square object-cover rounded-md"
                            />
                        </div>
                        <a className='text-sm'>
                            {item.createdAt}
                        </a>
                    </div>
                ))}
            </div>


            {/* <div className="grid grid-cols-4 gap-4">
                {billboards.map((item) => (
                    <button key={item.label} className='cursor-pointer lg:max-w-md w-full ' onClick={() => handleEditBillboard(item)}>
                        <Card className="lg:max-w-md w-full  hover:bg-gray-300 h-[320px]">
                            <CardHeader>
                                <CardTitle>{item.label}</CardTitle>
                            </CardHeader>
                            <CardContent className='flex flex-col items-center justify-center'>
                                <img
                                    src={item.imageUrl}
                                    alt="Card Image"
                                    className="h-[13rem]"
                                />
                            <div className='text-sm'>
                                {item.createdAt}
                            </div>
                            </CardContent>
                        </Card>
                    </button>

                ))}
            </div> */}
        </>
    )
}

export default BillBoardsCards