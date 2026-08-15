const WISHLIST_KEY = 'wishlist'
const WISHLIST_EVENT = 'wishlist-updated'

function readWishlist(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : []
  } catch {
    return []
  }
}

function writeWishlist(items: string[]) {
  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(WISHLIST_EVENT))
}

export function getWishlist(): string[] {
  return readWishlist()
}

export function isWishlisted(productId: string): boolean {
  return getWishlist().includes(productId)
}

export function toggleWishlist(productId: string): boolean {
  const wishlist = readWishlist()
  const exists = wishlist.includes(productId)

  const next = exists ? wishlist.filter((id) => id !== productId) : [...wishlist, productId]
  writeWishlist(next)
  return !exists
}

export function clearWishlist() {
  writeWishlist([])
}

export function onWishlistChange(callback: () => void) {
  if (typeof window === 'undefined') return () => {}

  window.addEventListener(WISHLIST_EVENT, callback)
  window.addEventListener('storage', callback)

  return () => {
    window.removeEventListener(WISHLIST_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}
