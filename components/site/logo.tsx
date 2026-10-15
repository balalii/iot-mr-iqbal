import Link from "next/link"
import { cn } from "@/lib/utils"

/** Wordmark IOT LAB: huruf display kondensasi, tanpa ikon. */
export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn("flex items-center font-display text-[2rem] leading-none tracking-[0.01em] uppercase sm:text-[2.4rem]", className)}
    >
      IOT LAB
    </Link>
  )
}
