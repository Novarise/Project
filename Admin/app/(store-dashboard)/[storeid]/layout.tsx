
import { redirect } from 'next/navigation';

import Navbar from '@/components/ui/navbar/navbar'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { mongooseConnect } from '@/lib/mongoose';
import { Store } from '@/models/Store';


export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: { storeid: string }
}) {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id;
    await mongooseConnect();
    const { storeid } = params

    // const store = await Store.find({userId:userId })
    
    if (!userId) {
        redirect('/login');
    }
    
    try{
        const store = await Store.findOne({_id:storeid});
        if (!store) {
            redirect('/');
        };

        return (
            <>
                <Navbar params={{ storeId: store._id,}}  />
                {children}
            </>
        );
    }catch(error){
        redirect('/');
    }

    
};