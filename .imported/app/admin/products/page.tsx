'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react'
import ProductForm from '@/components/admin/product-form'

interface Product {
  id: string
  name: string
  price: number
  stock_quantity: number
  category_id: string
  is_active: boolean
  categories?: { name: string }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [supabase])

  const fetchProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false })
      setProducts(data || [])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    setCategories(data || [])
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    await supabase.from('products').delete().eq('id', id)
    await fetchProducts()
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
          <p className="text-slate-400">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={handleFormClose}
        />
      )}

      {/* Products Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        {products.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No products yet. Create one to get started.
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
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Stock
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
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{product.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300">{product.categories?.name || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">${product.price.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300">{product.stock_quantity}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.is_active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product)
                            setShowForm(true)
                          }}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                        >
                          <Trash2 size={18} />
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
    </div>
  )
}
