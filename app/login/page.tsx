import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Logo } from "@/components/site/logo"
import { getCurrentUser, homeFor } from "@/lib/auth"
import { LoginArt } from "./login-art"
import { LoginForm } from "./login-form"

export const metadata: Metadata = { title: "Masuk" }

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh grid-cols-1 gap-3 p-3 sm:gap-5 sm:p-5 lg:grid-cols-[1.1fr_1fr]">
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <LoginArt />
      <section className="flex flex-col border-[3px] border-ink bg-paper">
        <div className="border-b-[3px] border-ink bg-blue p-4 text-white lg:hidden">
          <Logo className="text-white" />
          <p className="mt-6 font-display text-[clamp(3.2rem,16vw,4.6rem)] leading-[0.88] uppercase">
            Nyalakan
            <br />
            idemu.
          </p>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10 sm:px-8">
          <LoginForm showDemo={process.env.NODE_ENV !== "production"} />
        </div>
      </section>
    </main>
  )
}

async function RedirectIfSignedIn() {
  const user = await getCurrentUser()
  if (user) redirect(homeFor(user))
  return null
}
