'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Loader2, AlertCircle } from 'lucide-react'

export default function AdminSetupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Sign in as admin
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      if (!data.user) throw new Error('Failed to sign in')

      // Update user profile to be admin
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ is_admin: true })
        .eq('id', data.user.id)

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to setup admin')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-slate-950 dark:to-slate-900 px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Setup Complete!</h1>
          <p className="text-gray-600 dark:text-slate-400">
            Redirecting to admin dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-slate-950 dark:to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-xl">HealthHub</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Admin Setup</h1>
          <p className="text-gray-600 dark:text-slate-400">
            Grant admin privileges to an account
          </p>
        </div>

        <form onSubmit={handleSetupAdmin} className="space-y-4">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 flex gap-3">
              <AlertCircle className="text-red-700 dark:text-red-400 flex-shrink-0" size={18} />
              <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@healthhub.com"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Setting up admin...
              </>
            ) : (
              'Grant Admin Access'
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-slate-400 mt-6 text-sm">
          <Link href="/admin" className="text-green-600 dark:text-green-400 hover:underline">
            Go to Admin Dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
