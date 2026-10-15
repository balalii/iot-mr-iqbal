import "server-only"
import { cookies, headers } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { DATA_DIR } from "./paths"

const COOKIE = "iot_session"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 hari

export type SessionPayload = { uid: number }

// Pakai SESSION_SECRET dari env bila ada; jika tidak, buat sekali dan simpan di data/.
function loadSecret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET
  const file = path.join(DATA_DIR, ".session-secret")
  if (fs.existsSync(file)) return fs.readFileSync(file, "utf8").trim()
  const secret = crypto.randomBytes(32).toString("hex")
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(file, secret, { mode: 0o600 })
  return secret
}

const key = new TextEncoder().encode(loadSecret())

export async function createSession(uid: number) {
  const token = await new SignJWT({ uid })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key)
  const proto = (await headers()).get("x-forwarded-proto")
  ;(await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: proto === "https",
    path: "/",
    maxAge: MAX_AGE,
  })
}

export async function readSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] })
    return typeof payload.uid === "number" ? { uid: payload.uid } : null
  } catch {
    return null
  }
}

export async function destroySession() {
  ;(await cookies()).delete(COOKIE)
}
