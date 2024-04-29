"use client";
import { BillboardForm } from '@/app/(store-dashboard)/[storeid]/(routes)/preferences/components/billboards/billboard-form'
import React, { useState } from 'react'
import { Separator } from '../../../../../../../components/ui/separator'
import BillBoardsCards from './billboard-cards'

const BillboardPage = () => {

    const [billboardToEdit, setBillboardToEdit] = useState(null)
    const editBillboard = (newValue: any) => {
        setBillboardToEdit(newValue);
    };

    const handleCancel = () => {
        setBillboardToEdit(null);
    };
    return (
        <>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboardToEdit} onCancel={handleCancel} />
            </div>
            <Separator className="mb-5" />
            <div className="p-8 pt-6">
                <BillBoardsCards billboardToEdit={billboardToEdit} editBillboard={editBillboard} />
            </div>
        </>
    )
}

export default BillboardPage