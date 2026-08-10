'use client'

import { useEffect, useState } from 'react'
import { Mail, Calendar, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/format'

interface Customer {
  email: string
  full_name: string | null
  phone: string | null
  orders_count: number
  total_spent: number
  last_order_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers', { cache: 'no-store' })
      if (!response.ok) throw new Error('Failed to fetch customers')
      const { customers } = await response.json()
      setCustomers(customers || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Customers</h1>
        <p className="text-slate-400">Guest customers, derived from orders placed</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">Total Customers</p>
          <p className="text-3xl font-bold text-white">{customers.length}</p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No customers yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Orders
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Total Spent
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Last Order
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {customers.map((customer) => (
                  <tr key={customer.email} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">
                        {customer.full_name || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail size={16} />
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300">
                        {customer.phone || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <ShoppingBag size={16} />
                        {customer.orders_count}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-bold">
                        {formatPrice(customer.total_spent)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar size={16} />
                        {formatDate(customer.last_order_at)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
