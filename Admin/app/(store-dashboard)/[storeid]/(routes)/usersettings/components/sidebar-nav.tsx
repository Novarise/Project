"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { string } from "zod"
import { useState } from "react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[];
  
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const params = useParams()
  const customPathname = `/${params.storeid}/usersettings`
  const pathname = usePathname()
  const simplifiedPathname = `/${pathname.split('/').pop()}` === "/usersettings" ? "/" : `/${pathname.split('/').pop()}`;
 
  return (
    <nav
    className={cn(
      "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
      {'flex-wrap sm:flex-wrap sm:space-y-1': true},
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={`${customPathname}/${item.href}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            simplifiedPathname === item.href
              ? "bg-black text-white"
              : "text-gray-500 hover:text-gray-700 ",
            "rounded-lg"
          )}
        >

          {item.title}
        </Link>
      ))}
    </nav>
  )
}
