import { MarkerNote, Masthead } from "@/components/site/hero-motion"
import { SITE } from "@/lib/site"

export function LoginArt() {
  return (
    <section className="relative hidden flex-col justify-between border-[3px] border-ink bg-blue p-8 text-white lg:flex xl:p-10">
      <div className="flex items-start justify-between gap-6">
        <span className="font-display text-[2.4rem] leading-none uppercase">IOT LAB</span>
        <p className="label text-right text-[0.66rem] text-white/85">
          Kelas {SITE.subject}
          <br />
          {SITE.teacher}
        </p>
      </div>
      <div className="relative">
        <Masthead lines={["Nyalakan", "idemu."]} className="leading-[0.92] text-white" />
        <MarkerNote
          aria-hidden
          className="absolute -top-24 right-2 -rotate-[8deg] font-marker text-[2.4rem] leading-[0.95] text-sun"
        >
          karya
          <br />
          siswa!
        </MarkerNote>
      </div>
      <p className="label max-w-sm text-white/85">
        Guru menyiapkan kelompok. Siswa mengisi data karya. Pengunjung scan QR di prototype.
      </p>
    </section>
  )
}
