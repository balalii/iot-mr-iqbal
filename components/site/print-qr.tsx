"use client"

import { QRCodeSVG } from "qrcode.react"
import { useOrigin } from "./use-origin"

/** Kartu QR untuk dicetak & ditempel pada prototype. */
export function PrintQr({
  slug,
  groupName,
  className_,
  title,
  size = "md",
}: {
  slug: string
  groupName: string
  className_: string
  title: string
  size?: "md" | "lg"
}) {
  const origin = useOrigin()
  const url = origin ? `${origin}/p/${slug}` : ""
  const lg = size === "lg"
  const qr = lg ? 300 : 176
  return (
    <div className="break-inside-avoid border-[3px] border-ink bg-white">
      <div className="border-b-[3px] border-ink bg-blue px-4 py-3 text-white print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact]">
        <p className={lg ? "font-display text-5xl leading-none uppercase" : "font-display text-3xl leading-none uppercase"}>
          {groupName}
        </p>
        <p className="label mt-1.5">{className_}</p>
      </div>
      <div className="flex flex-col items-center px-4 pt-5 pb-4 text-center">
        <div className="border-[3px] border-ink p-2">
          {url ? (
            <QRCodeSVG value={url} size={qr} marginSize={1} level="M" fgColor="#0d0d0d" />
          ) : (
            <div style={{ width: qr, height: qr }} className="bg-cream-deep" />
          )}
        </div>
        <p className={lg ? "mt-5 font-display text-4xl leading-none uppercase" : "mt-4 font-display text-xl leading-none uppercase"}>
          Scan untuk lihat karya kami
        </p>
        {title && <p className="mt-2 line-clamp-2 text-xs font-semibold">{title}</p>}
        <p className="mt-2 max-w-full truncate font-mono text-[10px]">{url.replace(/^https?:\/\//, "")}</p>
      </div>
    </div>
  )
}
