import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Serif_Display, Geist, Noto_Naskh_Arabic } from 'next/font/google'
import './globals.css'
import { LocaleProvider } from '@/components/locale-provider'
import { ToastProvider } from '@/components/toast-provider'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-dm-serif' })
const notoArabic = Noto_Naskh_Arabic({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-noto-arabic' })

export const metadata: Metadata = {
  title: 'Mypara Online — Everyday care, made simple',
  description: 'Mypara Online brings thoughtfully chosen parapharmacy essentials for skin, body, and family wellbeing.',
  generator: 'v0.app',
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f8f7f2', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${geist.variable} ${dmSerif.variable} ${notoArabic.variable} bg-background`}><body className="antialiased"><LocaleProvider><ToastProvider>{children}</ToastProvider></LocaleProvider>{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
