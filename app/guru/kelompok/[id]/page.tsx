import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Checklist } from '@/components/dashboard/checklist';
import { GroupEditor } from '@/components/editor/group-editor';
import { QrCard } from '@/components/site/qr-card';
import { requireTeacher } from '@/lib/auth';
import { getClasses, getGroupById } from '@/lib/data';
import { completeness, formatDate, withCounts } from '@/lib/portal';
import { GroupSettings } from '../../_components/group-settings';

export const metadata: Metadata = { title: 'Kelola Kelompok' };

export default function ManageGroupPage({ params }: PageProps<'/guru/kelompok/[id]'>) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1400px] space-y-6">
          <Skeleton className="h-24 w-1/2" />
          <Skeleton className="h-[600px]" />
        </div>
      }
    >
      <ManageGroup params={params} />
    </Suspense>
  );
}

async function ManageGroup({ params }: { params: PageProps<'/guru/kelompok/[id]'>['params'] }) {
  await requireTeacher();
  const { id } = await params;
  const groupId = Number(id);
  if (!Number.isInteger(groupId)) notFound();
  const [group, classes] = await Promise.all([getGroupById(groupId), getClasses()]);
  if (!group) notFound();
  const { checks, percent } = completeness(withCounts(group));

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-8">
        <Link href="/guru" className="label mb-5 inline-flex items-center gap-2 hover:underline">
          <ArrowLeft className="size-4" /> Kembali ke dashboard
        </Link>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="min-w-0">
            <h1 className="text-[clamp(2.8rem,7vw,4.8rem)] leading-[0.88]">{group.project_title || group.name}</h1>
            <p className="label mt-3 text-muted-foreground">
              {group.name} · {group.class_name} · @{group.username} · Diperbarui {formatDate(group.updated_at)}
            </p>
          </div>
          <Button variant="default" asChild className="shrink-0">
            <Link href={`/p/${group.slug}`} target="_blank">
              Lihat portal <ExternalLink />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
        <div className="min-w-0">
          <GroupEditor group={group} />
        </div>
        <aside className="space-y-6">
          <Checklist checks={checks} percent={percent} />
          <QrCard slug={group.slug} groupName={group.name} className_={group.class_name} title={group.project_title} />
          <GroupSettings group={group} classes={classes} />
        </aside>
      </div>
    </div>
  );
}
