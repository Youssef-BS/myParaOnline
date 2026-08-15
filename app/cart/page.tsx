'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { getCart, updateCartQuantity, removeFromCart, onCartChange, DELIVERY_FEE, type CartItem } from '@/lib/cart'
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
  const total = subtotal + (cartItems.length > 0 ? DELIVERY_FEE : 0)

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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="mb-6 text-3xl font-bold sm:text-4xl">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-6 text-gray-600 dark:text-slate-400">
                Your cart is empty
              </p>
              <Link
                href="/"
                className="inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center"
                    >
                      {/* Product Image */}
                      <div className="h-24 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-800 sm:h-20 sm:w-20">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="text-xs text-gray-400">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 font-semibold">{item.name}</h3>
                        <p className="text-lg font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between gap-3 sm:justify-center">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}
                            className="rounded p-1 transition hover:bg-gray-100 dark:hover:bg-slate-800"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}
                            className="rounded p-1 transition hover:bg-gray-100 dark:hover:bg-slate-800"
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="rounded p-2 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/20"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
                  <h2 className="mb-6 text-xl font-bold">Order Summary</h2>

                  <div className="mb-6 space-y-3 border-b border-gray-200 pb-6 dark:border-slate-700">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600 dark:text-slate-400">Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600 dark:text-slate-400">Delivery (livraison)</span>
                      <span className="font-semibold">{formatPrice(DELIVERY_FEE)}</span>
                    </div>
                  </div>

                  <div className="mb-6 flex justify-between gap-4 text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-green-600">{formatPrice(total)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    href="/"
                    className="mt-3 flex w-full items-center justify-center rounded-lg border border-gray-300 py-3 text-center transition hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-800"
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
