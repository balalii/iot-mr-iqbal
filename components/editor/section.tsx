"use client"

import { useTransition } from "react"
import { ArrowDown, ArrowUp, Loader2, Save, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { ActionResult } from "@/lib/validate"
import { cn } from "@/lib/utils"

export function EditorSection({
  title,
  description,
  dirty,
  onSave,
  children,
  extra,
}: {
  title: string
  description?: string
  dirty: boolean
  onSave: () => Promise<ActionResult>
  children: React.ReactNode
  extra?: React.ReactNode
}) {
  const [pending, start] = useTransition()

  const save = () =>
    start(async () => {
      const res = await onSave()
      if (res.ok) toast.success(res.message ?? "Tersimpan.")
      else toast.error(res.error)
    })

  return (
    <div className="brutal">
      <div className="border-b-[3px] border-ink p-5 sm:p-6">
        <h2 className="text-[clamp(2rem,4vw,2.6rem)]">{title}</h2>
        {description && <p className="mt-2 max-w-[65ch] text-sm">{description}</p>}
      </div>
      <div className="space-y-6 p-5 sm:p-6">{children}</div>
      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-3 border-t-[3px] border-ink bg-paper p-3 sm:px-6">
        {dirty && <span className="tag mr-auto bg-red text-white">Belum disimpan</span>}
        {extra}
        <Button onClick={save} disabled={pending || !dirty}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />}
          Simpan
        </Button>
      </div>
    </div>
  )
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="label block">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

/** Tombol naik/turun/hapus untuk item di daftar, digabung dalam satu blok bergaris. */
export function ItemTools({
  index,
  total,
  onMove,
  onRemove,
}: {
  index: number
  total: number
  onMove: (from: number, to: number) => void
  onRemove: () => void
}) {
  const base = "grid size-8 place-items-center transition-colors hover:bg-sun disabled:opacity-30 disabled:hover:bg-transparent"
  return (
    <div className="flex border-[2.5px] border-ink bg-paper">
      <button type="button" className={base} disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label="Naikkan">
        <ArrowUp className="size-4" />
      </button>
      <button
        type="button"
        className={cn(base, "border-x-[2.5px] border-ink")}
        disabled={index === total - 1}
        onClick={() => onMove(index, index + 1)}
        aria-label="Turunkan"
      >
        <ArrowDown className="size-4" />
      </button>
      <button type="button" className={cn(base, "hover:bg-red hover:text-white")} onClick={onRemove} aria-label="Hapus">
        <X className="size-4" />
      </button>
    </div>
  )
}

export function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}
