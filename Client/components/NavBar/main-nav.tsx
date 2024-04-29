"use client";
import Link from "next/link"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className={cn("text-sm font-medium transition-colors hover:text-primary ",
        { "text-muted-foreground": pathname !== "/"} )}
      >
        Overview
      </Link>
      <Link
        href="/products"
        className={cn("text-sm font-medium transition-colors hover:text-primary ",
        { "text-muted-foreground": pathname !== "/products"} )}
      >
        Products
      </Link>
      <Link
        href="/about"
        className={cn("text-sm font-medium transition-colors hover:text-primary ",
        { "text-muted-foreground": pathname !== "/about"} )}
      >
        About us
      </Link>
      {/* <Link
        href="/settings"
        className={cn("text-sm font-medium transition-colors hover:text-primary ",
        { "text-muted-foreground": pathname !== "/settings"} )}
      >
        Settings
      </Link> */}
    </nav>
  )
}