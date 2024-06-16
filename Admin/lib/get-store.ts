import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { Store } from '@/models/Store';
import { getServerSession } from 'next-auth';
import { cache } from 'react';

export const revalidate = 3600; // revalidate the data at most every hour

export const getItem = cache(async (id: string) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('User session not found');
  }
  
  const store = await Store.findOne({ _id: id, userId: session.user.id });
  if (!store) {
    throw new Error(`Store with id ${id} not found`);
  }

  return store;
});
