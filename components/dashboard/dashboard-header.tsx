"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ExternalLink, KeyRound, LayoutDashboard, LogOut, Printer } from "lucide-react"
import { logout } from "@/app/actions/auth"
import { Logo } from "@/components/site/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { SessionUser } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ChangePasswordDialog } from "./change-password-dialog"

export function DashboardHeader({ user, portalSlug }: { user: SessionUser; portalSlug?: string }) {
  const pathname = usePathname()
  const [pwOpen, setPwOpen] = useState(false)
  const teacher = user.role === "teacher"
  const nav = teacher
    ? [
        { href: "/guru", label: "Dashboard", icon: LayoutDashboard, active: pathname.startsWith("/guru") },
        { href: "/cetak", label: "Cetak QR", icon: Printer, external: true, active: false },
      ]
    : [{ href: "/siswa", label: "Data kelompok", icon: LayoutDashboard, active: pathname.startsWith("/siswa") }]

  return (
    <header className="no-print px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="mx-auto flex h-16 max-w-[1400px] border-[3px] border-ink bg-paper sm:h-[76px]">
        <Logo href={teacher ? "/guru" : "/siswa"} className="shrink-0 border-r-[3px] border-ink px-3 sm:px-5" />
        <p className="label hidden flex-1 flex-col justify-center px-4 text-[0.66rem] lg:flex">
          <span>{teacher ? "Ruang guru" : "Ruang kelompok"}</span>
          <span>Internet of Things</span>
        </p>
        <nav className="ml-auto flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              target={n.external ? "_blank" : undefined}
              aria-current={n.active ? "page" : undefined}
              className={cn(
                "label hidden items-center gap-2 border-l-[3px] border-ink px-5 font-extrabold transition-colors md:flex",
                n.active ? "bg-blue text-white" : "hover:bg-sun"
              )}
            >
              <n.icon className="size-4" /> {n.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="label flex items-center font-extrabold gap-2.5 border-l-[3px] border-ink bg-ink px-3 text-white outline-none transition-colors hover:bg-blue focus-visible:bg-blue sm:px-5">
              <span className="hidden max-w-40 truncate normal-case sm:block">{user.name}</span>
              <span className="sm:hidden">Menu</span>
              <ChevronDown className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <p className="truncate font-bold">{user.name}</p>
                <p className="font-mono text-xs font-normal text-muted-foreground">
                  @{user.username} · {teacher ? "Guru" : "Siswa"}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {nav.map((n) => (
                <DropdownMenuItem key={n.href} asChild className="md:hidden">
                  <Link href={n.href} target={n.external ? "_blank" : undefined}>
                    <n.icon /> {n.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              {portalSlug && (
                <DropdownMenuItem asChild>
                  <Link href={`/p/${portalSlug}`} target="_blank">
                    <ExternalLink /> Lihat portal publik
                  </Link>
                </DropdownMenuItem>
              )}
              {teacher && (
                <DropdownMenuItem onSelect={() => setPwOpen(true)}>
                  <KeyRound /> Ganti password
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => logout()}>
                <LogOut /> Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
      {teacher && <ChangePasswordDialog open={pwOpen} onOpenChange={setPwOpen} />}
    </header>
  )
}

export function DashboardHeaderSkeleton() {
  return (
    <div className="px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="mx-auto h-16 max-w-[1400px] animate-pulse border-[3px] border-ink/20 bg-paper sm:h-[76px]" />
    </div>
  )
}
