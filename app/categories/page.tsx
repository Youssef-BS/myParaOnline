'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { ProductCard } from '@/components/product-card'
import { addToCart } from '@/lib/cart'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

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
      if (!selectedCategory) {
        // Fetch all active products
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)

        setProducts(productsData || [])
      } else {
        // Fetch products for selected category
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('category_id', selectedCategory)

        setProducts(productsData || [])
      }
    }

    fetchProducts()
  }, [selectedCategory, supabase])

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    addToCart(product)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8">Product Categories</h1>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    selectedCategory === null
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300'
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-2 rounded-lg font-medium transition ${
                      selectedCategory === category.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image_url={product.image_url}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-slate-400">
                No products found in this category
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
