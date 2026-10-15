"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Loader2, MoreHorizontal, Pencil, Plus, Printer, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { createClass, createGroup, deleteClass, renameClass } from "@/app/actions/teacher"
import { Field } from "@/components/editor/section"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { ActionResult } from "@/lib/validate"

function useAction() {
  const [pending, start] = useTransition()
  const run = (fn: () => Promise<ActionResult>, onOk?: () => void) =>
    start(async () => {
      const res = await fn()
      if (!res.ok) return void toast.error(res.error)
      toast.success(res.message ?? "Berhasil!")
      onOk?.()
    })
  return { pending, run }
}

export function AddClassDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const { pending, run } = useAction()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="sun">
          <Plus /> Tambah kelas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[2.2rem]">Kelas baru</DialogTitle>
          <DialogDescription>Contoh: XI TJKT 4. Setelah itu tambahkan kelompok di kelas tersebut.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            run(() => createClass(name), () => {
              setName("")
              setOpen(false)
            })
          }}
        >
          <Field label="Nama kelas" htmlFor="cname">
            <Input id="cname" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} required autoFocus />
          </Field>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="animate-spin" />} Simpan kelas
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ClassMenu({ id, name, slug, groupCount }: { id: number; name: string; slug: string; groupCount: number }) {
  const [renameOpen, setRenameOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [value, setValue] = useState(name)
  const { pending, run } = useAction()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon-sm" aria-label={`Menu kelas ${name}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/cetak?kelas=${slug}`} target="_blank">
              <Printer /> Cetak QR kelas ini
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
            <Pencil /> Ganti nama
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
            <Trash2 /> Hapus kelas
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[2.2rem]">Ganti nama kelas</DialogTitle>
            <DialogDescription>URL portal kelompok yang sudah dicetak tidak berubah.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              run(() => renameClass(id, value), () => setRenameOpen(false))
            }}
          >
            <Input value={value} onChange={(e) => setValue(e.target.value)} maxLength={40} required autoFocus />
            <Button type="submit" className="w-full" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />} Simpan
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[2.2rem]">Hapus {name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {groupCount} kelompok beserta akun siswa, anggota, dan galerinya akan ikut terhapus permanen. QR yang sudah
              dicetak tidak akan bisa dibuka lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Batal</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={() => run(() => deleteClass(id))}>
                <Trash2 /> Hapus permanen
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function AddGroupDialog({ classId, className_, classSlug, nextNumber }: { classId: number; className_: string; classSlug: string; nextNumber: number }) {
  const prefix = classSlug.replace(/^xi-/, "").replace(/-/g, "")
  const defaults = () => ({
    name: `Kelompok ${nextNumber}`,
    number: nextNumber,
    username: `${prefix}-k${nextNumber}`,
    password: "",
  })
  const [open, setOpen] = useState(false)
  const [v, setV] = useState(defaults)
  const { pending, run } = useAction()

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) setV(defaults())
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus /> Kelompok
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[2.2rem]">Kelompok baru · {className_}</DialogTitle>
          <DialogDescription>Akun login ini dipakai bersama oleh anggota kelompok untuk mengunggah data.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            run(() => createGroup({ classId, ...v }), () => setOpen(false))
          }}
        >
          <div className="grid grid-cols-[1fr_90px] gap-3">
            <Field label="Nama kelompok" htmlFor="gname">
              <Input id="gname" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} maxLength={60} required />
            </Field>
            <Field label="No." htmlFor="gnum">
              <Input id="gnum" type="number" min={1} max={99} value={v.number} onChange={(e) => setV({ ...v, number: Number(e.target.value) })} required />
            </Field>
          </div>
          <Field label="Username siswa" htmlFor="guser" hint="Huruf kecil, angka, titik, - atau _.">
            <Input id="guser" value={v.username} onChange={(e) => setV({ ...v, username: e.target.value })} maxLength={32} required className="font-mono" />
          </Field>
          <Field label="Password siswa" htmlFor="gpass" hint="Minimal 6 karakter. Catat & bagikan ke kelompok.">
            <Input id="gpass" value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} minLength={6} required className="font-mono" />
          </Field>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="animate-spin" />} Buat kelompok & akun
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
