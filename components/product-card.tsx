'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { formatPrice, hasDiscount, getEffectivePrice } from '@/lib/format'
import { useLocale } from '@/components/locale-provider'

interface ProductCardProps { id: string; name: string; price: number; discount_price?: number | null; image_url?: string; category_name?: string; onAddToCart?: (id: string) => void | Promise<void> }

export function ProductCard({ id, name, price, discount_price, image_url, category_name, onAddToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { t } = useLocale()
  const [isAdding, setIsAdding] = useState(false)
  const handleAddToCart = async () => { setIsAdding(true); await onAddToCart?.(id); setIsAdding(false) }
  const onSale = hasDiscount({ price, discount_price })
  const effectivePrice = getEffectivePrice({ price, discount_price })
  const discountPercent = onSale ? Math.round((1 - effectivePrice / price) * 100) : 0

  return <article className="group overflow-hidden rounded-3xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
    <div className="relative aspect-[4/4.2] overflow-hidden bg-muted">
      {image_url ? <Image src={image_url} alt={name} fill className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex size-full items-center justify-center bg-primary/5"><span className="font-serif text-5xl text-primary/20">M</span></div>}
      <button type="button" onClick={() => setIsWishlisted(!isWishlisted)} className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition hover:text-accent" aria-label={isWishlisted ? t('removeWishlist') : t('addWishlist')}><Heart className={`size-4 ${isWishlisted ? 'fill-accent text-accent' : ''}`} /></button>
      {onSale ? <span className="absolute bottom-3 left-3 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-accent-foreground">-{discountPercent}%</span> : <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary backdrop-blur">{t('curated')}</span>}
    </div>
    <div className="p-4 sm:p-5">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{category_name || t('essentials')}</p>
      <Link href={`/product/${id}`}>
        <h3 className="min-h-12 text-base font-bold leading-6 transition group-hover:text-primary">{name}</h3>
      </Link>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-baseline gap-2">
          {onSale ? <><span className="font-serif text-2xl font-bold tracking-[-0.03em] text-accent">{formatPrice(effectivePrice)}</span><span className="text-sm text-muted-foreground line-through">{formatPrice(price)}</span></> : <span className="font-serif text-2xl font-bold tracking-[-0.03em]">{formatPrice(price)}</span>}
        </span>
        <button type="button" onClick={handleAddToCart} disabled={isAdding} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60 sm:w-auto" aria-label={`Add ${name} to cart`}><ShoppingBag className="size-4" />{isAdding ? t('adding') : t('add')}</button>
      </div>
    </div>
  </article>
}
