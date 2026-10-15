'use client';

import { useActionState, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login, type LoginState } from '@/app/actions/auth';
import { cn } from '@/lib/utils';

const ROLES = {
  student: {
    label: 'Siswa',
    hint: 'Masuk dengan akun kelompok yang dibagikan guru.',
    placeholder: 'mis. tjkt1-k1',
  },
  teacher: {
    label: 'Guru',
    hint: 'Kelola kelas, kelompok, akun siswa, dan cetak QR.',
    placeholder: 'username guru',
  },
} as const;

export function LoginForm({ showDemo }: { showDemo: boolean }) {
  const [role, setRole] = useState<keyof typeof ROLES>('student');
  const [show, setShow] = useState(false);
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const r = ROLES[role];

  return (
    <div>
      <h1 className="text-[clamp(3.4rem,8vw,4.6rem)]">Masuk</h1>
      <p className="mt-3 text-[0.95rem]">{r.hint}</p>

      <div className="mt-7 grid grid-cols-2 border-[3px] border-ink" role="tablist" aria-label="Masuk sebagai">
        {(Object.keys(ROLES) as (keyof typeof ROLES)[]).map((key, i) => {
          const active = role === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setRole(key)}
              className={cn(
                'label h-12 font-extrabold transition-colors',
                i > 0 && 'border-l-[3px] border-ink',
                active ? 'bg-blue text-white' : 'bg-paper hover:bg-sun',
              )}
            >
              {ROLES[key].label}
            </button>
          );
        })}
      </div>

      <form action={action} className="mt-6 space-y-5">
        <div className="space-y-2">
          <label htmlFor="username" className="label block">
            Username
          </label>
          <Input
            id="username"
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            placeholder={r.placeholder}
            defaultValue={state.username}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="label block">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center hover:bg-sun"
              aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {state.error && (
          <motion.p
            key={state.at}
            initial={{ x: -8 }}
            animate={{ x: [-8, 8, -5, 5, 0] }}
            transition={{ duration: 0.35 }}
            className="border-[3px] border-ink bg-red px-3 py-2.5 text-sm font-bold text-white"
            role="alert"
          >
            {state.error}
          </motion.p>
        )}

        <Button type="submit" variant="default" size="lg" className="w-full justify-between" disabled={pending}>
          {pending ? 'Memeriksa…' : `Masuk sebagai ${r.label}`}
          {pending ? <Loader2 className="size-5 animate-spin" /> : <ArrowRight className="size-5" />}
        </Button>
      </form>

      {showDemo && (
        <div className="mt-8 border-[3px] border-dashed border-ink/40 p-4 text-sm">
          <p className="label mb-2">Akun demo · khusus development</p>
          <p className="font-mono text-[0.78rem] leading-relaxed">
            Guru: guru / guru123
            <br />
            Siswa: tjkt1-k1 / siswa123
          </p>
        </div>
      )}
    </div>
  );
}
