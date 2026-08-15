'use client'

import { useEffect, useMemo, useState } from 'react'
import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { ProductCard } from '@/components/product-card'
import { addToCart } from '@/lib/cart'
import { getEffectivePrice } from '@/lib/format'
import { useToast } from '@/components/toast-provider'
import { useSearchParams } from 'next/navigation'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { showToast } = useToast()
  const searchTerm = (searchParams.get('q') ?? '').trim().toLowerCase()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')

        setCategories(categoriesData || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }

      const { data: productsData } = await query
      setProducts(productsData || [])
    }

    fetchProducts()
  }, [selectedCategory, supabase])

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products

    return products.filter((product) => {
      const name = String(product.name ?? '').toLowerCase()
      const categoryName = String(product.category_name ?? '').toLowerCase()
      return name.includes(searchTerm) || categoryName.includes(searchTerm)
    })
  }, [products, searchTerm])

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    addToCart({ ...product, price: getEffectivePrice(product) })
    showToast(`${product.name} added to cart`)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="mb-6 text-3xl font-bold sm:text-4xl">
            {searchTerm ? `Search results for “${searchTerm}”` : 'Product Categories'}
          </h1>

          {searchTerm && (
            <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
              Showing {filteredProducts.length} result{filteredProducts.length === 1 ? '' : 's'} for “{searchTerm}”
            </div>
          )}

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition sm:px-6 ${
                    selectedCategory === null
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600'
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition sm:px-4 ${
                      selectedCategory === category.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600'
                    }`}
                  >
                    {category.image_url && (
                      <img
                        src={category.image_url}
                        alt=""
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    )}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-xl bg-gray-200 animate-pulse dark:bg-slate-700"
                />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
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
            <div className="py-12 text-center">
              <p className="text-gray-600 dark:text-slate-400">
                {searchTerm ? 'No products match your search.' : 'No products found in this category'}
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
