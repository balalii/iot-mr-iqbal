"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { QRCodeCanvas } from "qrcode.react"
import { Check, Copy, Download, ExternalLink, Printer } from "lucide-react"
import { toast } from "sonner"
import { useOrigin } from "./use-origin"

type Props = {
  slug: string
  groupName: string
  className_: string
  title?: string
  compact?: boolean
  className?: string
}

export function portalPath(slug: string) {
  return `/p/${slug}`
}

export function QrCard({ slug, groupName, className_, title, compact, className }: Props) {
  const origin = useOrigin()
  const url = origin ? `${origin}${portalPath(slug)}` : ""
  const holder = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link portal disalin.")
      setTimeout(() => setCopied(false), 1600)
    } catch {
      toast.error("Gagal menyalin. Salin manual dari kolom link.")
    }
  }

  /** Kartu PNG siap cetak dengan gaya yang sama: kepala biru, QR bergaris, kode portal. */
  function download() {
    const qr = holder.current?.querySelector("canvas")
    if (!qr) return
    const W = 720
    const H = 980
    const c = document.createElement("canvas")
    c.width = W
    c.height = H
    const ctx = c.getContext("2d")!
    // Pakai font halaman (Anton & JetBrains Mono dari next/font) agar PNG sama dengan tampilan.
    const css = getComputedStyle(document.documentElement)
    const display = css.getPropertyValue("--font-display").trim() || "sans-serif"
    const mono = css.getPropertyValue("--font-code").trim() || "monospace"
    ctx.fillStyle = "#faf8f3"
    ctx.fillRect(0, 0, W, H)
    ctx.lineWidth = 8
    ctx.strokeStyle = "#0d0d0d"
    ctx.strokeRect(4, 4, W - 8, H - 8)
    ctx.fillStyle = "#1238e8"
    ctx.fillRect(4, 4, W - 8, 170)
    ctx.beginPath()
    ctx.moveTo(4, 174)
    ctx.lineTo(W - 4, 174)
    ctx.stroke()
    ctx.fillStyle = "#ffffff"
    ctx.font = `64px ${display}`
    ctx.fillText(groupName.toUpperCase(), 44, 98, W - 88)
    ctx.font = `700 24px ${mono}`
    ctx.fillText(className_.toUpperCase(), 44, 144, W - 88)
    ctx.strokeRect(100, 230, W - 200, W - 200)
    ctx.drawImage(qr, 124, 254, W - 248, W - 248)
    ctx.fillStyle = "#0d0d0d"
    ctx.textAlign = "center"
    ctx.font = `44px ${display}`
    ctx.fillText("SCAN UNTUK LIHAT KARYA KAMI", W / 2, 820, W - 80)
    ctx.font = `500 22px ${mono}`
    ctx.fillText(url.replace(/^https?:\/\//, ""), W / 2, 870, W - 80)
    if (title) {
      ctx.fillStyle = "#4f4b43"
      ctx.font = `600 22px ${css.getPropertyValue("--font-body").trim() || "sans-serif"}`
      ctx.fillText(title, W / 2, 920, W - 80)
    }
    const a = document.createElement("a")
    a.download = `QR-${slug}.png`
    a.href = c.toDataURL("image/png")
    a.click()
  }

  const size = compact ? 176 : 212

  return (
    <div className={className}>
      <div className="border-[3px] border-ink bg-blue px-5 py-4 text-white">
        <p className="font-display text-[1.8rem] leading-none uppercase">QR portal</p>
        <p className="label mt-1.5 text-white/85">
          {groupName} · {className_}
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 border-[3px] border-t-0 border-ink bg-paper p-5">
        <div ref={holder} className="border-[3px] border-ink bg-white p-2.5">
          {url ? (
            <QRCodeCanvas value={url} size={size} marginSize={1} level="M" fgColor="#0d0d0d" bgColor="#ffffff" />
          ) : (
            <div className="animate-pulse bg-cream-deep" style={{ width: size, height: size }} />
          )}
        </div>

        <button
          type="button"
          onClick={copy}
          className="flex w-full items-center gap-2 border-[3px] border-ink bg-cream px-3 py-2 text-left font-mono text-[0.72rem] transition-colors hover:bg-sun"
          title="Salin link portal"
        >
          <span className="min-w-0 flex-1 truncate">{url ? url.replace(/^https?:\/\//, "") : "…"}</span>
          {copied ? <Check className="size-4 shrink-0" /> : <Copy className="size-4 shrink-0" />}
        </button>

        <div className="grid w-full grid-cols-3 border-[3px] border-ink">
          <button
            type="button"
            onClick={download}
            disabled={!url}
            className="label flex flex-col items-center gap-1.5 font-extrabold bg-sun py-3 transition-colors hover:bg-ink hover:text-white disabled:opacity-50"
          >
            <Download className="size-4" /> PNG
          </button>
          <Link
            href={`/cetak/${slug}`}
            target="_blank"
            className="label flex flex-col items-center gap-1.5 font-extrabold border-x-[3px] border-ink bg-paper py-3 transition-colors hover:bg-ink hover:text-white"
          >
            <Printer className="size-4" /> Cetak
          </Link>
          <Link
            href={portalPath(slug)}
            target="_blank"
            className="label flex flex-col items-center gap-1.5 font-extrabold bg-paper py-3 transition-colors hover:bg-ink hover:text-white"
          >
            <ExternalLink className="size-4" /> Buka
          </Link>
        </div>
      </div>
    </div>
  )
}
