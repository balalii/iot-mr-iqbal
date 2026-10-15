"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const color = value >= 100 ? "bg-blue" : value >= 50 ? "bg-sun" : "bg-red"
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-3.5 w-full overflow-hidden border-[3px] border-ink bg-paper", className)}
    >
      <motion.div
        className={cn("h-full", color, value > 0 && value < 100 && "border-r-[3px] border-ink")}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      />
    </div>
  )
}
