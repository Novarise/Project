// "use client"
// import { signOut, useSession } from "next-auth/react"
// import * as React from "react"
import Link from "next/link"
import { Menu, Search } from "lucide-react"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
// import { LoginButton, LogoutButton } from "@/app/authBtn"
// import {
//   Cloud,
//   CreditCard,
//   Github,
//   Keyboard,
//   LifeBuoy,
//   LogOut,
//   Mail,
//   MessageSquare,
//   Plus,
//   PlusCircle,
//   Settings,
//   User,
//   UserPlus,
//   Users,
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuPortal,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Store } from "@/models/Store"
// import { useStoreModal } from "@/hooks/use-store-modal"
// import { useState } from "react"
import DropdownMenuComp from "./DropDownMenu"
import { getServerSession } from "next-auth"
import { mongooseConnect } from "@/lib/mongoose"
import { Store } from "@/models/Store"
import NavBarMenuContent from "./navbar-menu-content"


interface DashboardPageProps{
  params : {storeId: string}
};

const Navbar: React.FC<DashboardPageProps> =  async ({params}) =>{

    const session = await getServerSession(authOptions);
    await mongooseConnect();
    const stores = await Store.find({userId:session?.user.id })
    
    const menus = [
      { title: "Home", path: "/" },
      { title: "Settings", path: "/your-path" },
     
    ]

    return (
      <nav className="bg-white dark:bg-black w-full border-b md:border-0">
            <NavBarMenuContent params={{
              menus: menus, allStores: JSON.parse(JSON.stringify(stores))
            }}/>
         
      </nav>
    )
  }


export default Navbar;