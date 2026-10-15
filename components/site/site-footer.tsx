import Link from "next/link"
import { SITE } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="no-print mt-auto px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 border-[3px] border-ink bg-paper px-4 py-4 sm:flex-row sm:items-center sm:gap-8 sm:px-6">
        <span className="font-display text-2xl leading-none uppercase">IOT LAB</span>
        <span className="label text-[0.66rem]">Sense · Connect · Control · {SITE.teacher}</span>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 sm:ml-auto">
          <Link href="/#karya" className="label text-[0.66rem] hover:underline">Karya</Link>
          <Link href="/login" className="label text-[0.66rem] hover:underline">Masuk</Link>
        </nav>
      </div>
    </footer>
  )
}
