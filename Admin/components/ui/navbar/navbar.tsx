import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { mongooseConnect } from '@/lib/mongoose';
import { Store } from '@/models/Store';
import NavBarMenuContent from './navbar-menu-content';
import StoreSwitcher from './store-switcher';
import NavBarMenuIcon from './navbar-menu-icon';
import UserSearchNav from './nav-right-cont';

interface NavBarPageProps {
  params: { storeId: string };
}

const Navbar: React.FC<NavBarPageProps> = async ({ params }) => {
  const session = await getServerSession(authOptions);
  await mongooseConnect();
  // get all stores from db if admin
  const stores = await Store.find({ userId: session?.user.id });

  // TODO: get specific store for the given user

  return (
    <nav className="bg-white dark:bg-black w-full border-b ">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-2">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <StoreSwitcher items={JSON.parse(JSON.stringify(stores))} />
          <NavBarMenuIcon />
        </div>
        <NavBarMenuContent />
        <UserSearchNav />
      </div>
    </nav>
  );
};

export default Navbar;
