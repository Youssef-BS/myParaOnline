'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Leaf, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { createClient } from '@/lib/supabase'
import { addToCart } from '@/lib/cart'
import { getEffectivePrice } from '@/lib/format'
import { useLocale } from '@/components/locale-provider'
import { useToast } from '@/components/toast-provider'

type Product = {
  id: string
  name: string
  price: number
  discount_price?: number | null
  image_url?: string
  category_name?: string
}

type Category = { id: string; name: string; slug: string }

const categoryStyles = [
  { eyebrow: 'Skin health', tone: 'bg-primary/10 text-primary' },
  { eyebrow: 'Daily care', tone: 'bg-accent/10 text-accent' },
  { eyebrow: 'Wellbeing', tone: 'bg-secondary/10 text-secondary' },
  { eyebrow: 'Family care', tone: 'bg-primary/10 text-primary' },
  { eyebrow: 'Beauty', tone: 'bg-accent/10 text-accent' },
  { eyebrow: 'First aid', tone: 'bg-secondary/10 text-secondary' },
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLocale()
  const { showToast } = useToast()

  useEffect(() => {
    let active = true
    const supabase = createClient()
    async function fetchData() {
      const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
        supabase.from('products').select('*').eq('is_active', true).limit(8),
        supabase.from('categories').select('*').limit(6),
      ])
      if (active) {
        setProducts(productsData ?? [])
        setCategories(categoriesData ?? [])
        setLoading(false)
      }
    }
    fetchData()
    return () => { active = false }
  }, [])

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    addToCart({ ...product, price: getEffectivePrice(product) })
    showToast(`${product.name} — ${t('addedToCart')}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-20 lg:py-24">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/80">
                <Sparkles className="size-3.5" /> {t('heroEyebrow')}
              </div>
              <h1 className="max-w-xl text-balance font-serif text-5xl leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                {t('heroTitle')}
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-primary-foreground/75 sm:text-lg">
                {t('heroDescription')}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/categories" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground transition hover:brightness-95">
                  {t('shopCollection')} <ArrowRight className="size-4" />
                </Link>
                <Link href="/about" className="inline-flex items-center justify-center rounded-full border border-primary-foreground/25 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10">
                  {t('ourApproach')}
                </Link>
              </div>
            </div>
            <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4">
              <div className="flex min-h-48 flex-col justify-between rounded-[2rem] bg-secondary p-5 text-secondary-foreground sm:min-h-56 sm:p-7">
                <Leaf className="size-7" />
                <div><p className="font-serif text-3xl">01</p><p className="mt-1 text-sm leading-5 opacity-75">{t('formula')}</p></div>
              </div>
              <div className="mt-8 flex min-h-48 flex-col justify-between rounded-[2rem] bg-accent p-5 text-accent-foreground sm:min-h-56 sm:p-7">
                <BadgeCheck className="size-7" />
                <div><p className="font-serif text-3xl">02</p><p className="mt-1 text-sm leading-5 opacity-75">{t('trustedBrands')}</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-muted/40">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border px-5 py-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
            {[
              [Truck, 'fastDelivery', 'fromDoor'],
              [ShieldCheck, 'quality', 'selected'],
              [BadgeCheck, 'guidance', 'support'],
            ].map(([Icon, title, description]) => (
              <div key={title as string} className="flex items-center gap-4 px-0 py-4 sm:px-6 sm:py-2 first:sm:pl-0 last:sm:pr-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-primary"><Icon className="size-5" /></div>
                <div><p className="text-sm font-bold">{t(title as keyof ReturnType<typeof useLocale>['t'])}</p><p className="mt-0.5 text-xs text-muted-foreground">{t(description as keyof ReturnType<typeof useLocale>['t'])}</p></div>
              </div>
            ))}
          </div>
        </section>

        {categories.length > 0 && <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Start here</p><h2 className="mt-2 font-serif text-4xl tracking-[-0.03em]">{t('shopByNeed')}</h2></div><Link href="/categories" className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex">View all <ArrowRight className="size-4" /></Link></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, index) => <Link key={category.id} href={`/category/${category.slug}`} className="group rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:p-5"><div className={`mb-12 flex size-10 items-center justify-center rounded-xl text-xs font-bold ${categoryStyles[index % categoryStyles.length].tone}`}>{String(index + 1).padStart(2, '0')}</div><p className="text-sm font-bold group-hover:text-primary">{category.name}</p><p className="mt-1 text-xs text-muted-foreground">{categoryStyles[index % categoryStyles.length].eyebrow}</p></Link>)}
          </div>
        </section>}

        <section className="bg-muted/45 px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{t('theEdit')}</p><h2 className="mt-2 font-serif text-4xl tracking-[-0.03em]">{t('everydayEssentials')}</h2></div><Link href="/categories" className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex">{t('exploreProducts')} <ArrowRight className="size-4" /></Link></div>
            {loading ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="h-80 animate-pulse rounded-3xl bg-muted" />)}</div> : products.length > 0 ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} {...product} onAddToCart={handleAddToCart} />)}</div> : <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center text-muted-foreground">{t('collectionRefreshing')}</div>}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24"><div className="rounded-[2rem] bg-secondary px-6 py-12 text-secondary-foreground sm:px-12 lg:flex lg:items-center lg:justify-between lg:py-16"><div><p className="text-xs font-bold uppercase tracking-[0.16em] opacity-70">{t('calmShopping')}</p><h2 className="mt-3 max-w-xl font-serif text-4xl tracking-[-0.03em] sm:text-5xl">{t('goodChoices')}</h2><p className="mt-4 max-w-lg text-sm leading-6 opacity-75">{t('joinMyParaOnline')}</p></div><Link href="/categories" className="mt-8 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-secondary-foreground px-6 py-3.5 text-sm font-bold text-secondary transition hover:opacity-90 lg:mt-0">{t('startShopping')} <ArrowRight className="size-4" /></Link></div></section>
      </main>
    </div>
  )
}
