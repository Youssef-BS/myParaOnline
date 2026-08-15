'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu, X, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from '@/components/locale-provider'
import { getWishlist, onWishlistChange } from '@/lib/wishlist'

export function Header() {
  const { locale, setLocale, t } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    const syncWishlistCount = () => setWishlistCount(getWishlist().length)
    syncWishlistCount()
    return onWishlistChange(syncWishlistCount)
  }, [])

  const handleSearch = () => {
    const trimmed = searchValue.trim()
    const nextUrl = trimmed ? `/categories?q=${encodeURIComponent(trimmed)}` : '/categories'
    router.push(nextUrl)
    setSearchOpen(false)
  }

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
          <div className="relative hidden items-center sm:flex">
            <button type="button" onClick={() => setSearchOpen((open) => !open)} className="rounded-full p-2.5 text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Search">
              <Search className="size-5" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-border bg-background p-2 shadow-lg">
                <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-2">
                  <Search className="size-4 text-muted-foreground" />
                  <input
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleSearch()
                    }}
                    placeholder="Search products"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    aria-label="Search products"
                  />
                </div>
                <button type="button" onClick={handleSearch} className="mt-2 w-full rounded-full bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition hover:opacity-90">
                  Search
                </button>
              </div>
            )}
          </div>
          <button type="button" onClick={() => setSearchOpen((open) => !open)} className="rounded-full p-2.5 text-muted-foreground transition hover:bg-muted hover:text-foreground sm:hidden" aria-label="Search products">
            <Search className="size-5" />
          </button>
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
      {searchOpen && (
        <div className="border-t border-border/80 bg-background px-3 pb-3 pt-2 sm:hidden">
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSearch()
              }}
              placeholder="Search products"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search products"
              autoFocus
            />
          </div>
          <button type="button" onClick={handleSearch} className="mt-2 w-full rounded-full bg-primary px-3 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90">
            Search
          </button>
        </div>
      )}
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
