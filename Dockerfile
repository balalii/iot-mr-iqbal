# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ---------- deps ----------
FROM base AS deps
RUN npm install -g bun@1.3.14
# postinstall menjalankan `prisma generate`, jadi skema & prisma.config.ts ikut disalin.
COPY package.json bun.lock prisma.config.ts ./
COPY prisma ./prisma
RUN bun install --frozen-lockfile

# ---------- build ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/lib/generated ./lib/generated
COPY . .

# NEXT_PUBLIC_* di-inline ke bundle saat build (alamat portal untuk QR).
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_TELEMETRY_DISABLED=1

# Build tidak butuh database (lib/data.ts menunggu io() sebelum query).
# Versi Prisma & Next dicatat untuk Prisma CLI di runtime.
RUN npm run build \
 && node -p "require('prisma/package.json').version" > /tmp/prisma-version \
 && node -p "require('next/package.json').version" > /tmp/next-version

# ---------- runtime ----------
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Prisma CLI (versi sama dengan lockfile) untuk `prisma migrate deploy` saat container start.
# Dipasang terpisah di /opt/prisma karena prisma.config.ts meng-import `prisma/config` dan
# `@next/env`, yang tidak ada di node_modules hasil standalone.
COPY --from=builder /tmp/prisma-version /tmp/next-version /tmp/
RUN mkdir -p /opt/prisma && cd /opt/prisma \
 && npm init -y > /dev/null \
 && npm install --no-fund --no-audit prisma@$(cat /tmp/prisma-version) @next/env@$(cat /tmp/next-version) \
 && npm cache clean --force
COPY --from=builder /app/prisma.config.ts /opt/prisma/
COPY --from=builder /app/prisma /opt/prisma/prisma

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
# Folder upload lokal (dipakai kalau R2 tidak dikonfigurasi) harus bisa ditulis user app.
RUN mkdir -p /app/data/uploads && chown -R nextjs:nodejs /app/data

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["sh", "-c", "cd /opt/prisma && ./node_modules/.bin/prisma migrate deploy && cd /app && exec node server.js"]
