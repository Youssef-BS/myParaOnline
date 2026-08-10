'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Mail, Lock, User, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error: signupError, data } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signupError) throw signupError

      if (data.user) {
        // Create user profile
        const [firstName, lastName] = name.split(' ')
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName || '',
        })
      }

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-slate-950 dark:to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-xl">HealthHub</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Join HealthHub</h1>
          <p className="text-gray-600 dark:text-slate-400">
            Create an account to start shopping
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Must be at least 6 characters
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
