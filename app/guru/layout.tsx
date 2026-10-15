import { Suspense } from "react"
import { DashboardHeader, DashboardHeaderSkeleton } from "@/components/dashboard/dashboard-header"
import { requireTeacher } from "@/lib/auth"

export default function TeacherLayout({ children }: LayoutProps<"/guru">) {
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
  const user = await requireTeacher()
  return <DashboardHeader user={user} />
}
