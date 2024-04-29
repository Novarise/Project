'use client';
import useNavBarToggle from "@/hooks/use-nav-bar";
import { MainNav } from "@/components/ui/navbar/main-nav";


const NavBarMenuContent = () => {
  const { isToggle } = useNavBarToggle();

  return (
        <div className={`flex pl-5  justify-self-center pb-3 mt-4 md:block md:pb-0 md:mt-0 ${isToggle ? "block" : "hidden"}`}>
          <ul className="justify-center items-center space-y-4 md:flex md:space-x-6 md:space-y-0">
            <MainNav className="mx-6" />
          </ul>
      </div>
  )

}

export default NavBarMenuContent;
