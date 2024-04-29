import React from 'react'
import { MainNav } from './main-nav'
import { UserNav } from '@/components/NavBar/user-nav'
import Link from 'next/link'
import NavbarCart from './navbar-cart'
import getServerSideProps from '@/actions/get-store'
import { ModeToggle } from '../ui/mode-toggle'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { MenuDrawer } from './menu-drawer'

export const Nabvar = async () => {
  const Store = await getServerSideProps()
  const { name } = Store.StoreDoc
  return (
    <>
      <div className="flex-col ">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <Link href={'/'}>
              <p className='font-bold text-xl'>{name}</p>
            </Link>
            <MainNav className="mx-6 hidden  lg:flex" />
            <div className="ml-auto flex items-center space-x-4">
              <NavbarCart />
              <ModeToggle/>
              {/* <UserNav /> */}
              <MenuDrawer className='inline-block cursor-pointer lg:hidden'/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
