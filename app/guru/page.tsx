import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, ImageOff, KeyRound, Printer, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AvatarStack } from "@/components/site/avatar-stack"
import { TAG_COLORS } from "@/components/site/group-card"
import { Photo } from "@/components/site/photo"
import { ProgressBar } from "@/components/site/progress-bar"
import { requireTeacher } from "@/lib/auth"
import { getClasses, getGroupSummaries } from "@/lib/data"
import { completeness } from "@/lib/portal"
import type { GroupSummary } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AddClassDialog, AddGroupDialog, ClassMenu } from "./_components/class-dialogs"
import { QrDialog } from "./_components/qr-dialog"

export const metadata: Metadata = { title: "Dashboard Guru" }

export default function TeacherPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <TeacherDashboard />
    </Suspense>
  )
}

async function TeacherDashboard() {
  const user = await requireTeacher()
  const [classes, groups] = await Promise.all([getClasses(), getGroupSummaries()])
  const scored = groups.map((g) => ({ ...g, progress: completeness(g).percent }))
  const members = groups.reduce((n, g) => n + g.members.length, 0)
  const complete = scored.filter((g) => g.progress === 100).length
  const avg = scored.length ? Math.round(scored.reduce((n, g) => n + g.progress, 0) / scored.length) : 0

  const summary = [
    { label: "Kelas", value: classes.length },
    { label: "Kelompok", value: groups.length },
    { label: "Siswa terdata", value: members },
    { label: "Portal lengkap", value: `${complete}/${groups.length}` },
  ]

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="text-[clamp(3.6rem,9vw,6rem)] leading-[0.85]">Ruang guru</h1>
          <p className="mt-3 max-w-xl">
            Halo, {user.name}. Pantau kelengkapan dokumentasi tiap kelompok, kelola akun, dan cetak QR untuk ditempel di prototype.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <AddClassDialog />
          <Button asChild>
            <Link href="/cetak" target="_blank">
              <Printer /> Cetak semua QR
            </Link>
          </Button>
        </div>
      </div>

      {/* Ringkasan: satu baris sel bergaris */}
      <dl className="mt-7 grid grid-cols-2 border-[3px] border-ink bg-paper lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.6fr)]">
        {summary.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              "flex flex-col gap-2 p-4 sm:p-5",
              i % 2 === 1 && "border-l-[3px] border-ink",
              i >= 2 && "border-t-[3px] border-ink lg:border-t-0",
              i > 0 && "lg:border-l-[3px]"
            )}
          >
            <dt className="label">{s.label}</dt>
            <dd className="font-display text-[2.8rem] leading-none">{s.value}</dd>
          </div>
        ))}
        <div className="col-span-2 flex flex-col justify-between gap-3 border-t-[3px] border-ink bg-green p-4 sm:p-5 lg:col-span-1 lg:border-t-0 lg:border-l-[3px]">
          <dt className="label flex justify-between">
            Rata-rata kelengkapan <span>{avg}%</span>
          </dt>
          <dd>
            <ProgressBar value={avg} className="h-5" />
          </dd>
        </div>
      </dl>

      <div className="mt-12 space-y-14">
        {classes.map((c) => {
          const list = scored.filter((g) => g.class_id === c.id)
          const nextNumber = list.reduce((m, g) => Math.max(m, g.number), 0) + 1
          return (
            <section key={c.id}>
              <div className="mb-4 flex items-center justify-between gap-3 border-b-[3px] border-ink pb-3">
                <h2 className="flex min-w-0 flex-wrap items-baseline gap-x-4 text-[clamp(2.4rem,5vw,3.4rem)]">
                  {c.name}
                  <span className="label text-muted-foreground">{list.length} kelompok</span>
                </h2>
                <div className="flex shrink-0 gap-2">
                  <AddGroupDialog classId={c.id} className_={c.name} classSlug={c.slug} nextNumber={nextNumber} />
                  <ClassMenu id={c.id} name={c.name} slug={c.slug} groupCount={list.length} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                {list.map((g, i) => (
                  <TeacherGroupCard key={g.id} group={g} progress={g.progress} index={i} />
                ))}
                {list.length === 0 && (
                  <p className="label col-span-full border-[3px] border-dashed border-ink/40 p-8 text-center text-muted-foreground">
                    Belum ada kelompok. Tambahkan lewat tombol “Kelompok”.
                  </p>
                )}
              </div>
            </section>
          )
        })}
        {classes.length === 0 && (
          <p className="brutal p-10 text-center font-semibold">Belum ada kelas. Mulai dengan “Tambah kelas”.</p>
        )}
      </div>
    </div>
  )
}

function TeacherGroupCard({ group: g, progress, index }: { group: GroupSummary; progress: number; index: number }) {
  return (
    <article className="brutal flex h-full flex-col">
      <div className="relative m-2.5 mb-0 aspect-[16/10] overflow-hidden bg-cream-deep">
        {g.cover ? (
          <Photo src={g.cover} alt="" fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover" />
        ) : (
          <span className="label absolute inset-0 grid place-items-center text-muted-foreground">
            <span className="flex flex-col items-center gap-2">
              <ImageOff className="size-6" /> Belum ada foto
            </span>
          </span>
        )}
        <span className={cn("tag absolute top-0 left-0", TAG_COLORS[index % TAG_COLORS.length])}>{g.name}</span>
        <span className="tag absolute right-0 bottom-0 bg-ink text-white normal-case">
          <KeyRound className="size-3" /> {g.username ?? "—"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-[1.45rem] leading-[0.98]">
          {g.project_title || <span className="text-muted-foreground">Belum ada judul</span>}
        </h3>
        <AvatarStack members={g.members} />
        <div className="mt-auto space-y-1.5">
          <div className="label flex justify-between text-[0.66rem]">
            <span>Kelengkapan</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </div>
      <div className="flex border-t-[3px] border-ink">
        <Link
          href={`/guru/kelompok/${g.id}`}
          className="label flex flex-1 items-center justify-center gap-2 bg-blue py-3 font-extrabold text-white transition-colors hover:bg-blue-deep"
        >
          <Settings2 className="size-4" /> Kelola
        </Link>
        <Link
          href={`/p/${g.slug}`}
          target="_blank"
          aria-label={`Buka portal ${g.name}`}
          className="grid w-12 place-items-center border-l-[3px] border-ink transition-colors hover:bg-sun"
        >
          <ExternalLink className="size-4" />
        </Link>
        <QrDialog slug={g.slug} groupName={g.name} className_={g.class_name} title={g.project_title} />
      </div>
    </article>
  )
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <Skeleton className="h-28 w-2/3" />
      <Skeleton className="h-28" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-96" />
        ))}
      </div>
    </div>
  )
}
