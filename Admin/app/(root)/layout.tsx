import { redirect } from 'next/navigation';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { mongooseConnect } from '@/lib/mongoose';
import { Store } from '@/models/Store';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id;
    await mongooseConnect();
    
  if (!userId) {
    redirect('/login');
  }

  const store = await Store.findOne({userId:userId});

  if (store) {
    redirect(`/${store.id}`);
  };

  return (
    <>
      {children}
    </>
  );
};