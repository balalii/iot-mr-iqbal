import { NextResponse, type NextRequest } from "next/server"

// Cek optimistis: tanpa cookie sesi langsung dialihkan ke /login.
// Otorisasi sebenarnya tetap dilakukan di server (lib/auth.ts) pada tiap halaman & action.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("iot_session")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/guru/:path*", "/siswa/:path*", "/cetak"],
}
