'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export function Header() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user)
    }
    getUser()
  }, [supabase])

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">HealthHub</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/categories" className="text-sm font-medium hover:text-green-600 transition">
              Shop
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-green-600 transition">
              Categories
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-green-600 transition">
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition">
              <ShoppingCart size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
            
            {user ? (
              <Link href="/account" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition">
                <User size={20} />
              </Link>
            ) : (
              <Link href="/login" className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
