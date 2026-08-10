'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { X, Loader2, Upload } from 'lucide-react'

interface ProductFormProps {
  product?: any
  categories: any[]
  onClose: () => void
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function ProductForm({
  product,
  categories,
  onClose,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    category_id: product?.category_id || '',
    is_active: product?.is_active ?? true,
  })
  const [slugTouched, setSlugTouched] = useState(!!product?.slug)
  const [image, setImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      let imageUrl = product?.image_url

      // Upload image if provided
      if (image) {
        const filename = `${Date.now()}-${image.name}`
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filename, image, { upsert: true })

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from('products').getPublicUrl(filename)
        imageUrl = publicUrl
      }

      const data = {
        ...formData,
        slug: slugify(formData.slug || formData.name),
        price: parseFloat(formData.price as string),
        stock: parseInt(formData.stock as string),
        image_url: imageUrl,
      }

      if (!data.slug) throw new Error('Slug is required')

      if (product) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('products')
          .update(data)
          .eq('id', product.id)

        if (updateError) throw updateError
      } else {
        // Create new product
        const { error: insertError } = await supabase
          .from('products')
          .insert(data)

        if (insertError) throw insertError
      }

      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">
            {product ? 'Edit Product' : 'Create Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                    slug: slugTouched ? prev.slug : slugify(e.target.value),
                  }))
                }
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
              />
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

            <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Pricing & Stock</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Product Image</h3>

            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <span className="text-sm text-slate-300 cursor-pointer hover:text-white">
                  Click to upload or drag and drop
                </span>
              </label>
              {image && (
                <p className="text-sm text-green-400 mt-2">
                  {image.name}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="w-4 h-4 rounded border-slate-600 bg-slate-700"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-200">
              Active
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-slate-700">
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
                'Save Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
