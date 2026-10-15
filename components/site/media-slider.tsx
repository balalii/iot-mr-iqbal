"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ArrowLeft, ArrowRight, ImageOff, Play } from "lucide-react"
import { mediaThumb, youtubeId } from "@/lib/portal"
import type { MediaItem } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Photo } from "./photo"

/** Slider foto & video proyek dengan autoplay (berhenti saat video diputar). */
export function MediaSlider({ items }: { items: MediaItem[] }) {
  const [autoplay] = useState(() => Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }))
  const [emblaRef, embla] = useEmblaCarousel({ loop: items.length > 1, align: "center" }, [autoplay])
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState<number | null>(null)

  const onSelect = useCallback(() => {
    if (!embla) return
    setIndex(embla.selectedScrollSnap())
    setPlaying(null)
  }, [embla])

  useEffect(() => {
    if (!embla) return
    embla.on("select", onSelect)
    return () => {
      embla.off("select", onSelect)
    }
  }, [embla, onSelect])

  const play = (i: number) => {
    autoplay.stop()
    setPlaying(i)
  }

  if (items.length === 0) {
    return (
      <div className="brutal grid aspect-video place-items-center p-6 text-center">
        <p className="label flex flex-col items-center gap-3 text-muted-foreground">
          <ImageOff className="size-8" /> Galeri foto & video belum diunggah
        </p>
      </div>
    )
  }

  const current = items[index]

  return (
    <div>
      <div className="relative overflow-hidden border-[3px] border-ink bg-ink">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {items.map((item, i) => (
              <div key={item.id ?? i} className="relative aspect-[4/3] min-w-0 shrink-0 grow-0 basis-full sm:aspect-video">
                <Slide item={item} first={i === 0} active={playing === i} onPlay={() => play(i)} />
              </div>
            ))}
          </div>
        </div>
        <span className="tag pointer-events-none absolute top-0 left-0 bg-sun text-ink">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
      </div>

      {/* Bilah keterangan + kontrol, menempel di bawah bingkai */}
      <div className="flex border-[3px] border-t-0 border-ink bg-paper">
        <p className="min-w-0 flex-1 truncate px-4 py-3 text-sm font-medium">
          {current?.caption || (current?.kind === "image" ? "Foto proyek" : "Video proyek")}
        </p>
        {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Sebelumnya"
              onClick={() => embla?.scrollPrev()}
              className="grid w-12 place-items-center border-l-[3px] border-ink transition-colors hover:bg-sun"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Berikutnya"
              onClick={() => embla?.scrollNext()}
              className="grid w-12 place-items-center border-l-[3px] border-ink bg-blue text-white transition-colors hover:bg-blue-deep"
            >
              <ArrowRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {items.map((item, i) => {
            const thumb = mediaThumb(item)
            return (
              <button
                key={item.id ?? i}
                type="button"
                onClick={() => embla?.scrollTo(i)}
                aria-label={`Tampilkan slide ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "relative aspect-video w-24 shrink-0 overflow-hidden border-[3px] border-ink bg-ink transition-opacity sm:w-28",
                  i === index ? "outline-3 outline-offset-2 outline-blue" : "opacity-60 hover:opacity-100"
                )}
              >
                {thumb ? (
                  <Photo src={thumb} alt="" fill sizes="112px" className="object-cover" />
                ) : (
                  <video src={item.url} muted preload="metadata" className="size-full object-cover" />
                )}
                {item.kind !== "image" && (
                  <span className="absolute inset-0 grid place-items-center bg-ink/35">
                    <Play className="size-5 fill-white text-white" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Slide({ item, first, active, onPlay }: { item: MediaItem; first: boolean; active: boolean; onPlay: () => void }) {
  if (item.kind === "image") {
    return (
      <Photo
        src={item.url}
        alt={item.caption || "Foto proyek"}
        fill
        loading={first ? "eager" : undefined}
        sizes="(min-width: 1024px) 900px, 100vw"
        className="object-cover"
      />
    )
  }
  if (item.kind === "video") {
    return <video src={item.url} controls playsInline preload="metadata" onPlay={onPlay} className="size-full bg-ink object-contain" />
  }
  const id = youtubeId(item.url)
  if (!id) return null
  if (active) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={item.caption || "Video proyek"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 size-full"
      />
    )
  }
  return (
    <button type="button" onClick={onPlay} className="group/play absolute inset-0" aria-label={`Putar video: ${item.caption || "video proyek"}`}>
      <Photo src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes="100vw" className="object-cover" />
      <span className="label absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 border-[3px] border-ink bg-red px-5 py-3.5 text-[0.85rem] text-ink transition-transform group-hover/play:-translate-y-[calc(50%+3px)] group-hover/play:shadow-brutal">
        <Play className="size-5 fill-ink" /> Putar video
      </span>
    </button>
  )
}
