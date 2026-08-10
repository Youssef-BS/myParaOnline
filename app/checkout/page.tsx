'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase'
import { getCart, clearCart, type CartItem } from '@/lib/cart'
import { CheckCircle, AlertCircle, Loader2, Home } from 'lucide-react'
import { formatPrice } from '@/lib/format'

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setCartItems(getCart())
    setLoaded(true)
  }, [])

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsProcessing(true)

    try {
      const supabase = createClient()
      const newOrderId = crypto.randomUUID()

      const { error: orderError } = await supabase.from('orders').insert({
        id: newOrderId,
        user_id: null,
        customer_name: shippingAddress.fullName,
        customer_email: shippingAddress.email,
        customer_phone: shippingAddress.phone,
        total,
        status: 'pending',
        shipping_address: shippingAddress,
      })

      if (orderError) throw orderError

      const orderItems = cartItems.map((item) => ({
        order_id: newOrderId,
        product_id: item.product_id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      clearCart()
      setOrderId(newOrderId)
      setOrderPlaced(true)
    } catch (err: any) {
      setError(err.message || 'Failed to place order')
    } finally {
      setIsProcessing(false)
    }
  }

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

  if (orderPlaced) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                Thank you for your order. We&apos;ve sent a confirmation to {shippingAddress.email}
              </p>

              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-8 mb-8 text-left">
                <h2 className="text-xl font-bold mb-4">Order Details</h2>
                <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-slate-700 mb-4">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-mono font-semibold">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 text-sm font-semibold">
                      Pending
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold mb-3">Shipping Address</h3>
                  <p>{shippingAddress.fullName}</p>
                  <p>{shippingAddress.phone}</p>
                  <p>{shippingAddress.street}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                  </p>
                  <p>{shippingAddress.country}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 text-left">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-1">
                      Next Steps
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Your order has been received and is being processed. You will receive
                      tracking information via email once your order ships.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >
                <Home size={18} />
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmitOrder} className="space-y-8">
                {error && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 flex gap-3">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Shipping Information */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            fullName: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            email: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            phone: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.street}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            street: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              city: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.state}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              state: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.zipCode}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              zipCode: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.country}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              country: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Notice */}
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-400">
                    ✓ This is a demo checkout. No payment will be processed. Your order
                    will be created with &quot;pending&quot; status.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </form>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                  {cartItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-400">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-400">Tax (10%)</span>
                    <span className="font-semibold">{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
