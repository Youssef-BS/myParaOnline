'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase'
import { ProductCard } from '@/components/product-card'
import { useParams } from 'next/navigation'
import { addToCart } from '@/lib/cart'
import { getEffectivePrice } from '@/lib/format'
import { useToast } from '@/components/toast-provider'

export default function CategoryDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [category, setCategory] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { showToast } = useToast()

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        // Fetch category by slug
        const { data: categoryData } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single()

        setCategory(categoryData)

        if (categoryData) {
          // Fetch products for this category
          const { data: productsData } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .eq('category_id', categoryData.id)

          setProducts(productsData || [])
        }
      } catch (error) {
        console.error('Error fetching category:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCategoryAndProducts()
    }
  }, [slug, supabase])

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    addToCart({ ...product, price: getEffectivePrice(product) })
    showToast(`${product.name} added to cart`)
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="h-96 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          </div>
        </main>
      </>
    )
  }

  if (!category) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">Category not found</h1>
            <a href="/categories" className="text-green-600 hover:underline">
              Back to categories
            </a>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
        {category.image_url && (
          <div className="relative h-48 sm:h-64 w-full overflow-hidden">
            <Image src={category.image_url} alt={category.name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{category.name}</h1>
              </div>
            </div>
          </div>
        )}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {!category.image_url && <h1 className="text-4xl font-bold mb-2">{category.name}</h1>}
          {category.description && (
            <p className="text-gray-600 dark:text-slate-400 mb-8">{category.description}</p>
          )}

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  discount_price={product.discount_price}
                  image_url={product.image_url}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                No products available in this category yet
              </p>
              <a
                href="/categories"
                className="inline-block px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
              >
                Browse Other Categories
              </a>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
