"use client"

import { Fragment } from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"
import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const

// Nilai `initial` selalu sama di server & client (hindari hydration mismatch);
// preferensi reduced motion cukup membuat durasinya nol.
function useTiming(duration: number, delay: number) {
  const reduce = useReducedMotion()
  return reduce ? { duration: 0 } : { duration, ease: EASE, delay }
}

// Lebar rata-rata satu huruf Anton kapital ≈ 0.48em.
const ANTON_EM = 0.48

function fit(text: string[], max: number) {
  const longest = Math.max(...text.map((l) => l.length), 1)
  return Math.min(max, 97 / (longest * ANTON_EM)).toFixed(2)
}

/**
 * Masthead turun baris per baris seperti huruf cetak yang dipres ke kertas.
 * Ukuran huruf dihitung dari baris terpanjang agar memenuhi lebar selnya (container query).
 * `inlineOnMobile`: di layar kecil semua baris disambung jadi satu agar tidak memakan layar pertama.
 */
export function Masthead({
  lines,
  className,
  max = 72,
  inlineOnMobile = false,
}: {
  lines: string[]
  className?: string
  max?: number
  inlineOnMobile?: boolean
}) {
  const reduce = useReducedMotion()
  const desktop = fit(lines, max)
  const mobile = inlineOnMobile ? fit([lines.join(" ")], max) : desktop
  return (
    <div className="@container w-full">
      <h1
        className={cn("text-[length:var(--m)] lg:text-[length:var(--d)]", className)}
        style={
          {
            "--m": `${mobile}cqi`,
            "--d": `${desktop}cqi`,
          } as React.CSSProperties
        }
      >
        {lines.map((line, i) => (
          <Fragment key={i}>
            {inlineOnMobile && i > 0 && " "}
            <span className={cn("overflow-hidden pb-[0.04em]", inlineOnMobile ? "inline-block lg:block" : "block")}>
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.75, ease: EASE, delay: 0.08 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          </Fragment>
        ))}
      </h1>
    </div>
  )
}

/** Coretan spidol: muncul dengan sapuan clip-path dari kiri. */
export function MarkerNote({ delay = 0.7, ...props }: HTMLMotionProps<"p"> & { delay?: number }) {
  const transition = useTiming(0.9, delay)
  return (
    <motion.p
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={transition}
      {...props}
    />
  )
}
