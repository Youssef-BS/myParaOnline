'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image_url?: string
  category_name?: string
  onAddToCart?: (id: string) => void
}

export function ProductCard({
  id,
  name,
  price,
  image_url,
  category_name,
  onAddToCart,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    if (onAddToCart) {
      await onAddToCart(id)
    }
    setIsAdding(false)
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-green-300 dark:hover:border-green-500 transition-all duration-300 hover:shadow-lg">
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-slate-800">
        {image_url ? (
          <Image
            src={image_url}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800">
            <span className="text-gray-400 dark:text-slate-500 text-sm">No image</span>
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur hover:bg-white dark:hover:bg-slate-800 transition opacity-0 group-hover:opacity-100"
          aria-label="Add to wishlist"
        >
          <Heart
            size={18}
            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-slate-300'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {category_name && (
          <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1 uppercase tracking-wide">
            {category_name}
          </p>
        )}
        
        <Link href={`/product/${id}`} className="block group/name">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover/name:text-green-600 transition mb-2">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
