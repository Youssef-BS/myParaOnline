'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    setError('')

    if (!normalizedEmail || !password) {
      setError('Enter your email and password.')
      return
    }

    setLoading(true)

    const supabase = createClient()

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password })

      if (authError || !data.user) {
        if (authError?.message.toLowerCase().includes('email not confirmed')) {
          setError('Confirm your email before signing in. You can request a new code from the verification page.')
        } else {
          setError('Invalid email or password.')
        }
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .maybeSingle()

      if (profileError) {
        await supabase.auth.signOut()
        setError('Admin access is not set up for this account. Ask an administrator to enable it.')
        return
      }

      if (!profile?.is_admin) {
        await supabase.auth.signOut()
        setError('This account does not have administrator access.')
        return
      }

      window.location.replace('/admin')
    } catch (error) {
      console.error('[v0] Admin login failed:', error)
      setError('We could not sign you in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-background shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link href="/" className="font-serif text-3xl">Mypara Online</Link>
            <div className="mt-24 max-w-sm">
              <ShieldCheck className="size-10" />
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/70">Private workspace</p>
              <h1 className="mt-4 font-serif text-5xl leading-[1.05]">Carefully managed, calmly delivered.</h1>
              <p className="mt-6 leading-7 text-primary-foreground/75">Access catalog, orders, customers, and operational insights from the Mypara Online admin workspace.</p>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/60">For authorized Mypara Online administrators only.</p>
        </section>

        <section className="flex items-center p-6 sm:p-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <Link href="/" className="font-serif text-3xl text-primary">Mypara Online</Link>
            </div>
            <div className="mb-8">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><LockKeyhole className="size-5" /></div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Administrator access</p>
              <h2 className="mt-3 font-serif text-4xl text-foreground">Welcome back.</h2>
              <p className="mt-3 leading-6 text-muted-foreground">Sign in to manage the Mypara Online storefront.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-sm font-bold">Email address</label>
                <input id="admin-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="admin@healthhub.com" />
              </div>
              <div>
                <label htmlFor="admin-password" className="mb-2 block text-sm font-bold">Password</label>
                <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Enter your password" />
              </div>
              {error && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">{error}</p>}
              <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in to admin'} <ArrowRight className="size-4" /></button>
            </form>

            <div className="mt-8 flex items-center justify-end border-t border-border pt-6 text-sm">
              <Link href="/" className="font-semibold text-primary transition hover:opacity-80">Back to storefront</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
