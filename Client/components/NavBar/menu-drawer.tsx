"use client";
import * as React from "react";
import { Home, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function MenuDrawer({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const sidebarNavItems = [
    {
      title: "Overview",
      href: "/",
    },
    {
      title: "Products",
      href: "/products",
    },
    {
      title: "About Us",
      href: "/about",
    },
    {
      title: "Carts",
      href: "/cart",
    },
  ];

  return (
    <div className={cn(className)} {...props}>
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="outline">
            <Menu size={32} />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="w-full">
            <DrawerHeader className="justify-center ">
              <DrawerTitle>MENU</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <aside className="bg-gradient-to-b ">
                <ul className=" space-y-4">
                  {sidebarNavItems.map((item: any) => (
                    <DrawerClose asChild>
                      <Link
                        className="flex items-center space-x-4 p-6 hover:bg-gray-100 dark:hover:bg-gray-700 border"
                        href={item.href}
                      >
                        <Home className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <li key={item.href}>
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                        </li>
                      </Link>
                    </DrawerClose>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
