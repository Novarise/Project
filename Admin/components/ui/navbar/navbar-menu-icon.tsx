'use client';
import { Menu, Search } from 'lucide-react';
import { useState } from 'react';
import useNavBarToggle from '@/hooks/use-nav-bar';

export default function NavBarMenuIcon() {
  const [state, setState] = useState(false);
  const { isToggle, toggleTrueFalse } = useNavBarToggle();
  return (
    <div className="md:hidden">
      <button
        className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
        //   onClick={() => setState(!state)}
        onClick={toggleTrueFalse}
      >
        <Menu />
      </button>
    </div>
  );
}
