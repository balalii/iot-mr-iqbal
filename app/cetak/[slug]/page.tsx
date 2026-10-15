import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PrintQr } from "@/components/site/print-qr"
import { getGroupBySlug } from "@/lib/data"
import { PrintToolbar } from "../print-button"

export const metadata: Metadata = { title: "Cetak QR" }

export default function PrintOnePage({ params }: PageProps<"/cetak/[slug]">) {
  return (
    <main className="min-h-dvh px-4 py-6 print:p-0">
      <Suspense fallback={null}>
        <PrintOne params={params} />
      </Suspense>
    </main>
  )
}

async function PrintOne({ params }: { params: PageProps<"/cetak/[slug]">["params"] }) {
  const { slug } = await params
  const g = await getGroupBySlug(slug)
  if (!g) notFound()
  return (
    <>
      <PrintToolbar backHref={`/p/${g.slug}`}>
        <span className="label text-muted-foreground">Cetak, laminating, lalu tempel di miniatur</span>
      </PrintToolbar>
      <div className="mx-auto w-full max-w-md">
        <PrintQr slug={g.slug} groupName={g.name} className_={g.class_name} title={g.project_title} size="lg" />
      </div>
    </>
  )
}
