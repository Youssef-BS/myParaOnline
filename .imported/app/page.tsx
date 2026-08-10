'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { createClient } from '@/lib/supabase'
import { Leaf } from 'lucide-react'

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .limit(12)

        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .limit(6)

        setProducts(productsData || [])
        setCategories(categoriesData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const handleAddToCart = async (productId: string) => {
    const { data: user } = await supabase.auth.getUser()
    
    if (!user.user) {
      window.location.href = '/login'
      return
    }

    try {
      const { error } = await supabase
        .from('carts')
        .insert({
          user_id: user.user.id,
          product_id: productId,
          quantity: 1,
        })
        .select()

      if (error?.code === '23505') {
        // Unique constraint violation - product already in cart, increment quantity
        await supabase
          .from('carts')
          .update({ quantity: 2 })
          .match({ user_id: user.user.id, product_id: productId })
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
                <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                  Premium Health Products
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-4">
                Your wellness journey starts here
              </h1>
              <p className="text-lg text-gray-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Discover premium parapharmacy products carefully selected for your health and vitality
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="py-12 border-b border-gray-200 dark:border-slate-700">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700 p-4 text-center hover:border-green-300 dark:hover:border-green-500 transition"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 opacity-0 group-hover:opacity-100 transition" />
                    <div className="relative">
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
            
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
                  No products available yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 border-t border-gray-200 dark:border-slate-700">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-4">New to HealthHub?</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of customers who trust us for their health and wellness needs
            </p>
            <Link
              href="/login"
              className="inline-block px-8 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Create an Account
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
