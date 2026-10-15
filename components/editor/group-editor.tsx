'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BookOpen,
  Camera,
  Film,
  ImagePlus,
  Images,
  Link2,
  ListChecks,
  Loader2,
  Plus,
  Radio,
  Upload,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { saveGuide, saveMedia, saveMembers, saveProjectInfo, saveRemote } from '@/app/actions/group';
import { Photo } from '@/components/site/photo';
import { initials, mediaThumb, youtubeId } from '@/lib/portal';
import type { GroupFull, MediaItem, Member, UsageStep } from '@/lib/types';
import { cn } from '@/lib/utils';
import { EditorSection, Field, ItemTools, move } from './section';
import { uploadFile } from './upload';

type Key = 'info' | 'members' | 'media' | 'guide' | 'remote';

const TABS: { key: Key; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'info', label: 'Info Proyek', icon: BookOpen },
  { key: 'members', label: 'Anggota', icon: Users },
  { key: 'media', label: 'Galeri', icon: Images },
  { key: 'guide', label: 'Panduan', icon: ListChecks },
  { key: 'remote', label: 'Remote', icon: Radio },
];

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function GroupEditor({ group }: { group: GroupFull }) {
  const [dirty, setDirty] = useState<Record<Key, boolean>>({
    info: false,
    members: false,
    media: false,
    guide: false,
    remote: false,
  });
  const mark = (k: Key) => (v: boolean) => setDirty((d) => (d[k] === v ? d : { ...d, [k]: v }));
  const anyDirty = Object.values(dirty).some(Boolean);

  useEffect(() => {
    if (!anyDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [anyDirty]);

  return (
    <Tabs defaultValue="info" className="gap-5">
      <div className="-mx-4 overflow-x-auto px-4 pt-1 pb-2 sm:mx-0 sm:px-0">
        <TabsList className="w-max">
          {TABS.map(({ key, label, icon: Icon }) => (
            <TabsTrigger key={key} value={key} className="relative px-3 sm:px-4">
              <Icon /> {label}
              {dirty[key] && (
                <span
                  className="absolute top-1.5 right-1.5 size-2.5 bg-red ring-2 ring-ink"
                  aria-label="belum disimpan"
                />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value="info" forceMount className="data-[state=inactive]:hidden">
        <InfoSection group={group} onDirty={mark('info')} />
      </TabsContent>
      <TabsContent value="members" forceMount className="data-[state=inactive]:hidden">
        <MembersSection group={group} onDirty={mark('members')} />
      </TabsContent>
      <TabsContent value="media" forceMount className="data-[state=inactive]:hidden">
        <MediaSection group={group} onDirty={mark('media')} />
      </TabsContent>
      <TabsContent value="guide" forceMount className="data-[state=inactive]:hidden">
        <GuideSection group={group} onDirty={mark('guide')} />
      </TabsContent>
      <TabsContent value="remote" forceMount className="data-[state=inactive]:hidden">
        <RemoteSection group={group} onDirty={mark('remote')} />
      </TabsContent>
    </Tabs>
  );
}

type SectionProps = { group: GroupFull; onDirty: (v: boolean) => void };

function useDirty(value: unknown, initial: unknown, onDirty: (v: boolean) => void) {
  const d = !same(value, initial);
  useEffect(() => onDirty(d), [d, onDirty]);
  return d;
}

/* ───────────────────────── INFO ───────────────────────── */

function InfoSection({ group, onDirty }: SectionProps) {
  const initial = {
    project_title: group.project_title,
    tagline: group.tagline,
    description: group.description,
    how_it_works: group.how_it_works,
    code_url: group.code_url,
  };
  const [v, setV] = useState(initial);
  const dirty = useDirty(v, initial, onDirty);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  return (
    <EditorSection
      title="Info proyek"
      description="Judul, ringkasan, dan penjelasan cara kerja prototype kalian."
      dirty={dirty}
      onSave={() => saveProjectInfo(group.id, v)}
    >
      <Field label="Judul proyek" htmlFor="title">
        <Input
          id="title"
          value={v.project_title}
          onChange={set('project_title')}
          maxLength={120}
          placeholder="mis. LumiSense — Lampu Pintar Sensor Cahaya"
        />
      </Field>
      <Field label="Tagline singkat" htmlFor="tagline" hint="Satu kalimat yang bikin orang penasaran.">
        <Input
          id="tagline"
          value={v.tagline}
          onChange={set('tagline')}
          maxLength={160}
          placeholder="Lampu menyala sendiri saat hari mulai gelap."
        />
      </Field>
      <Field
        label="Deskripsi proyek"
        htmlFor="desc"
        hint="Minimal 30 karakter. Ceritakan masalah yang diselesaikan & fitur utamanya."
      >
        <Textarea id="desc" value={v.description} onChange={set('description')} rows={5} maxLength={4000} />
      </Field>
      <Field
        label="Cara kerja sistem"
        htmlFor="how"
        hint="Jelaskan alur sensor → mikrokontroler → relay → lampu → aplikasi."
      >
        <Textarea id="how" value={v.how_it_works} onChange={set('how_it_works')} rows={5} maxLength={4000} />
      </Field>
      <Field label="Link source code (opsional)" htmlFor="code" hint="GitHub, Google Drive, atau Wokwi.">
        <Input id="code" type="url" value={v.code_url} onChange={set('code_url')} placeholder="https://github.com/…" />
      </Field>
    </EditorSection>
  );
}

/* ───────────────────────── ANGGOTA ───────────────────────── */

const ROLE_PRESETS = ['Ketua', 'Programmer', 'Perakit Hardware', 'Desain Miniatur', 'Dokumentasi'];
const AVATAR_BG = ['bg-sun', 'bg-cream-deep'];

function MembersSection({ group, onDirty }: SectionProps) {
  const initial = group.members.map(({ name, role, photo_url }) => ({ name, role, photo_url }));
  const [list, setList] = useState<Member[]>(initial);
  const dirty = useDirty(list, initial, onDirty);
  const update = (i: number, patch: Partial<Member>) =>
    setList((l) => l.map((m, j) => (j === i ? { ...m, ...patch } : m)));

  return (
    <EditorSection
      title="Anggota kelompok"
      description="Tambahkan nama, peran, dan foto setiap anggota. Foto ideal: persegi, wajah terlihat jelas."
      dirty={dirty}
      onSave={() => saveMembers(group.id, list)}
      extra={
        <Button
          variant="outline"
          size="lg"
          onClick={() => setList((l) => [...l, { name: '', role: '', photo_url: '' }])}
          disabled={list.length >= 12}
        >
          <UserPlus /> Tambah anggota
        </Button>
      }
    >
      {list.length === 0 && (
        <p className="border-[3px] border-dashed border-ink/40 p-8 text-center font-semibold text-muted-foreground">
          Belum ada anggota. Klik “Tambah anggota”.
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <AnimatePresence initial={false}>
          {list.map((m, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-4 border-[3px] border-ink bg-cream p-3"
            >
              <PhotoPicker
                groupId={group.id}
                url={m.photo_url}
                fallback={initials(m.name || '?')}
                bg={AVATAR_BG[i % AVATAR_BG.length]}
                onChange={(url) => update(i, { photo_url: url })}
              />
              <div className="min-w-0 flex-1 space-y-2">
                <Input
                  value={m.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                  placeholder="Nama lengkap"
                  maxLength={80}
                  className="h-10"
                />
                <Input
                  value={m.role}
                  onChange={(e) => update(i, { role: e.target.value })}
                  placeholder="Peran / tugas"
                  maxLength={60}
                  list="role-presets"
                  className="h-10"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">#{i + 1}</span>
                  <ItemTools
                    index={i}
                    total={list.length}
                    onMove={(a, b) => setList((l) => move(l, a, b))}
                    onRemove={() => setList((l) => l.filter((_, j) => j !== i))}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <datalist id="role-presets">
        {ROLE_PRESETS.map((r) => (
          <option key={r} value={r} />
        ))}
      </datalist>
    </EditorSection>
  );
}

function PhotoPicker({
  groupId,
  url,
  fallback,
  bg,
  onChange,
}: {
  groupId: number;
  url: string;
  fallback: string;
  bg: string;
  onChange: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  async function pick(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Pilih file gambar (JPG/PNG/WEBP).');
    setProgress(0);
    try {
      const res = await uploadFile(groupId, file, setProgress);
      onChange(res.url);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProgress(null);
      if (ref.current) ref.current.value = '';
    }
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={cn('group/pp relative size-24 overflow-hidden border-[3px] border-ink sm:size-28', bg)}
        aria-label="Unggah foto anggota"
      >
        {url ? (
          <Photo src={url} alt="" fill sizes="112px" className="object-cover" />
        ) : (
          <span className="font-display text-4xl">{fallback}</span>
        )}
        <span className="absolute inset-0 grid place-items-center bg-ink/50 text-white opacity-0 transition-opacity group-hover/pp:opacity-100">
          <Camera className="size-6" />
        </span>
        {progress !== null && (
          <span className="absolute inset-0 grid place-items-center bg-ink/70 font-mono text-sm font-bold text-white">
            {progress}%
          </span>
        )}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      {url && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="label text-[0.62rem] text-muted-foreground underline-offset-2 hover:text-red hover:underline"
        >
          Hapus foto
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── GALERI ───────────────────────── */

function MediaSection({ group, onDirty }: SectionProps) {
  const initial = group.media.map(({ kind, url, caption }) => ({ kind, url, caption }));
  const [list, setList] = useState<MediaItem[]>(initial);
  const dirty = useDirty(list, initial, onDirty);
  const [uploads, setUploads] = useState<{ name: string; pct: number }[]>([]);
  const [yt, setYt] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const arr = Array.from(files).slice(0, 10);
    setUploads(arr.map((f) => ({ name: f.name, pct: 0 })));
    for (const [i, f] of arr.entries()) {
      try {
        const res = await uploadFile(group.id, f, (pct) =>
          setUploads((u) => u.map((x, j) => (j === i ? { ...x, pct } : x))),
        );
        setList((l) => [...l, { kind: res.kind, url: res.url, caption: '' }]);
      } catch (e) {
        toast.error((e as Error).message);
      }
    }
    setUploads([]);
    if (fileRef.current) fileRef.current.value = '';
  }

  function addYoutube() {
    if (!youtubeId(yt.trim())) return toast.error('Tempel link YouTube yang valid, mis. https://youtu.be/xxxx');
    setList((l) => [...l, { kind: 'youtube', url: yt.trim(), caption: '' }]);
    setYt('');
  }

  return (
    <EditorSection
      title="Galeri foto & video"
      description="Item pertama menjadi sampul. Foto maks. 8 MB, video maks. 80 MB (MP4/WEBM/MOV), atau tempel link YouTube."
      dirty={dirty}
      onSave={() => saveMedia(group.id, list)}
    >
      <div className="grid gap-3 md:grid-cols-[1fr_1.2fr]">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
          disabled={uploads.length > 0}
          className="flex min-h-32 flex-col items-center justify-center gap-2 border-[3px] border-dashed border-ink bg-cream p-4 text-center transition-colors hover:bg-sun"
        >
          {uploads.length > 0 ? <Loader2 className="size-7 animate-spin" /> : <Upload className="size-7" />}
          <span className="label">Unggah foto / video</span>
          <span className="text-xs text-muted-foreground">Klik atau seret file ke sini (bisa banyak sekaligus)</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <div className="flex flex-col justify-center gap-2 border-[3px] border-ink bg-paper p-4">
          <span className="label flex items-center gap-2">
            <Film className="size-4" /> Tambah video YouTube
          </span>
          <div className="flex gap-2">
            <Input
              value={yt}
              onChange={(e) => setYt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addYoutube()}
              placeholder="https://youtu.be/…"
              className="h-10"
            />
            <Button onClick={addYoutube} variant="sun" className="h-10">
              <Plus /> Tambah
            </Button>
          </div>
        </div>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((u, i) => (
            <div key={i} className="flex items-center gap-3 text-xs font-semibold">
              <span className="w-40 truncate">{u.name}</span>
              <div className="h-3 flex-1 overflow-hidden border-2 border-ink bg-paper">
                <div className="h-full bg-blue transition-[width]" style={{ width: `${u.pct}%` }} />
              </div>
              <span className="w-10 text-right font-mono">{u.pct}%</span>
            </div>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <p className="border-[3px] border-dashed border-ink/40 p-8 text-center font-semibold text-muted-foreground">
          <ImagePlus className="mx-auto mb-2 size-8" /> Galeri masih kosong.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {list.map((m, i) => {
              const thumb = mediaThumb(m);
              return (
                <motion.div
                  key={m.url + i}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="overflow-hidden border-[3px] border-ink bg-paper"
                >
                  <div className="relative aspect-video border-b-2 border-ink bg-ink">
                    {thumb ? (
                      <Photo src={thumb} alt="" fill sizes="320px" className="object-cover" />
                    ) : (
                      <video src={m.url} muted preload="metadata" className="size-full object-cover" />
                    )}
                    <span
                      className={cn('tag absolute top-0 left-0', i === 0 ? 'bg-sun text-ink' : 'bg-ink text-white')}
                    >
                      {i === 0 ? 'Sampul' : m.kind === 'image' ? 'Foto' : m.kind === 'video' ? 'Video' : 'YouTube'}
                    </span>
                  </div>
                  <div className="space-y-2 p-3">
                    <Input
                      value={m.caption}
                      onChange={(e) =>
                        setList((l) => l.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))
                      }
                      placeholder="Keterangan (opsional)"
                      maxLength={200}
                      className="h-9 text-sm"
                    />
                    <div className="flex justify-end">
                      <ItemTools
                        index={i}
                        total={list.length}
                        onMove={(a, b) => setList((l) => move(l, a, b))}
                        onRemove={() => setList((l) => l.filter((_, j) => j !== i))}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </EditorSection>
  );
}

/* ───────────────────────── PANDUAN ───────────────────────── */

function GuideSection({ group, onDirty }: SectionProps) {
  const initial = { components: group.components, usage_steps: group.usage_steps };
  const [components, setComponents] = useState<string[]>(initial.components);
  const [steps, setSteps] = useState<UsageStep[]>(initial.usage_steps);
  const [draft, setDraft] = useState('');
  const dirty = useDirty({ components, usage_steps: steps }, initial, onDirty);

  function addComponent() {
    const parts = draft
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    setComponents((c) => [...c, ...parts]);
    setDraft('');
  }

  const updateStep = (i: number, patch: Partial<UsageStep>) =>
    setSteps((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <EditorSection
      title="Komponen & cara penggunaan"
      description="Daftar alat/bahan, lalu langkah demi langkah menggunakan prototype."
      dirty={dirty}
      onSave={() => saveGuide(group.id, { components, usage_steps: steps })}
    >
      <Field
        label="Komponen yang digunakan"
        hint="Tekan Enter atau pisahkan dengan koma untuk menambah beberapa sekaligus."
      >
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addComponent();
              }
            }}
            placeholder="mis. ESP32, Sensor LDR, Relay 5V"
          />
          <Button variant="sun" onClick={addComponent} className="h-11">
            <Plus /> Tambah
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <AnimatePresence initial={false}>
            {components.map((c, i) => (
              <motion.span
                key={c + i}
                layout
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="inline-flex items-center gap-1.5 border-[2.5px] border-ink bg-sun py-1 pr-1 pl-2.5 text-sm font-semibold"
              >
                {c}
                <button
                  type="button"
                  onClick={() => setComponents((l) => l.filter((_, j) => j !== i))}
                  className="grid size-6 place-items-center hover:bg-red hover:text-white"
                  aria-label={`Hapus ${c}`}
                >
                  <X className="size-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </Field>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="label">Langkah penggunaan</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSteps((s) => [...s, { title: '', detail: '' }])}
            disabled={steps.length >= 20}
          >
            <Plus /> Tambah langkah
          </Button>
        </div>
        {steps.length === 0 && (
          <p className="border-[3px] border-dashed border-ink/40 p-6 text-center text-sm font-semibold text-muted-foreground">
            Belum ada langkah. Contoh: “Sambungkan adaptor”, “Hubungkan ke Wi-Fi”, “Uji sensor”.
          </p>
        )}
        <AnimatePresence initial={false}>
          {steps.map((s, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="flex gap-3 border-[3px] border-ink bg-cream p-3"
            >
              <span className="grid size-11 shrink-0 place-items-center border-[3px] border-ink bg-blue font-display text-2xl text-white">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <Input
                  value={s.title}
                  onChange={(e) => updateStep(i, { title: e.target.value })}
                  placeholder="Judul langkah"
                  maxLength={100}
                  className="h-10"
                />
                <Textarea
                  value={s.detail}
                  onChange={(e) => updateStep(i, { detail: e.target.value })}
                  placeholder="Penjelasan detail"
                  rows={2}
                  maxLength={600}
                  className="min-h-16"
                />
                <div className="flex justify-end">
                  <ItemTools
                    index={i}
                    total={steps.length}
                    onMove={(a, b) => setSteps((l) => move(l, a, b))}
                    onRemove={() => setSteps((l) => l.filter((_, j) => j !== i))}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </EditorSection>
  );
}

/* ───────────────────────── REMOTE ───────────────────────── */

const REMOTE_PRESETS = [
  { label: 'Self Host', url: 'https://' },
  { label: 'Blynk Dashboard', url: 'https://blynk.cloud' },
  { label: 'Arduino IoT Cloud', url: 'https://app.arduino.cc' },
  { label: 'Bot Telegram', url: 'https://t.me/' },
  { label: 'ThingSpeak', url: 'https://thingspeak.mathworks.com' },
  { label: 'Panel Web ESP32', url: 'http://192.168.4.1' },
];

function RemoteSection({ group, onDirty }: SectionProps) {
  const initial = { remote_url: group.remote_url, remote_label: group.remote_label, remote_note: group.remote_note };
  const [v, setV] = useState(initial);
  const dirty = useDirty(v, initial, onDirty);

  return (
    <EditorSection
      title="Akses remote modul"
      description="Link untuk mengontrol/memantau prototype dari jarak jauh. Tombol ini tampil menonjol di portal."
      dirty={dirty}
      onSave={() => saveRemote(group.id, v)}
    >
      <Field label="Platform (pilih cepat)">
        <div className="flex flex-wrap gap-2">
          {REMOTE_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setV((s) => ({ ...s, remote_label: p.label, remote_url: s.remote_url || p.url }))}
              className={cn(
                'label border-[2.5px] border-ink px-3 py-2 transition-colors',
                v.remote_label === p.label ? 'bg-blue text-white' : 'bg-paper hover:bg-sun',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </Field>
      <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
        <Field label="Nama tombol / platform" htmlFor="rlabel">
          <Input
            id="rlabel"
            value={v.remote_label}
            onChange={(e) => setV((s) => ({ ...s, remote_label: e.target.value }))}
            maxLength={60}
            placeholder="Blynk Dashboard"
          />
        </Field>
        <Field label="Link akses remote" htmlFor="rurl" hint="Harus diawali http:// atau https://">
          <div className="relative">
            <Link2 className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="rurl"
              type="url"
              value={v.remote_url}
              onChange={(e) => setV((s) => ({ ...s, remote_url: e.target.value }))}
              placeholder="https://…"
              className="pl-10"
            />
          </div>
        </Field>
      </div>
      <Field
        label="Catatan untuk pengunjung"
        htmlFor="rnote"
        hint="mis. akun demo, Wi-Fi yang harus disambung, atau perintah bot."
      >
        <Textarea
          id="rnote"
          value={v.remote_note}
          onChange={(e) => setV((s) => ({ ...s, remote_note: e.target.value }))}
          rows={3}
          maxLength={400}
        />
      </Field>
      {v.remote_url && (
        <div className="border-[3px] border-ink bg-green p-4">
          <p className="label mb-3">Pratinjau tombol di portal</p>
          <Button variant="default" asChild className="w-full justify-between sm:w-auto">
            <a
              href={/^https?:\/\//.test(v.remote_url) ? v.remote_url : undefined}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Radio /> Buka kontrol remote
            </a>
          </Button>
        </div>
      )}
    </EditorSection>
  );
}
