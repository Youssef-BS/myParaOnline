'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu, X, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/components/locale-provider'
import { getWishlist, onWishlistChange } from '@/lib/wishlist'

export function Header() {
  const { locale, setLocale, t } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const syncWishlistCount = () => setWishlistCount(getWishlist().length)
    syncWishlistCount()
    return onWishlistChange(syncWishlistCount)
  }, [])

  const navLinks = [
    { href: '/categories', label: t('shop') },
    { href: '/categories', label: t('categories') },
    { href: '/about', label: t('approach') },
  ]

  return <>
    <div className="bg-accent px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-accent-foreground sm:px-4 sm:text-[11px]">{t('freeDelivery')}</div>
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.2rem] max-w-7xl items-center justify-between gap-2 px-3 sm:h-[4.5rem] sm:gap-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 sm:gap-3" aria-label="myParaOnline.tn home">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:size-9"><span className="font-serif text-lg font-bold sm:text-xl">M</span></span>
          <span className="hidden font-serif text-xl font-bold tracking-[-0.04em] sm:inline sm:text-2xl">myParaOnline.tn</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, index) => (
            <Link key={`${link.href}-${index}`} href={link.href} className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">{link.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <label className="sr-only" htmlFor="language-select">{t('language')}</label>
          <select id="language-select" value={locale} onChange={(event) => setLocale(event.target.value as 'en' | 'fr' | 'ar')} className="h-8 rounded-full border border-border bg-background px-1.5 text-[10px] font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary sm:h-9 sm:px-2 sm:text-xs" aria-label={t('language')}>
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="ar">ع</option>
          </select>
          <button type="button" className="hidden rounded-full p-2.5 text-muted-foreground transition hover:bg-muted hover:text-foreground sm:block" aria-label="Search"><Search className="size-5" /></button>
          <Link href="/wishlist" className="relative rounded-full p-2.5 text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Wishlist">
            <Heart className="size-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-accent-foreground">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative rounded-full p-2.5 text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label={t('cart')}>
            <ShoppingCart className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-accent" />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full p-2.5 text-muted-foreground transition hover:bg-muted hover:text-foreground md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="border-t border-border/80 bg-background px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={`${link.href}-${index}`}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  </>
}
