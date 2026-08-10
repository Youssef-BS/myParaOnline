'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { X, Loader2 } from 'lucide-react'

interface CategoryFormProps {
  category?: any
  onClose: () => void
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function CategoryForm({ category, onClose }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    is_active: category?.is_active ?? true,
  })
  const [slugTouched, setSlugTouched] = useState(!!category?.slug)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugTouched ? prev.slug : slugify(name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const data = {
        name: formData.name.trim(),
        slug: slugify(formData.slug || formData.name),
        description: formData.description.trim() || null,
        is_active: formData.is_active,
      }

      if (!data.name) throw new Error('Name is required')
      if (!data.slug) throw new Error('Slug is required')

      if (category) {
        const { error: updateError } = await supabase
          .from('categories')
          .update(data)
          .eq('id', category.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('categories')
          .insert(data)

        if (insertError) throw insertError
      }

      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save category')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-lg w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">
            {category ? 'Edit Category' : 'Create Category'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => {
                setSlugTouched(true)
                setFormData({ ...formData, slug: e.target.value })
              }}
              placeholder="auto-generated-from-name"
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
            />
            <p className="text-xs text-slate-500 mt-1">Used in the category URL, e.g. /category/{formData.slug || 'example'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="category-is-active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="w-4 h-4 rounded border-slate-600 bg-slate-700"
            />
            <label htmlFor="category-is-active" className="text-sm font-medium text-slate-200">
              Active
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
