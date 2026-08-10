'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Mail, Calendar } from 'lucide-react'

interface Customer {
  id: string
  email: string
  created_at: string
  user_profiles?: {
    first_name: string
    last_name: string
    phone_number: string
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchCustomers()
  }, [supabase])

  const fetchCustomers = async () => {
    try {
      // Get users from auth
      const { data: authUsers } = await supabase.auth.admin.listUsers()
      
      // Get profiles
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*')

      // Combine data
      if (authUsers) {
        const customers = authUsers.users.map((user) => ({
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          user_profiles: profiles?.find((p) => p.id === user.id),
        }))
        setCustomers(customers)
      }
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
        <p className="text-slate-400">Manage registered customers</p>
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
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">
                        {customer.user_profiles?.first_name}{' '}
                        {customer.user_profiles?.last_name}
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
                        {customer.user_profiles?.phone_number || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar size={16} />
                        {formatDate(customer.created_at)}
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
