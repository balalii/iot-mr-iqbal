import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-3 sm:p-5">
      <div className="grid w-full max-w-4xl grid-cols-1 border-[3px] border-ink bg-paper md:grid-cols-[1fr_1.1fr]">
        <div className="relative border-b-[3px] border-ink bg-blue p-6 text-white md:border-r-[3px] md:border-b-0">
          <p className="font-display text-[clamp(7rem,22vw,11rem)] leading-[0.8]">404</p>
          <p aria-hidden className="absolute right-6 bottom-6 -rotate-[8deg] font-marker text-3xl text-sun">
            lampunya mati
          </p>
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <h1 className="text-[clamp(2.4rem,5vw,3.4rem)]">Halaman tidak ditemukan</h1>
          <p className="mt-3">
            Portal kelompok atau halaman yang kamu cari tidak ada. Periksa lagi kode di bawah QR, atau lihat semua
            karya.
          </p>
          <Button variant="default" asChild className="mt-6 w-full justify-between sm:w-fit">
            <Link href="/#karya">
              Lihat semua karya <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
