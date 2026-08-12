'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase'
import { addToCart } from '@/lib/cart'
import { useToast } from '@/components/toast-provider'
import { formatPrice, hasDiscount, getEffectivePrice } from '@/lib/format'
import { ChevronRight, Minus, Plus, ShoppingBag, PackageCheck, PackageX } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  discount_price?: number | null
  stock: number
  image_url?: string
  is_active: boolean
  categories?: { name: string; slug: string } | null
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle()

      setProduct(data)
      setLoading(false)
    }

    if (id) fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    setIsAdding(true)
    addToCart(
      { id: product.id, name: product.name, price: getEffectivePrice(product), image_url: product.image_url },
      quantity
    )
    showToast(`${product.name} — Added to cart`)
    setIsAdding(false)
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid gap-10 md:grid-cols-2">
              <div className="aspect-square rounded-2xl bg-gray-200 dark:bg-slate-800 animate-pulse" />
              <div className="space-y-4">
                <div className="h-6 w-24 rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-10 w-3/4 rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-8 w-32 rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-24 w-full rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              This product may have been removed or is no longer available.
            </p>
            <Link
              href="/categories"
              className="inline-block px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Browse Products
            </Link>
          </div>
        </main>
      </>
    )
  }

  const inStock = product.stock > 0

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
            <Link href="/" className="hover:text-green-600 transition">Home</Link>
            <ChevronRight size={14} />
            {product.categories ? (
              <>
                <Link href={`/category/${product.categories.slug}`} className="hover:text-green-600 transition">
                  {product.categories.name}
                </Link>
                <ChevronRight size={14} />
              </>
            ) : null}
            <span className="text-gray-900 dark:text-white font-medium truncate">{product.name}</span>
          </nav>

          <div className="grid gap-10 md:grid-cols-2">
            {/* Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-serif text-8xl text-primary/20">M</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {product.categories && (
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-green-600">
                  {product.categories.name}
                </p>
              )}
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              {hasDiscount(product) ? (
                <div className="flex items-baseline gap-3 mb-6">
                  <p className="text-3xl font-bold text-green-600">{formatPrice(getEffectivePrice(product))}</p>
                  <p className="text-lg text-gray-400 dark:text-slate-500 line-through">{formatPrice(product.price)}</p>
                  <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs font-bold">
                    -{Math.round((1 - getEffectivePrice(product) / product.price) * 100)}%
                  </span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-green-600 mb-6">{formatPrice(product.price)}</p>
              )}

              <div className="mb-6 flex items-center gap-2 text-sm font-semibold">
                {inStock ? (
                  <span className="flex items-center gap-1.5 text-green-600">
                    <PackageCheck size={18} /> In stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-red-600">
                    <PackageX size={18} /> Out of stock
                  </span>
                )}
              </div>

              {product.description && (
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {inStock && (
                <div className="mb-6 flex items-center gap-4">
                  <span className="text-sm font-medium">Quantity</span>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-slate-600">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-l-lg transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-r-lg transition"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock || isAdding}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ShoppingBag size={18} />
                {inStock ? (isAdding ? 'Adding…' : 'Add to Cart') : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
