import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Cover } from '@/components/site/cover';
import { MarkerNote, Masthead } from '@/components/site/hero-motion';
import { Photo } from '@/components/site/photo';
import { Gallery } from './gallery';

// Foto kit Arduino berlatar biru (Unsplash, placeholder sampai ada foto karya asli).
const HERO_PHOTO = 'https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?w=1800&q=80&auto=format&fit=crop';

export default function HomePage() {
  return (
    <>
      {/* SAMPUL — satu bingkai dengan bar header */}
      <Cover
        masthead={
          <>
            <Masthead lines={['IOT', 'LAB']} inlineOnMobile className="leading-[0.86]" />
            <span className="h-[3px] w-12 bg-ink" aria-hidden />
          </>
        }
        photo={
          <figure className="relative min-h-[320px] flex-1 overflow-hidden border-[3px] border-ink bg-blue sm:min-h-[460px] lg:min-h-0">
            <Photo
              src={HERO_PHOTO}
              alt="Papan Arduino, modul relay, dan komponen elektronik di atas meja biru"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <MarkerNote
              aria-hidden
              className="absolute top-[9%] right-[7%] -rotate-[9deg] font-marker text-[clamp(1.9rem,4.4vw,3rem)] leading-[0.92] text-red [text-shadow:0_1px_0_rgba(255,255,255,.35)]"
            >
              Sensor
              <br />
              Ide
              <br />
              Nyala
              <br />
              Selalu
            </MarkerNote>
          </figure>
        }
        stampClassName="bg-blue text-white"
        stamp={
          <>
            <span className="h-1 w-12 bg-white" aria-hidden />
            <p className="mt-10 font-display text-[2.5rem] leading-[0.92] text-white uppercase lg:mt-auto lg:text-[clamp(2.1rem,3vw,2.8rem)]">
              Internet Of Things
            </p>
          </>
        }
      />

      {/* KARYA — semua kelompok dalam satu grid; kolom samping sejajar panel sampul (22rem) */}
      <section id="karya" aria-labelledby="karya-judul" className="scroll-mt-4 px-3 pt-5 pb-5 sm:px-5 sm:pb-8">
        <h2 id="karya-judul" className="sr-only">
          Karya kelompok
        </h2>
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-4">
          <div className="min-w-0">
            <Suspense fallback={<GallerySkeleton />}>
              <Gallery />
            </Suspense>
          </div>
          <aside>
            <div className="space-y-6 xl:sticky xl:top-6">
              <figure className="pop border-[3px] border-ink bg-green p-5 sm:p-6">
                <blockquote className="font-display text-[1.9rem] leading-[1] uppercase">
                  “Lampu yang pintar dimulai dari ide yang kita nyalakan sendiri.”
                </blockquote>
                <figcaption className="label mt-5 flex items-center gap-3">
                  <span className="h-[3px] w-8 bg-ink" aria-hidden /> IOT LAB
                </figcaption>
              </figure>
              <p className="pop border-[3px] border-ink bg-blue px-5 py-6 font-display text-[clamp(3.4rem,5vw,4.6rem)] leading-[0.9] text-white uppercase sm:px-6">
                “Respect”
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-96 border-2 border-ink/15" />
      ))}
    </div>
  );
}
