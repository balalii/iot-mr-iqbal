import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Sampul bergaya majalah, satu bingkai dengan bar header di atasnya:
 * garis atas bingkai = garis bawah header, masthead tanpa kotak sendiri,
 * foto menjorok di dalam bingkai, dan panel cap menimpa tepi kanan bingkai
 * lalu menjulur di bawah kotak info header.
 *
 * Lebar bingkai = lebar bar header = kontainer − (kotak info 12rem + celah 0.75rem).
 * `--s` = lebar panel cap; panel rata kanan dengan kotak info, tanpa bayangan.
 */
export function Cover({
  masthead,
  photo,
  stamp,
  stampClassName,
}: {
  masthead: ReactNode
  photo: ReactNode
  stamp: ReactNode
  stampClassName?: string
}) {
  return (
    <section className="px-3 sm:px-5">
      <div className="mx-auto flex max-w-[1400px] flex-col [--s:18.5rem] lg:flex-row xl:[--s:22rem]">
        <div className="flex min-w-0 flex-1 flex-col border-[3px] border-t-0 border-ink bg-paper shadow-brutal">
          <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)] lg:pr-[calc(var(--s)-12rem)]">
            <div className="flex flex-col justify-between gap-6 p-4 sm:p-6">{masthead}</div>
            <div className="flex flex-col px-2.5 pb-2.5 lg:px-0 lg:py-2.5">{photo}</div>
          </div>
        </div>
        <div
          className={cn(
            "relative z-10 mt-5 flex flex-col border-[3px] border-ink p-6",
            "lg:mt-2.5 lg:mb-[calc(0.625rem+3px)] lg:ml-[calc(12.75rem-var(--s))] lg:w-(--s) lg:shrink-0",
            stampClassName
          )}
        >
          {stamp}
        </div>
      </div>
    </section>
  )
}
