'use client';
import React, { FC, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import SettingsPage from "@/app/(store-dashboard)/[storeid]/(routes)/preferences/components/settings-page";
import BillboardPage from '@/app/(store-dashboard)/[storeid]/(routes)/preferences/components/billboards/billboard-page';
// import { Store } from "@/models/Store";
// import { authOptions } from "@/app/api/auth/[...nextauth]/options";
// import { getServerSession } from "next-auth";
import { SettingsForm } from './settings/settings-form';
import { useParams } from 'next/navigation';
import useStorage from '@/hooks/use-local-storage';
import { CategoryForm } from './categories/category-form';
import { CategoriesClient } from './categories/client';
import { PropertyClient } from './properties/client';

interface PreferencesPageProp {
  storeData: any;
  billboardData: any;
  formattedCategories: any;
  formattedProperties: any;
}

const PreferencePage: FC<PreferencesPageProp> = ({
  storeData,
  billboardData,
  formattedCategories,
  formattedProperties,
}) => {
  const { getItem, setItem } = useStorage();
  setItem('token', getItem('token') || 'settings', 2, 'session');
  const token = getItem('token');
  const [isMounted, setIsMounted] = useState(false);

  function tabHandle(value: string) {
    setItem('token', value, 2, 'session');
  }
  useEffect(() => {
    setIsMounted(true);
    setItem('token', getItem('token') || 'settings', 2, 'session');
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Tabs defaultValue={token as string} className="w-full p-2 border-b">
      <TabsList className="w-full justify-start items-start">
        {/* <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="billboard">Billboard</TabsTrigger>
                    <TabsTrigger value="category">Category</TabsTrigger>
                    <TabsTrigger value="api">API</TabsTrigger> */}
        <TabsTrigger value="settings" onClick={() => tabHandle('settings')}>
          Settings
        </TabsTrigger>
        <TabsTrigger value="billboard" onClick={() => tabHandle('billboard')}>
          Billboard
        </TabsTrigger>
        <TabsTrigger value="category" onClick={() => tabHandle('category')}>
          Category
        </TabsTrigger>
        <TabsTrigger value="properties" onClick={() => tabHandle('properties')}>
          Properties
        </TabsTrigger>
      </TabsList>
      <TabsContent value="settings">
        <div className="flex-col">
          {/* <SettingsPage params={{storeid: params.storeid}}/> */}

          <div className="flex-1 space-y-4 p-8 pt-6">
            <SettingsForm initialData={JSON.parse(JSON.stringify(storeData))} />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="billboard">
        <div className="flex-col">
          <BillboardPage />
          {/* <div className="flex-1 space-y-4 p-8 pt-6">
                            <BillboardForm initialData={billboardToEdit} />
                        </div>
                        <Separator className="mb-5" />
                        <BillBoardsCards billboardToEdit={billboardToEdit} editBillboard={editBillboard}/> */}
        </div>
      </TabsContent>
      <TabsContent value="category">
        <div className="flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            {/* <CategoryForm initialData={formattedCategories[0]} billboards={billboardData}/> */}
            <CategoriesClient
              data={formattedCategories}
              initialData={null}
              billboards={billboardData}
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="properties">
        <div className="flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <PropertyClient srcData={formattedProperties} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PreferencePage;
