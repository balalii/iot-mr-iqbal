import { Suspense } from "react"
import type { Metadata } from "next"
import { Skeleton } from "@/components/ui/skeleton"
import { Checklist } from "@/components/dashboard/checklist"
import { GroupEditor } from "@/components/editor/group-editor"
import { QrCard } from "@/components/site/qr-card"
import { requireStudent } from "@/lib/auth"
import { getGroupById } from "@/lib/data"
import { completeness, withCounts } from "@/lib/portal"

export const metadata: Metadata = { title: "Data Kelompok" }

export default function StudentPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <StudentDashboard />
    </Suspense>
  )
}

async function StudentDashboard() {
  const user = await requireStudent()
  const group = await getGroupById(user.groupId)
  if (!group) return <p className="brutal mx-auto max-w-xl p-8 text-center font-bold">Kelompok tidak ditemukan. Hubungi guru.</p>
  const { checks, percent } = completeness(withCounts(group))

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-8">
        <h1 className="text-[clamp(3.4rem,9vw,6rem)] leading-[0.85]">Data {group.name}</h1>
        <p className="label mt-3 text-muted-foreground">
          {group.class_name} · Akun @{user.username}
        </p>
        <p className="mt-3 max-w-2xl">
          Lengkapi data proyek di bawah. Setiap perubahan langsung tampil di portal publik. QR kalian tidak berubah, jadi aman dicetak kapan saja.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
        <div className="order-2 min-w-0 lg:order-1">
          <GroupEditor group={group} />
        </div>
        <aside className="order-1 space-y-5 lg:sticky lg:top-5 lg:order-2 lg:self-start">
          {group.teacher_note && (
            <figure className="pop border-[3px] border-ink bg-green p-5">
              <blockquote className="font-display text-[1.7rem] leading-[1] uppercase">“{group.teacher_note}”</blockquote>
              <figcaption className="label mt-4 flex items-center gap-3">
                <span className="h-[3px] w-8 bg-ink" aria-hidden /> Catatan guru
              </figcaption>
            </figure>
          )}
          <Checklist checks={checks} percent={percent} />
          <QrCard slug={group.slug} groupName={group.name} className_={group.class_name} title={group.project_title} />
        </aside>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <Skeleton className="h-28 w-2/3" />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <Skeleton className="h-[500px]" />
        <Skeleton className="h-96" />
      </div>
    </div>
  )
}
