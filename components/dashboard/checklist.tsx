import { Check } from "lucide-react"
import { ProgressBar } from "@/components/site/progress-bar"
import type { Check as CheckItem } from "@/lib/portal"
import { cn } from "@/lib/utils"

export function Checklist({ checks, percent }: { checks: CheckItem[]; percent: number }) {
  return (
    <div className="brutal">
      <div className="flex items-end justify-between gap-3 border-b-[3px] border-ink p-5">
        <h2 className="text-[1.9rem]">Kelengkapan portal</h2>
        <span className="font-display text-[2.6rem] leading-none text-blue">{percent}%</span>
      </div>
      <div className="p-5">
        <ProgressBar value={percent} />
        <ul className="mt-4 space-y-2.5">
          {checks.map((c) => (
            <li key={c.key} className="flex items-center gap-3 text-sm font-medium">
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center border-[2.5px] border-ink",
                  c.done ? "bg-blue text-white" : "bg-paper"
                )}
              >
                {c.done && <Check className="size-3.5" strokeWidth={3.5} />}
              </span>
              <span>{c.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
