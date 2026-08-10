'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { formatPrice } from '@/lib/format'
import { useLocale } from '@/components/locale-provider'

interface ProductCardProps { id: string; name: string; price: number; image_url?: string; category_name?: string; onAddToCart?: (id: string) => void | Promise<void> }

export function ProductCard({ id, name, price, image_url, category_name, onAddToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { t } = useLocale()
  const [isAdding, setIsAdding] = useState(false)
  const handleAddToCart = async () => { setIsAdding(true); await onAddToCart?.(id); setIsAdding(false) }

  return <article className="group overflow-hidden rounded-3xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
    <div className="relative aspect-[4/4.2] overflow-hidden bg-muted">
      {image_url ? <Image src={image_url} alt={name} fill className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex size-full items-center justify-center bg-primary/5"><span className="font-serif text-5xl text-primary/20">H</span></div>}
      <button type="button" onClick={() => setIsWishlisted(!isWishlisted)} className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition hover:text-accent" aria-label={isWishlisted ? t('removeWishlist') : t('addWishlist')}><Heart className={`size-4 ${isWishlisted ? 'fill-accent text-accent' : ''}`} /></button>
      <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary backdrop-blur">{t('curated')}</span>
    </div>
    <div className="p-5"><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{category_name || t('essentials')}</p><Link href={`/product/${id}`}><h3 className="min-h-12 text-base font-bold leading-6 transition group-hover:text-primary">{name}</h3></Link><div className="mt-5 flex items-center justify-between gap-3"><span className="font-serif text-2xl font-bold tracking-[-0.03em]">{formatPrice(price)}</span><button type="button" onClick={handleAddToCart} disabled={isAdding} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60" aria-label={`Add ${name} to cart`}><ShoppingBag className="size-4" />{isAdding ? t('adding') : t('add')}</button></div></div>
  </article>
}
