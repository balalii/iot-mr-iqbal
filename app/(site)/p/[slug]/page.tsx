import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowDown, ArrowLeft, ArrowRight, Code2, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Cover } from '@/components/site/cover';
import { MarkerNote, Masthead } from '@/components/site/hero-motion';
import { MediaSlider } from '@/components/site/media-slider';
import { Photo } from '@/components/site/photo';
import { QrCard } from '@/components/site/qr-card';
import { TAG_COLORS } from '@/components/site/group-card';
import { getGroupBySlug } from '@/lib/data';
import { formatDate, initials, mediaThumb } from '@/lib/portal';
import { cn } from '@/lib/utils';

export async function generateMetadata({ params }: PageProps<'/p/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const g = await getGroupBySlug(slug);
  if (!g) return { title: 'Portal tidak ditemukan' };
  return {
    title: `${g.name} ${g.class_name}${g.project_title ? ` — ${g.project_title}` : ''}`,
    description: g.tagline || g.description.slice(0, 150),
  };
}

export default function PortalPage({ params }: PageProps<'/p/[slug]'>) {
  return (
    <Suspense fallback={<PortalSkeleton />}>
      <Portal params={params} />
    </Suspense>
  );
}

const SECTIONS = [
  { id: 'galeri', label: 'Galeri' },
  { id: 'anggota', label: 'Anggota' },
  { id: 'panduan', label: 'Cara pakai' },
  { id: 'remote', label: 'Remote' },
  { id: 'komponen', label: 'Komponen' },
];

async function Portal({ params }: { params: PageProps<'/p/[slug]'>['params'] }) {
  const { slug } = await params;
  const g = await getGroupBySlug(slug);
  if (!g) notFound();

  const cover = g.media.map(mediaThumb).find(Boolean) ?? null;
  const videos = g.media.filter((m) => m.kind !== 'image').length;
  const marker = g.tagline && g.tagline.length <= 44 ? g.tagline : null;
  const facts = [
    `${g.members.length} anggota`,
    `${g.components.length} komponen`,
    `${g.media.length} foto & video${videos ? ` · ${videos} video` : ''}`,
  ];

  return (
    <>
      {/* SAMPUL EDISI — satu bingkai dengan bar header */}
      <Cover
        masthead={
          <>
            <Link href="/#karya" className="label flex w-fit items-center gap-2 hover:underline">
              <ArrowLeft className="size-4" /> Semua karya
            </Link>
            <Masthead lines={g.name.split(/\s+/).slice(0, 3)} className="leading-[0.84]" />
            <p className="label flex items-end gap-4 tracking-[0.18em]">
              <span>
                {g.class_name}
                <br />
                Diperbarui {formatDate(g.updated_at)}
              </span>
              <span className="mb-[0.4em] h-[3px] w-10 shrink-0 bg-ink" aria-hidden />
            </p>
          </>
        }
        photo={
          <figure className="relative flex min-h-[340px] flex-1 flex-col overflow-hidden border-[3px] border-ink bg-blue sm:min-h-[460px] lg:min-h-0">
            <div className="relative flex-1">
              {cover ? (
                <Photo
                  src={cover}
                  alt={g.project_title || g.name}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <span className="label absolute inset-0 grid place-items-center text-white">
                  <span className="flex flex-col items-center gap-3">
                    <ImageOff className="size-8" /> Foto karya belum diunggah
                  </span>
                </span>
              )}
            </div>
            {marker && (
              <figcaption className="border-t-[3px] border-ink bg-blue px-5 py-3.5">
                <MarkerNote className="-rotate-[2deg] font-marker text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.05] text-sun">
                  {marker}
                </MarkerNote>
              </figcaption>
            )}
          </figure>
        }
        stampClassName="bg-green"
        stamp={
          <>
            <h2 className="text-[clamp(2.2rem,3.6vw,3.2rem)] leading-[0.92] break-words">
              {g.project_title || `Proyek ${g.name}`}
            </h2>
            <span className="mt-6 h-1 w-12 bg-ink" aria-hidden />
            <ul className="label mt-6 mb-8 space-y-1.5 text-[0.8rem] tracking-[0.06em]">
              {facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {g.remote_url ? (
              <Button variant="cta" size="lg" asChild className="mt-auto h-auto min-h-14 w-full justify-between px-5 py-3 text-left whitespace-normal">
                <a href={g.remote_url} target="_blank" rel="noopener noreferrer">
                  Buka kontrol remote <ArrowRight className="size-5" />
                </a>
              </Button>
            ) : (
              <Button variant="cta" size="lg" asChild className="mt-auto h-auto min-h-14 w-full justify-between px-5 py-3 text-left whitespace-normal">
                <a href="#galeri">
                  Lihat galeri <ArrowDown className="size-5" />
                </a>
              </Button>
            )}
          </>
        }
      />

      <div className="px-3 pb-6 sm:px-5">
        <div className="mx-auto max-w-[1400px]">
          {/* NAVIGASI BAGIAN */}
          <nav aria-label="Bagian portal" className="no-print sticky top-0 z-30 mt-6 bg-cream py-2">
            <div className="flex flex-wrap gap-[3px] border-[3px] border-ink bg-ink sm:w-fit">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="label flex h-11 grow items-center justify-center bg-paper px-4 transition-colors hover:bg-sun sm:grow-0 sm:px-6"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
            <div className="min-w-0 space-y-5 lg:space-y-8">
              <section id="galeri" className="scroll-mt-20">
                <MediaSlider items={g.media} />
              </section>

              {(g.description || g.how_it_works) && (
                <section className="grid grid-cols-1 border-[3px] border-ink bg-paper md:grid-cols-2">
                  {g.description && (
                    <div className="p-5 sm:p-7">
                      <h2 className="text-[2.2rem]">Tentang proyek</h2>
                      <p className="mt-3 max-w-[62ch] leading-relaxed whitespace-pre-line">{g.description}</p>
                    </div>
                  )}
                  {g.how_it_works && (
                    <div
                      className={cn(
                        'bg-blue p-5 text-white sm:p-7',
                        g.description && 'border-t-[3px] border-ink md:border-t-0 md:border-l-[3px]',
                      )}
                    >
                      <h2 className="text-[2.2rem] text-white">Cara kerja</h2>
                      <p className="mt-3 max-w-[62ch] leading-relaxed whitespace-pre-line">{g.how_it_works}</p>
                    </div>
                  )}
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <section id="remote" className="pop scroll-mt-20 border-[3px] border-ink bg-blue p-5 text-white sm:p-6">
                <h2 className="text-[2.3rem] text-white">Akses remote modul</h2>
                {g.remote_url ? (
                  <>
                    {g.remote_label && <span className="tag mt-3 bg-sun text-ink">{g.remote_label}</span>}
                    {g.remote_note && <p className="mt-3 leading-snug">{g.remote_note}</p>}
                    <Button variant="white" asChild className="mt-5 w-full justify-between">
                      <a href={g.remote_url} target="_blank" rel="noopener noreferrer">
                        Buka kontrol <ArrowRight />
                      </a>
                    </Button>
                  </>
                ) : (
                  <p className="mt-3">Link akses remote belum tersedia.</p>
                )}
              </section>

              <section id="komponen" className="brutal pop scroll-mt-20 p-5 sm:p-6">
                <h2 className="text-[2.3rem]">Komponen</h2>
                {g.components.length === 0 ? (
                  <p className="mt-3 text-muted-foreground">Belum ada daftar komponen.</p>
                ) : (
                  <ul className="mt-3">
                    {g.components.map((c, i) => (
                      <li
                        key={i}
                        className="flex gap-3 border-b-2 border-ink/15 py-2 text-[0.95rem] font-medium last:border-b-0"
                      >
                        <span className="mt-[0.45em] size-2 shrink-0 bg-blue" aria-hidden />
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
                {g.code_url && (
                  <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                    <a href={g.code_url} target="_blank" rel="noopener noreferrer">
                      <Code2 /> Lihat source code
                    </a>
                  </Button>
                )}
              </section>
            </aside>
          </div>

          <section id="anggota" className="mt-12 scroll-mt-20">
            <h2 className="mb-4 text-[clamp(2.4rem,5vw,3.4rem)]">Anggota kelompok</h2>
            {g.members.length === 0 ? (
              <Empty>Anggota belum ditambahkan.</Empty>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                {g.members.map((m, i) => (
                  <article key={m.id ?? i} className="brutal border-2 p-2">
                    <div className="relative aspect-[4/5] overflow-hidden bg-cream-deep">
                      {m.photo_url ? (
                        <Photo
                          src={m.photo_url}
                          alt={m.name}
                          fill
                          sizes="(min-width: 1024px) 260px, 45vw"
                          className="object-cover"
                        />
                      ) : (
                        <span className="grid size-full place-items-center font-display text-6xl">
                          {initials(m.name)}
                        </span>
                      )}
                      {m.role && (
                        <span
                          className={cn(
                            'tag absolute top-0 left-0 max-w-[calc(100%-0.75rem)] leading-[1.25]',
                            TAG_COLORS[i % TAG_COLORS.length],
                          )}
                        >
                          {m.role}
                        </span>
                      )}
                    </div>
                    <h3 className="px-1 pt-3 pb-1 text-[1.45rem] leading-[0.95] break-words">{m.name}</h3>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
            <section id="panduan" className="scroll-mt-20">
              <h2 className="mb-4 text-[clamp(2.4rem,5vw,3.4rem)]">Cara penggunaan</h2>
              {g.usage_steps.length === 0 ? (
                <Empty>Langkah penggunaan belum ditulis.</Empty>
              ) : (
                <ol className="grid grid-cols-1 gap-[3px] border-[3px] border-ink bg-ink md:grid-cols-2">
                  {g.usage_steps.map((s, i) => (
                    <li key={i} className="flex bg-paper">
                      <span className="grid w-14 shrink-0 place-items-start justify-center border-r-[3px] border-ink bg-blue pt-3 font-display text-4xl text-white sm:w-16 sm:text-5xl">
                        {i + 1}
                      </span>
                      <div className="min-w-0 p-4 sm:p-5">
                        {s.title && <h3 className="text-[1.6rem]">{s.title}</h3>}
                        {s.detail && <p className="mt-1.5 leading-relaxed">{s.detail}</p>}
                      </div>
                    </li>
                  ))}
                  {g.usage_steps.length % 2 === 1 && <li className="hidden bg-paper md:block" aria-hidden />}
                </ol>
              )}
            </section>
            <QrCard
              slug={g.slug}
              groupName={g.name}
              className_={g.class_name}
              title={g.project_title}
              compact
              className="no-print self-end"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="brutal p-6 text-center font-semibold text-muted-foreground">{children}</p>;
}

function PortalSkeleton() {
  return (
    <div className="px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 lg:grid-cols-3">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
