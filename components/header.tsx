'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'

export function Header() {
  const { locale, setLocale, t } = useLocale()

  return <>
    <div className="bg-accent px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-accent-foreground">{t('freeDelivery')}</div>
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="HealthHub home"><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><span className="font-serif text-xl font-bold">H</span></span><span className="hidden font-serif text-2xl font-bold tracking-[-0.04em] sm:inline">HealthHub</span></Link>
        <nav className="hidden items-center gap-8 md:flex"><Link href="/categories" className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">{t('shop')}</Link><Link href="/categories" className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">{t('categories')}</Link><Link href="/about" className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">{t('approach')}</Link></nav>
        <div className="flex items-center gap-1"><label className="sr-only" htmlFor="language-select">{t('language')}</label><select id="language-select" value={locale} onChange={(event) => setLocale(event.target.value as 'en' | 'fr' | 'ar')} className="h-9 rounded-full border border-border bg-background px-2 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary" aria-label={t('language')}><option value="en">EN</option><option value="fr">FR</option><option value="ar">ع</option></select><button type="button" className="hidden rounded-full p-2.5 text-muted-foreground transition hover:bg-muted hover:text-foreground sm:block" aria-label="Search"><Search className="size-5" /></button><Link href="/cart" className="relative rounded-full p-2.5 text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label={t('cart')}><ShoppingCart className="size-5" /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-accent" /></Link><button type="button" className="rounded-full p-2.5 text-muted-foreground md:hidden" aria-label="Open menu"><Menu className="size-5" /></button></div>
      </div>
    </header>
  </>
}
