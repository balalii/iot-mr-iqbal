"use client"

import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

/** Alamat dasar untuk QR. NEXT_PUBLIC_APP_URL dipakai bila diatur (mis. domain sekolah). */
export function useOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")
  const origin = useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    () => ""
  )
  return fromEnv || origin
}
