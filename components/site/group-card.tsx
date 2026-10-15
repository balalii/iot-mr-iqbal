import Link from "next/link"
import { ArrowRight, ImageOff } from "lucide-react"
import type { GroupSummary } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Photo } from "./photo"

// Warna blok tag bergiliran seperti kategori di sampul majalah.
export const TAG_COLORS = ["bg-blue text-white", "bg-sun text-ink", "bg-red text-white", "bg-blue text-white"]

/** Kartu kelompok; label di pojok foto menunjukkan kelasnya. */
export function GroupCard({ group, colorIndex = 0 }: { group: GroupSummary; colorIndex?: number }) {
  return (
    <Link
      href={`/p/${group.slug}`}
      className="brutal brutal-lift group/card flex h-full flex-col border-2 p-2.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-deep">
        {group.cover ? (
          <Photo
            src={group.cover}
            alt={group.project_title || group.name}
            fill
            sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 100vw"
            className="object-cover grayscale-[15%] transition-[transform,filter] duration-500 group-hover/card:scale-[1.04] group-hover/card:grayscale-0"
          />
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground">
            <span className="label flex flex-col items-center gap-2">
              <ImageOff className="size-7" /> Belum ada foto
            </span>
          </div>
        )}
        <span className={cn("tag absolute top-0 left-0", TAG_COLORS[colorIndex % TAG_COLORS.length])}>
          {group.class_name}
        </span>
        {group.demo && <span className="tag absolute right-0 bottom-0 bg-ink text-sun">Data contoh</span>}
      </div>
      <div className="flex flex-1 flex-col px-1.5 pt-3.5 pb-1">
        <h3 className="line-clamp-3 text-[1.55rem] leading-[0.98]">
          {group.project_title || "Proyek belum diberi judul"}
        </h3>
        {group.tagline && <p className="mt-2 line-clamp-2 text-sm leading-snug">{group.tagline}</p>}
        <span className="label mt-auto flex items-center justify-between gap-3 pt-5 font-extrabold">
          <span className="min-w-0 truncate">{group.name}</span>
          <ArrowRight className="size-4 shrink-0 transition-transform group-hover/card:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
