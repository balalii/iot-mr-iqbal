import "server-only"
import { redirect } from "next/navigation"
import { db } from "./db"
import { readSession } from "./session"
import type { SessionUser } from "./types"

export async function findUserById(id: number): Promise<SessionUser | null> {
  const row = await db.user.findUnique({
    where: { id },
    select: { id: true, username: true, name: true, role: true, group_id: true },
  })
  if (!row) return null
  return { id: row.id, username: row.username, name: row.name, role: row.role, groupId: row.group_id }
}

/** User yang sedang login, atau null. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await readSession()
  if (!session) return null
  return findUserById(session.uid)
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  return user
}

export async function requireTeacher(): Promise<SessionUser> {
  const user = await requireUser()
  if (user.role !== "teacher") redirect("/siswa")
  return user
}

export async function requireStudent(): Promise<SessionUser & { groupId: number }> {
  const user = await requireUser()
  if (user.role !== "student" || user.groupId == null) redirect("/guru")
  return user as SessionUser & { groupId: number }
}

/** Guru boleh mengubah semua kelompok; siswa hanya kelompoknya sendiri. */
export async function authorizeGroup(groupId: number): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) throw new Error("Sesi berakhir, silakan login kembali.")
  if (user.role === "teacher") return user
  if (user.groupId === groupId) return user
  throw new Error("Kamu tidak punya akses ke kelompok ini.")
}

export function homeFor(user: SessionUser) {
  return user.role === "teacher" ? "/guru" : "/siswa"
}
