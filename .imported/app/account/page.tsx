'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase'
import { LogOut, User, Heart, Settings } from 'lucide-react'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        router.push('/login')
        return
      }

      setUser(authUser)

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setProfile(profileData)

      // Fetch user orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(name, price)
          )
        `)
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      setOrders(ordersData || [])
      setLoading(false)
    }

    loadUserData()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const { error } = await supabase
      .from('user_profiles')
      .update({
        first_name: formData.get('firstName'),
        last_name: formData.get('lastName'),
        phone_number: formData.get('phone'),
      })
      .eq('id', user.id)

    if (!error) {
      setProfile({
        ...profile,
        first_name: formData.get('firstName'),
        last_name: formData.get('lastName'),
        phone_number: formData.get('phone'),
      })
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="h-96 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          </div>
        </main>
      </>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">My Account</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-4 font-medium transition ${
                activeTab === 'profile'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 dark:text-slate-400'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-4 font-medium transition ${
                activeTab === 'orders'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 dark:text-slate-400'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              Orders
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
                />
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      defaultValue={profile?.first_name || ''}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      defaultValue={profile?.last_name || ''}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={profile?.phone_number || ''}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                >
                  Update Profile
                </button>
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="text-sm flex justify-between">
                          <span>{item.products?.name} x {item.quantity}</span>
                          <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${order.total_price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
                  <p className="text-gray-600 dark:text-slate-400 mb-4">No orders yet</p>
                  <a
                    href="/"
                    className="inline-block px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                  >
                    Start Shopping
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
