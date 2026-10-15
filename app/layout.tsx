import type { Metadata, Viewport } from "next"
import { Anton, Archivo, JetBrains_Mono, Permanent_Marker } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SITE } from "@/lib/site"
import "./globals.css"

const display = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
})

const body = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
})

const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
})

const marker = Permanent_Marker({
  variable: "--font-marker",
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s · ${SITE.short}` },
  description: SITE.description,
}

export const viewport: Viewport = {
  themeColor: "#1238e8",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} ${code.variable} ${marker.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
