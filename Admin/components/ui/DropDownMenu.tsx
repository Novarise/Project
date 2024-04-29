'use client';
import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
    Store
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { signOut, useSession } from "next-auth/react"
import { useStoreModal } from "@/hooks/use-store-modal"
import { useState } from "react"
import { Store as dbStore } from "@/models/Store"
import Link from "next/link"
import { usePathname } from "next/navigation";

type DropdownTriggerProps = React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>
  

interface DashboardPageProps extends DropdownTriggerProps {
    params: { allStores: Record<string, any>[] }
};
const DropdownMenuComp: React.FC<DashboardPageProps> =  ({ params }) => {
    const storeModal = useStoreModal();
    const [open, setOpen] = useState(false)
   const path = usePathname()
   const storeId = path.replace('/','')
   let activeStoreName = ''
    params.allStores.forEach(store => {
      if (storeId === store._id.toString()){
        activeStoreName = store.name
      }
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="lg" className="text-purple-400 bg-transparent text-3xl p-3 hover:bg-0">{activeStoreName}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <DropdownMenuGroup>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Switch Store</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>

                            <DropdownMenuSubContent >
                                {params.allStores.map((store: any) => (
                                    <DropdownMenuItem key={store._id}>
                                        <Store className="mr-2 h-4 w-4" />
                                        <Link href={`/${store._id}`}> {store.name}</Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuSubContent>


                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem
                        onSelect={() => {
                            setOpen(false)
                            storeModal.onOpen()
                        }}
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create Store
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />


                <DropdownMenuItem disabled>
                    <Cloud className="mr-2 h-4 w-4" />
                    <span>API</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span onClick={() => signOut()}>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default DropdownMenuComp;
