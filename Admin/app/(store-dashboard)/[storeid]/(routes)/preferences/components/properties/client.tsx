'use client';

import {
  ChevronsDown,
  ChevronsUp,
  ChevronsUpDown,
  Plus,
  Trash,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { columns, PropertyColumn } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Billboard, Category } from '@/types';
import { ModalAction } from './modal-action';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';
import { AlertModal } from '@/components/ui/modals/alert-modal';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CategoriesClientProps {
  // data: PropertyColumn[];
  srcData: any;
}

function isEmpty(obj: any) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

export const PropertyClient: React.FC<CategoriesClientProps> = ({
  // data,
  srcData,
}) => {
  const numIterations = srcData.length;
  const [openSectionIndex, setOpenSectionIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [IndexVal, setIndexVal] = useState(0);
  const params = useParams();
  const router = useRouter();

  const handleDeleteClick = (value: any) => {
    onDelete(value);
  };

  const onDelete = async (index: any) => {
    const propertyID = srcData[index]._id;
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeid}/properties?propertyID=${propertyID}`,
      );
      router.refresh();
      window.location.reload();
      // router.push(`/${params.storeId}/billboards`);
      toast.success('Property deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all properties using this tag first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleOpenChange = (index: number) => {
    if (openSectionIndex === index) {
      setOpenSectionIndex(-1);
    } else {
      setOpenSectionIndex(index);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={'Properties'} description="Manage Properties" />
        <ModalAction initialData={null} />
      </div>
      {/* {isEmpty(srcData) && (
        <>
          <div className="flex items-center justify-between">
            <Heading title={'Default (0)'} description="Default Preference" />
            <ModalAction initialData={null} />
          </div>
          <Separator />
          <DataTable searchKey="name" columns={columns} data={[]} />
        </>
      )} */}

      {Array.from({ length: numIterations }).map((_, index) => {
        let rows = srcData[index].values;
        rows.map((row: any) => {
          row['label'] = srcData[index].label;
        });

        return (
          <div key={index}>
            <AlertModal
              isOpen={open}
              onClose={() => setOpen(false)}
              onConfirm={() => handleDeleteClick(IndexVal)}
              loading={loading}
            />
            <Collapsible
              open={openSectionIndex === index}
              onOpenChange={() => handleOpenChange(index)}
              className="w-full space-y-2 "
              key={index}
            >
              <>
                <Separator />
                <div className="flex items-center justify-between space-x-4 px-4 w-full">
                  <div className="flex items-center justify-between">
                    <Heading
                      title={`${srcData[index].label} (${srcData[index].values.length})`}
                      description={`Manage ${srcData[index].label} for your store`}
                      size="lg"
                      weight="medium"
                    />
                  </div>
                  <div className="flex justify-between items-center space-x-3">
                    <CollapsibleTrigger asChild>
                      <Button variant="default" size="sm" className="w-9 p-0">
                        {openSectionIndex === index && (
                          <ChevronsUp className="h-4 w-4" />
                        )}
                        {openSectionIndex !== index && (
                          <ChevronsDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <Button
                      disabled={loading}
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setOpen(true);
                        setIndexVal(index);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CollapsibleContent className="space-y-2">
                  <div key={index} className="bg-gray-100 p-2 rounded-md">
                    <DataTable searchKey="name" columns={columns} data={rows} />
                  </div>
                </CollapsibleContent>
              </>
            </Collapsible>
          </div>
        );
      })}
    </>
  );
};
