export type Role = "teacher" | "student"

export type SessionUser = {
  id: number
  username: string
  name: string
  role: Role
  groupId: number | null
}

export type ClassRow = {
  id: number
  name: string
  slug: string
  sort: number
}

export type UsageStep = { title: string; detail: string }

export type Member = {
  id?: number
  name: string
  role: string
  photo_url: string
}

export type MediaKind = "image" | "video" | "youtube"

export type MediaItem = {
  id?: number
  kind: MediaKind
  url: string
  caption: string
}

export type Group = {
  id: number
  class_id: number
  class_name: string
  class_slug: string
  number: number
  name: string
  slug: string
  project_title: string
  tagline: string
  description: string
  how_it_works: string
  components: string[]
  usage_steps: UsageStep[]
  remote_url: string
  remote_label: string
  remote_note: string
  code_url: string
  teacher_note: string
  updated_at: string
}

export type GroupFull = Group & {
  members: Member[]
  media: MediaItem[]
  username: string | null
  /** Masih memakai foto stok dari data contoh (seed). */
  demo: boolean
}

export type GroupSummary = Group & {
  members: Member[]
  cover: string | null
  media_count: number
  video_count: number
  username: string | null
  demo: boolean
}
