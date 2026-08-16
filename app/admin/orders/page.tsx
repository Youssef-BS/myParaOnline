'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Eye, Download } from 'lucide-react'
import { formatPrice } from '@/lib/format'

interface Order {
  id: string
  created_at: string
  total: number
  status: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [supabase])

  const fetchOrders = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      setOrders(data || [])
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    await fetchOrders()
  }

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm('Delete this order? This action cannot be undone.')) {
      return
    }

    const { error } = await supabase.from('orders').delete().eq('id', orderId)

    if (error) {
      window.alert(error.message || 'Failed to delete this order.')
      return
    }

    await fetchOrders()
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
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
        <p className="text-slate-400">Manage customer orders</p>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      <p className="text-white font-mono text-sm">
                        {order.id.slice(0, 8)}...
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300">
                        {order.customer_name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300">{formatDate(order.created_at)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-bold">
{formatPrice(order.total)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        className="px-3 py-1 rounded-lg text-sm border border-slate-600 bg-slate-700 text-white focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition"
                          aria-label="View order"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                          aria-label="Delete order"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}

function OrderDetailModal({
  order,
  onClose,
}: {
  order: any
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Order Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Order ID</p>
              <p className="text-white font-mono break-all">{order.id}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Status</p>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-500/20 text-blue-400">
                {order.status}
              </span>
            </div>
          </div>

          {/* Customer Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Email</p>
              <p className="text-white break-all">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Phone</p>
              <p className="text-white">{order.customer_phone || '-'}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <p className="text-white font-semibold mb-3">Shipping Address</p>
            <div className="text-slate-300 space-y-1">
              <p>{order.shipping_address?.fullName}</p>
              <p>{order.shipping_address?.street}</p>
              <p>
                {order.shipping_address?.city}, {order.shipping_address?.state}{' '}
                {order.shipping_address?.zipCode}
              </p>
              <p>{order.shipping_address?.country}</p>
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t border-slate-700 pt-4">
            <div className="flex justify-between text-lg">
              <span className="text-white font-bold">Total</span>
              <span className="text-green-400 font-bold">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
