import { Photo } from "./photo"
import { initials } from "@/lib/portal"
import type { Member } from "@/lib/types"
import { cn } from "@/lib/utils"

export function MemberAvatar({ member, className }: { member: Member; className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-9 shrink-0 place-items-center overflow-hidden border-2 border-ink bg-sun font-mono text-[0.7rem] font-bold",
        className
      )}
      title={member.name}
    >
      {member.photo_url ? (
        <Photo src={member.photo_url} alt={member.name} fill sizes="64px" className="object-cover" />
      ) : (
        initials(member.name)
      )}
    </span>
  )
}

export function AvatarStack({ members, max = 4 }: { members: Member[]; max?: number }) {
  if (members.length === 0) return <span className="label text-muted-foreground">Belum ada anggota</span>
  const shown = members.slice(0, max)
  return (
    <div className="flex items-center">
      {shown.map((m, i) => (
        <MemberAvatar key={m.id ?? i} member={m} className={i > 0 ? "-ml-2" : ""} />
      ))}
      {members.length > max && (
        <span className="-ml-2 grid size-9 place-items-center border-2 border-ink bg-sun font-mono text-[0.7rem] font-bold">
          +{members.length - max}
        </span>
      )}
    </div>
  )
}
