'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import CategoryForm from '@/components/admin/category-form'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={null}>
      <CategoriesPageContent />
    </Suspense>
  )
}

function CategoriesPageContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const supabase = createClient()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [supabase])

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setEditingCategory(null)
      setShowForm(true)
      router.replace('/admin/categories')
    }
  }, [searchParams, router])

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
      setCategories(data || [])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    setDeleteError(null)
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) {
      setDeleteError(
        error.message.includes('foreign key')
          ? 'This category has products assigned to it. Move or delete those products first.'
          : error.message
      )
      return
    }
    await fetchCategories()
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingCategory(null)
    fetchCategories()
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
          <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
          <p className="text-slate-400">Organize your product catalog</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {deleteError && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/20 text-red-400 text-sm">
          {deleteError}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <CategoryForm category={editingCategory} onClose={handleFormClose} />
      )}

      {/* Categories Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No categories yet. Create one to get started.
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
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Description
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
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{category.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300">{category.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300 line-clamp-1 max-w-md">
                        {category.description || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          category.is_active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(category)
                            setShowForm(true)
                          }}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
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
