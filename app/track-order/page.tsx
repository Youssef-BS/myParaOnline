'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase'
import { PackageSearch, Search, CircleAlert, CheckCircle2, Truck, Clock3 } from 'lucide-react'

const STATUS_STEPS = [
  { key: 'pending', label: 'Order received', icon: Clock3 },
  { key: 'processing', label: 'Preparing', icon: PackageSearch },
  { key: 'shipped', label: 'On the way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
]

const statusOrder = ['pending', 'processing', 'shipped', 'delivered']

export default function TrackOrderPage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<any | null>(null)

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setOrder(null)

    if (!phone.trim()) {
      setError('Please enter your phone number.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const rawPhone = phone.trim()
      const normalizedPhone = rawPhone.replace(/\D/g, '')

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      const matchedOrder = (data ?? []).find((entry) => {
        const candidatePhones = [entry.customer_phone, entry.shipping_address?.phone]
          .filter(Boolean)
          .map((value) => String(value).trim())

        return candidatePhones.some((candidate) => {
          const compactCandidate = candidate.replace(/\D/g, '')
          return (
            candidate === rawPhone ||
            candidate === normalizedPhone ||
            compactCandidate === normalizedPhone ||
            compactCandidate.includes(normalizedPhone) ||
            normalizedPhone.includes(compactCandidate)
          )
        })
      })

      if (!matchedOrder) {
        setError('No order was found for this phone number.')
        return
      }

      setOrder(matchedOrder)
    } catch (err: any) {
      setError(err?.message || 'Unable to load your order status right now.')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = order ? statusOrder.indexOf(order.status ?? 'pending') : -1

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Customer care</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Track your order</h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={handleSearch} className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Search className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Look up your delivery</h2>
                  <p className="text-sm text-muted-foreground">Enter your phone number to find your latest order.</p>
                </div>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Phone number</span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="e.g. +216 12 345 678"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                  />
                </label>

                {error && (
                  <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <CircleAlert className="mt-0.5 size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Checking order...' : 'Track order'}
                </button>
              </div>
            </form>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="mb-5 text-xl font-semibold text-foreground">Order status</h2>

              {!order ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  Search for an order to see live delivery progress.
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order number</p>
                        <p className="mt-2 font-mono text-sm font-semibold text-foreground">{order.id}</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {STATUS_STEPS.map((step, index) => {
                      const Icon = step.icon
                      const isComplete = index <= currentStep
                      const isCurrent = index === currentStep

                      return (
                        <div key={step.key} className="flex items-center gap-4">
                          <div className="relative flex flex-col items-center">
                            <div className={`flex size-10 items-center justify-center rounded-full border ${
                              isComplete
                                ? 'border-primary bg-primary text-primary-foreground'
                                : isCurrent
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border bg-background text-muted-foreground'
                            }`}>
                              <Icon className="size-4" />
                            </div>
                            {index < STATUS_STEPS.length - 1 && (
                              <div className={`mt-2 h-8 w-px ${isComplete ? 'bg-primary' : 'bg-border'}`} />
                            )}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${isCurrent ? 'text-foreground' : isComplete ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {step.label}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Customer:</span> {order.customer_name || 'Guest customer'}
                    </p>
                    <p className="mt-1">
                      <span className="font-medium text-foreground">Total:</span> {order.total ? `${order.total} TND` : 'Pending'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Need help? <Link href="/about" className="font-semibold text-primary underline-offset-4 hover:underline">Contact our support team</Link>
          </div>
        </div>
      </main>
    </>
  )
}
