"use client";
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Overview" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About us" },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn("text-sm font-medium transition-colors hover:text-primary", {
            "text-muted-foreground": pathname !== href,
          })}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}