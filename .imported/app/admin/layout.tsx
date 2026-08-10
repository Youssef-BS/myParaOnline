'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { LogOut, Package, ShoppingCart, Users, Settings, LayoutDashboard } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/login')
        return
      }

      try {
        // Use API route to check admin status (bypasses RLS)
        const response = await fetch('/api/admin/check')
        const { isAdmin } = await response.json()

        if (!isAdmin) {
          router.push('/')
          return
        }

        setUser(data.user)
        setIsAdmin(true)
        setLoading(false)
      } catch (error) {
        console.error('[v0] Admin check error:', error)
        router.push('/')
      }
    }

    checkAdmin()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-700 bg-slate-900 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-white">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink href="/admin" icon={<LayoutDashboard size={20} />}>
            Dashboard
          </NavLink>
          <NavLink href="/admin/products" icon={<Package size={20} />}>
            Products
          </NavLink>
          <NavLink href="/admin/orders" icon={<ShoppingCart size={20} />}>
            Orders
          </NavLink>
          <NavLink href="/admin/customers" icon={<Users size={20} />}>
            Customers
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4 space-y-2">
          <div className="text-sm text-slate-400 px-4 py-2">
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-900 to-slate-950">
        {children}
      </div>
    </div>
  )
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
    >
      {icon}
      {children}
    </Link>
  )
}
