import { Suspense } from "react"
import { DashboardHeader, DashboardHeaderSkeleton } from "@/components/dashboard/dashboard-header"
import { requireStudent } from "@/lib/auth"
import { db } from "@/lib/db"

export default function StudentLayout({ children }: LayoutProps<"/siswa">) {
  return (
    <>
      <Suspense fallback={<DashboardHeaderSkeleton />}>
        <Header />
      </Suspense>
      <main className="flex-1 overflow-x-clip px-3 pt-5 pb-10 sm:px-5 sm:pt-8">{children}</main>
    </>
  )
}

async function Header() {
  const user = await requireStudent()
  const g = await db.group.findUnique({ where: { id: user.groupId }, select: { slug: true } })
  return <DashboardHeader user={user} portalSlug={g?.slug} />
}
