"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { createSession, destroySession } from "@/lib/session"

export type LoginState = { error?: string; username?: string; at?: number }

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  if (!username || !password) return { error: "Username dan password wajib diisi.", username, at: Date.now() }

  // Username selalu disimpan huruf kecil, jadi login tidak peka huruf besar/kecil.
  const row = await db.user.findUnique({
    where: { username: username.toLowerCase() },
    select: { id: true, role: true, password_hash: true },
  })

  if (!row || !(await bcrypt.compare(password, row.password_hash))) {
    return { error: "Username atau password salah.", username, at: Date.now() }
  }

  await createSession(row.id)
  redirect(row.role === "teacher" ? "/guru" : "/siswa")
}

export async function logout() {
  await destroySession()
  redirect("/login")
}
