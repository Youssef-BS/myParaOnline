'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ShoppingCart, Package, Users, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/lib/format'

interface StatCard {
  icon: React.ReactNode
  label: string
  value: string | number
  change?: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orders, products, profiles] = await Promise.all([
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        ])

        const totalRevenue = await supabase
          .from('orders')
          .select('total')
          .then(({ data }) =>
            data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
          )

        setStats({
          totalOrders: orders.count || 0,
          totalProducts: products.count || 0,
          totalCustomers: profiles.count || 0,
          totalRevenue,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  const statCards: StatCard[] = [
    {
      icon: <ShoppingCart size={24} className="text-blue-500" />,
      label: 'Total Orders',
      value: stats.totalOrders,
      change: '+12% from last month',
    },
    {
      icon: <Package size={24} className="text-purple-500" />,
      label: 'Products',
      value: stats.totalProducts,
      change: 'Active products',
    },
    {
      icon: <Users size={24} className="text-green-500" />,
      label: 'Customers',
      value: stats.totalCustomers,
      change: 'Registered users',
    },
    {
      icon: <TrendingUp size={24} className="text-orange-500" />,
      label: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      change: 'All time',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here&apos;s your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div>{card.icon}</div>
            </div>
            <p className="text-slate-400 text-sm mb-2">{card.label}</p>
            <p className="text-3xl font-bold text-white mb-2">{card.value}</p>
            {card.change && (
              <p className="text-xs text-slate-500">{card.change}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Start</h2>
          <div className="space-y-3">
            <QuickLink href="/admin/products?new=true" label="Add New Product" />
            <QuickLink href="/admin/categories?new=true" label="Create Category" />
            <QuickLink href="/admin/orders" label="View All Orders" />
            <QuickLink href="/admin/customers" label="Manage Customers" />
          </div>
        </div>

        {/* Store Information */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Store Information</h2>
          <div className="space-y-3 text-slate-300 text-sm">
            <InfoItem label="Store Name" value="HealthHub" />
            <InfoItem label="Status" value="Active" />
            <InfoItem label="Created" value="Today" />
            <InfoItem label="Settings" value="Ready to configure" />
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition text-slate-300 hover:text-white"
    >
      <span>{label}</span>
      <span className="text-lg">→</span>
    </a>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  )
}
