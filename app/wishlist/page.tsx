'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { createClient } from '@/lib/supabase'
import { addToCart } from '@/lib/cart'
import { getEffectivePrice } from '@/lib/format'
import { useToast } from '@/components/toast-provider'
import { getWishlist, onWishlistChange } from '@/lib/wishlist'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  price: number
  discount_price?: number | null
  image_url?: string
  category_name?: string
}

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    let active = true

    const fetchWishlistProducts = async () => {
      const ids = getWishlist()

      if (!ids.length) {
        if (active) {
          setProducts([])
          setLoading(false)
        }
        return
      }

      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('*')
        .in('id', ids)
        .eq('is_active', true)

      if (!active) return

      const ordered = (data ?? []).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
      setProducts(ordered)
      setLoading(false)
    }

    fetchWishlistProducts()

    const unsubscribe = onWishlistChange(() => {
      setLoading(true)
      fetchWishlistProducts()
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const handleAddToCart = (productId: string) => {
    const product = products.find((item) => item.id === productId)
    if (!product) return

    addToCart({ ...product, price: getEffectivePrice(product) })
    showToast(`${product.name} — Added to cart`)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Saved</p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Your wishlist</h1>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
            >
              Continue shopping
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-3xl bg-gray-200 dark:bg-slate-700" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  discount_price={product.discount_price}
                  image_url={product.image_url}
                  category_name={product.category_name}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <h2 className="text-xl font-semibold text-foreground">Your wishlist is empty</h2>
              <p className="mt-3 text-sm text-muted-foreground">Save products you love and come back here anytime.</p>
              <Link
                href="/categories"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
              >
                Browse products
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
