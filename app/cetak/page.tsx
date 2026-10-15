import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { PrintQr } from "@/components/site/print-qr"
import { requireTeacher } from "@/lib/auth"
import { getClasses, getGroupSummaries } from "@/lib/data"
import { cn } from "@/lib/utils"
import { PrintToolbar } from "./print-button"

export const metadata: Metadata = { title: "Cetak QR Kelompok" }

export default function PrintAllPage({ searchParams }: PageProps<"/cetak">) {
  return (
    <main className="min-h-dvh px-4 py-6 print:p-0">
      <Suspense fallback={null}>
        <PrintAll searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function PrintAll({ searchParams }: { searchParams: PageProps<"/cetak">["searchParams"] }) {
  await requireTeacher()
  const { kelas } = await searchParams
  const [classes, groups] = await Promise.all([getClasses(), getGroupSummaries()])
  const selected = typeof kelas === "string" ? kelas : null
  const shown = selected ? groups.filter((g) => g.class_slug === selected) : groups

  return (
    <>
      <PrintToolbar backHref="/guru">
        {[{ slug: null, name: "Semua" }, ...classes].map((c) => (
          <Link
            key={c.slug ?? "all"}
            href={c.slug ? `/cetak?kelas=${c.slug}` : "/cetak"}
            className={cn(
              "label border-[2.5px] border-ink px-3 py-1.5",
              selected === c.slug ? "bg-blue text-white" : "bg-paper hover:bg-sun"
            )}
          >
            {c.name}
          </Link>
        ))}
      </PrintToolbar>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 print:gap-4">
        {shown.map((g) => (
          <PrintQr key={g.id} slug={g.slug} groupName={g.name} className_={g.class_name} title={g.project_title} />
        ))}
      </div>
      {shown.length === 0 && <p className="brutal mx-auto max-w-md p-8 text-center font-semibold">Tidak ada kelompok.</p>}
    </>
  )
}
