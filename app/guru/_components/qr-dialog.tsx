"use client"

import { QrCode } from "lucide-react"
import { QrCard } from "@/components/site/qr-card"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function QrDialog(props: { slug: string; groupName: string; className_: string; title: string }) {
  return (
    <Dialog>
      <DialogTrigger
        aria-label={`Tampilkan QR ${props.groupName}`}
        className="grid w-12 place-items-center border-l-[3px] border-ink transition-colors hover:bg-sun"
      >
        <QrCode className="size-4" />
      </DialogTrigger>
      <DialogContent className="border-0 bg-transparent p-0 shadow-none sm:max-w-sm" showCloseButton={false}>
        <DialogTitle className="sr-only">QR {props.groupName}</DialogTitle>
        <QrCard {...props} className="shadow-brutal-xl" />
      </DialogContent>
    </Dialog>
  )
}
