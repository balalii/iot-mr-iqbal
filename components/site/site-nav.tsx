"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Beranda", match: (p: string) => p === "/", show: "hidden sm:flex" },
  { href: "/#karya", label: "Karya", match: (p: string) => p.startsWith("/p/"), show: "flex" },
]

/** Sel navigasi; tanpa `pathname` (fallback prerender) tidak ada sel aktif. */
export function NavCells({ pathname = "" }: { pathname?: string }) {
  return NAV.map((n) => {
    const active = n.match(pathname)
    return (
      <Link
        key={n.label}
        href={n.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "label items-center border-l-[3px] border-ink px-3 font-extrabold transition-colors sm:px-6",
          n.show,
          active ? "bg-blue text-white" : "hover:bg-sun"
        )}
      >
        {n.label}
      </Link>
    )
  })
}

export function ActiveNav() {
  return <NavCells pathname={usePathname()} />
}
