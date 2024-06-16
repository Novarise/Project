'use client';
import { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import Link from 'next/link';
import DropdownMenuComp from './DropDownMenu';

interface BurgerMenuProps {
  params: { menus: Record<string, any>[]; allStores: Record<string, any>[] };
}
const NavBarMenuContent: React.FC<BurgerMenuProps> = ({ params }) => {
  const [state, setState] = useState(false);
  console.log(params);

  return (
    <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8 border-b">
      <div className="flex items-center justify-between py-3 md:py-5 md:block">
        <DropdownMenuComp params={{ allStores: params.allStores }} />
        <div className="md:hidden">
          <button
            className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
            onClick={() => setState(!state)}
          >
            <Menu />
          </button>
        </div>
      </div>
      <div
        className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${state ? 'block' : 'hidden'}`}
      >
        <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
          {params.menus.map((item, idx) => (
            <li key={idx} className="text-gray-600 hover:text-indigo-600">
              <Link href={item.path}>{item.title}</Link>
            </li>
          ))}
          <form className="flex items-center  space-x-2 border rounded-md p-2">
            <Search className="h-5 w-5 flex-none text-gray-300" />
            <input
              className="w-full outline-none appearance-none placeholder-gray-500 text-gray-500 sm:w-auto"
              type="text"
              placeholder="Search"
            />
          </form>
        </ul>
      </div>
    </div>
  );
};

export default NavBarMenuContent;
