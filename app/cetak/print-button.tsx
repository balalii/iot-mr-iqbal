"use client"

import Link from "next/link"
import { ArrowLeft, Printer } from "lucide-react"

export function PrintToolbar({ backHref, children }: { backHref: string; children?: React.ReactNode }) {
  return (
    <div className="no-print mx-auto mb-8 flex max-w-5xl flex-wrap items-stretch border-[3px] border-ink bg-paper">
      <Link href={backHref} className="label flex items-center gap-2 border-r-[3px] border-ink px-4 py-3 transition-colors hover:bg-sun">
        <ArrowLeft className="size-4" /> Kembali
      </Link>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 px-4 py-2.5">{children}</div>
      <button
        type="button"
        onClick={() => window.print()}
        className="label flex w-full items-center justify-center gap-2 border-t-[3px] border-ink bg-blue px-5 py-3 text-white transition-colors hover:bg-blue-deep sm:w-auto sm:border-t-0 sm:border-l-[3px]"
      >
        <Printer className="size-4" /> Cetak / simpan PDF
      </button>
    </div>
  )
}
