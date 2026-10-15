import { Suspense } from "react"
import Link from "next/link"
import { LogIn } from "lucide-react"
import { SITE } from "@/lib/site"
import { Logo } from "./logo"
import { ActiveNav, NavCells } from "./site-nav"

export function SiteHeader() {
  return (
    <header className="no-print px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="mx-auto flex max-w-[1400px] gap-3">
        {/* Bar ini menyambung dengan bingkai sampul (components/site/cover.tsx) di bawahnya. */}
        <div className="flex h-16 min-w-0 flex-1 border-[3px] border-ink bg-paper shadow-brutal sm:h-[76px]">
          <Logo className="shrink-0 border-r-[3px] border-ink px-3 sm:px-5" />
          <p className="label hidden flex-1 flex-col justify-center px-4 text-[0.66rem] leading-[1.35] lg:flex">
            <span>Sense</span>
            <span>Connect</span>
            <span>Control</span>
            <span>Internet of Things</span>
          </p>
          <nav className="ml-auto flex">
            {/* usePathname butuh data URL saat request; sorotan menu aktif menyusul lewat Suspense. */}
            <Suspense fallback={<NavCells />}>
              <ActiveNav />
            </Suspense>
            <Link
              href="/login"
              className="label flex items-center gap-2 border-l-[3px] border-ink bg-ink px-3 font-extrabold text-white transition-colors hover:bg-red hover:text-ink sm:px-6"
            >
              <LogIn className="size-4" /> Masuk
            </Link>
          </nav>
        </div>
        <p className="label hidden w-48 shrink-0 flex-col justify-center border-[3px] border-ink bg-paper px-4 text-[0.66rem] lg:flex">
          <span>Kelas {SITE.subject}</span>
          <span>{SITE.teacher}</span>
          <span>XI · 2026</span>
        </p>
      </div>
    </header>
  )
}
