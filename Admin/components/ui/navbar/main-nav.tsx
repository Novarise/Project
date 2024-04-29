import Link from "next/link"

import { cn } from "@/lib/utils"
import { useParams, usePathname } from "next/navigation"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  
  const pathname = usePathname();
  const params = useParams();
  
  const routes = [
    {
      href: `/${params.storeid}`,
      label: 'Overview',
      active: pathname === `/${params.storeid}`,
    },
    // {
    //   href: `/${params.storeid}/billboards`,
    //   label: 'Billboards',
    //   active: pathname === `/${params.storeid}/billboards`,
    // },
    // {
    //   href: `/${params.storeid}/categories`,
    //   label: 'Categories',
    //   active: pathname === `/${params.storeid}/categories`,
    // },
    // {
    //   href: `/${params.storeid}/sizes`,
    //   label: 'Sizes',
    //   active: pathname === `/${params.storeid}/sizes`,
    // },
    // {
    //   href: `/${params.storeid}/colors`,
    //   label: 'Colors',
    //   active: pathname === `/${params.storeid}/colors`,
    // },
    {
      href: `/${params.storeid}/customers`,
      label: 'Customers',
      active: pathname === `/${params.storeid}/customers`,
    },
    {
      href: `/${params.storeid}/products`,
      label: 'Products',
      active: pathname === `/${params.storeid}/products`,
    },
    {
      href: `/${params.storeid}/orders`,
      label: 'Orders',
      active: pathname === `/${params.storeid}/orders`,
    },
    {
      href: `/${params.storeid}/preferences`,
      label: 'Preferences',
      active: pathname === `/${params.storeid}/preferences`,
    },
  ]

  return (
  
  <>
    {routes.map((route) => (
      <li key={route.href} className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
      )}>
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      </li>
    ))}
  </>
  
  )
}