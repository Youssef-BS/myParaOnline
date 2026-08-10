'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { getCart, updateCartQuantity, removeFromCart, onCartChange, type CartItem } from '@/lib/cart'
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/format'

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setCartItems(getCart())
    setLoaded(true)
    return onCartChange(() => setCartItems(getCart()))
  }, [])

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (!loaded) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                Your cart is empty
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-slate-800 overflow-hidden">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-gray-400">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-lg font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-slate-400">Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-slate-400">Tax (10%)</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6 text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-green-600">{formatPrice(total)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    href="/"
                    className="w-full mt-3 text-center py-3 rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
