
"use client";
import { UserNav } from "@/components/ui/navbar/user-nav"
import { Search } from "@/components/ui/navbar/search"
import useNavBarToggle from "@/hooks/use-nav-bar";
export default function UserSearchNav() {
    const { isToggle } = useNavBarToggle();
    return (
        <div className={`flex-1 justify-self-center pb-3 mt-4 md:block md:pb-0 md:mt-0 ${isToggle ? "block" : "hidden"}`}>
            <ul className="justify-center items-center space-y-4 md:flex md:space-x-6 md:space-y-0">
            <div className=" ml-auto flex items-center space-x-4 ">
                <Search />
                <UserNav />
                </div>
            </ul>
        </div>
    )
}