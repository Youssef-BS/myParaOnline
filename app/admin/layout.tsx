'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { LogOut, Package, ShoppingCart, Users, LayoutDashboard, Tag, Menu, X } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false)
      return
    }

    let cancelled = false
    const supabase = createClient()

    const checkAdmin = async () => {
      try {
        const { data, error: userError } = await supabase.auth.getUser()
        if (userError || !data.user) {
          if (!cancelled) router.replace('/admin/login')
          return
        }

        const response = await fetch('/api/admin/check', { cache: 'no-store' })
        if (!response.ok) throw new Error('Admin check failed')
        const { isAdmin } = await response.json()

        if (cancelled) return
        if (!isAdmin) {
          router.replace('/')
          return
        }

        setUser(data.user)
        setIsAdmin(true)
      } catch (error) {
        console.error('[v0] Admin check error:', error)
        if (!cancelled) router.replace('/admin/login')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    checkAdmin()
    return () => {
      cancelled = true
    }
  }, [pathname, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
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
      {/* Backdrop (mobile only, shown while the drawer is open) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-700 bg-slate-900 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-white">Admin Panel</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-slate-400 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink href="/admin" icon={<LayoutDashboard size={20} />}>
            Dashboard
          </NavLink>
          <NavLink href="/admin/products" icon={<Package size={20} />}>
            Products
          </NavLink>
          <NavLink href="/admin/categories" icon={<Tag size={20} />}>
            Categories
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
          <div className="text-sm text-slate-400 px-4 py-2 truncate">
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
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-300 hover:text-white"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="font-bold text-white">Admin Panel</span>
          <div className="w-9" />
        </div>

        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-900 to-slate-950">
          {children}
        </div>
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
