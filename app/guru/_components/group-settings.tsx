"use client"

import { useState, useTransition } from "react"
import { KeyRound, Loader2, Save, Shuffle, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteGroup, resetGroupPassword, updateGroupMeta } from "@/app/actions/teacher"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { ClassRow, GroupFull } from "@/lib/types"

function randomPassword() {
  const words = ["lampu", "relay", "sensor", "esp", "nyala", "watt", "volt", "cahaya"]
  const pick = words[Math.floor(Math.random() * words.length)]
  return `${pick}${Math.floor(100 + Math.random() * 900)}`
}

export function GroupSettings({ group, classes }: { group: GroupFull; classes: ClassRow[] }) {
  const [v, setV] = useState({
    classId: String(group.class_id),
    name: group.name,
    number: group.number,
    username: group.username ?? "",
    teacher_note: group.teacher_note,
  })
  const [pw, setPw] = useState("")
  const [pending, start] = useTransition()

  const save = () =>
    start(async () => {
      const res = await updateGroupMeta(group.id, { ...v, classId: Number(v.classId) })
      if (res.ok) toast.success(res.message)
      else toast.error(res.error)
    })

  const reset = () =>
    start(async () => {
      const res = await resetGroupPassword(group.id, pw)
      if (!res.ok) return void toast.error(res.error)
      toast.success(`${res.message} Password baru: ${pw}`, { duration: 10000 })
    })

  return (
    <div className="space-y-6">
      <div className="brutal space-y-4 p-5">
        <h2 className="text-[1.9rem]">Pengaturan kelompok</h2>
        <div className="grid grid-cols-[1fr_80px] gap-3">
          <Field label="Nama" htmlFor="s-name">
            <Input id="s-name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} maxLength={60} />
          </Field>
          <Field label="No." htmlFor="s-num">
            <Input id="s-num" type="number" min={1} max={99} value={v.number} onChange={(e) => setV({ ...v, number: Number(e.target.value) })} />
          </Field>
        </div>
        <Field label="Kelas">
          <Select value={v.classId} onValueChange={(classId) => setV({ ...v, classId })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Username login siswa" htmlFor="s-user">
          <Input id="s-user" value={v.username} onChange={(e) => setV({ ...v, username: e.target.value })} className="font-mono" maxLength={32} />
        </Field>
        <Field label="Catatan / feedback untuk kelompok" htmlFor="s-note" hint="Tampil di dashboard siswa.">
          <Textarea id="s-note" value={v.teacher_note} onChange={(e) => setV({ ...v, teacher_note: e.target.value })} rows={3} maxLength={1000} />
        </Field>
        <Button onClick={save} disabled={pending} className="w-full">
          {pending ? <Loader2 className="animate-spin" /> : <Save />} Simpan pengaturan
        </Button>
      </div>

      <div className="brutal space-y-3 p-5">
        <h2 className="flex items-center gap-2 text-[1.9rem]">
          <KeyRound className="size-5" /> Reset password siswa
        </h2>
        <div className="flex gap-2">
          <Input value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password baru" className="font-mono" />
          <Button variant="outline" size="icon" className="shrink-0" onClick={() => setPw(randomPassword())} aria-label="Buat password acak">
            <Shuffle />
          </Button>
        </div>
        <Button variant="sun" onClick={reset} disabled={pending || pw.length < 6} className="w-full">
          Ganti password
        </Button>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full">
            <Trash2 /> Hapus kelompok
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[2.2rem]">Hapus {group.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Akun siswa, anggota, galeri, dan portal kelompok ini akan dihapus permanen. QR yang sudah dicetak tidak bisa
              dibuka lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Batal</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() =>
                  start(async () => {
                    const res = await deleteGroup(group.id)
                    if (res && !res.ok) toast.error(res.error)
                  })
                }
              >
                <Trash2 /> Hapus permanen
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
